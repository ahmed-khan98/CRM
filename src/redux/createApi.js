import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from '@/app/_utils/authCookies';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

let refreshPromise = null;

async function tryRefreshToken(api, extraOptions) {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const result = await rawBaseQuery(
          {
            url: 'refresh-token',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );
        const accessToken = result?.data?.data?.accessToken;
        const newRefresh = result?.data?.data?.refreshToken;
        if (accessToken) {
          setAuthCookies({
            accessToken,
            refreshToken: newRefresh || refreshToken,
          });
          return accessToken;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

function forceLogin() {
  clearAuthCookies();
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
}

const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const is401 =
    result?.error?.status === 401 ||
    result?.error?.data?.statusCode === 401;

  if (is401) {
    const url = typeof args === 'string' ? args : args?.url;
    const isRefreshCall = String(url || '').includes('refresh-token');
    if (isRefreshCall) {
      forceLogin();
      return result;
    }

    const newToken = await tryRefreshToken(api, extraOptions);
    if (newToken) {
      result = await rawBaseQuery(args, api, extraOptions);
      const still401 =
        result?.error?.status === 401 ||
        result?.error?.data?.statusCode === 401;
      if (still401) forceLogin();
      return result;
    }

    forceLogin();
  }

  return result;
};

export const createApiAuction = createApi({
  reducerPath: 'auctions',
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: [
    'watch', 'tasks', 'allTasks', 'allProjects', 'project', 'assignees',
    'notifications', 'vendors', 'vehicles', 'allEmployees',
    'Employee', 'EmployeeDocuments', 'EmployeeAllowances',
    'EmployeeSalaryHistory', 'EmployeeCarHistory', 'EmployeeFuelHistory',
    'EmployeeInsuranceHistory', 'EmployeePreviousEmployment', 'EmployeeFamily',
    'ChatConversations', 'ChatMessages', 'ChatCalls', 'ChatBlocks',
    'LeaveTypes', 'LeaveHolidays', 'LeaveBalances', 'LeaveRequests', 'TeamLeave',
    'PayrollRun', 'PayrollSettings', 'PayrollPayslips',
    'RecruitmentDashboard', 'RecruitmentJobs', 'RecruitmentApplications',
    'RecruitmentCandidates', 'RecruitmentInterviews', 'RecruitmentOffers',
    'RecruitmentSettings', 'RecruitmentEmailTemplates', 'PublicCareers',
    'PublicJoining', 'RecruitmentJoining',
  ],
  endpoints: () => ({}),
});

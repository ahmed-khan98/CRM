import { createApiAuction } from "@/redux/createApi";
import {
  setLeadImportProgress,
  resetLeadImportProgress,
} from "@/redux/uploadSlice";
import { BaseUrl } from "@/app/_Services/baseUrl";
import Cookies from "js-cookie";

const LeadApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (formData) => ({
        url: "lead/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allLeads"],
    }),

    importLead: builder.mutation({
      async queryFn(formData, api) {
        try {
          api.dispatch(setLeadImportProgress(0));
          const token = Cookies.get("token");
          const url = `${BaseUrl.replace(/\/$/, "")}/lead/import-excel`;

          // If we're not in the browser (SSR/Edge), fall back to fetch (no progress)
          if (typeof window === "undefined") {
            const res = await fetch(url, {
              method: "POST",
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return { error: { status: res.status, data } };
            api.dispatch(setLeadImportProgress(100));
            setTimeout(() => api.dispatch(resetLeadImportProgress()), 800);
            return { data };
          }

          // ✅ Browser: dynamically import axios to avoid "axios is not defined"
          const { default: axios } = await import("axios");

          const res = await axios.post(url, formData, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (evt) => {
              if (!evt?.total) return;
              const percent = Math.round((evt.loaded * 100) / evt.total);
              api.dispatch(setLeadImportProgress(percent));
            },
          });

          api.dispatch(setLeadImportProgress(100));
          setTimeout(() => api.dispatch(resetLeadImportProgress()), 800);
          return { data: res.data };
        } catch (error) {
          // Normalize error for RTKQ
          const status = error?.response?.status ?? 500;
          const data = error?.response?.data ?? {
            message: error?.message ?? "Upload failed",
          };
          return { error: { status, data } };
        }
      },
      invalidatesTags: ["allLeads"],
    }),

    updateLead: builder.mutation({
      query: (formData) => ({
        url: `lead/${formData?.id}/updateActionLead`,
        method: "PATCH",
        body: {
          lastAction: formData?.lastAction,
          lastComment: formData?.lastComment,
          lastActionDate: new Date().toISOString(),
          ...(formData?.lastAction === "schedule" && formData?.scheduleDate
            ? { scheduleDate:formData?.scheduleDate }
            : { scheduleDate: null }),
        },
      }),
      invalidatesTags: ["allLeads"],
    }),

    deleteLead: builder.mutation({
      query: (id) => ({
        url: `lead/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allLeads"],
    }),

    departmentsLead: builder.query({
      query: (id) => ({
        url: `lead/${id}/departmentLead`,
        method: "GET",
      }),
      providesTags: ["departmentLeads"],
    }),
    getLeadById: builder.query({
      query: ({id}) => ({
        url: `lead/${id}`,
        method: "GET",
      }),
      providesTags: ["singleLead"],
    }),

    brandLead: builder.query({
      query: ({ page = 1, limit = 50 ,id} = {}) =>
        `lead/${id}/brandLead?page=${page}&limit=${limit}`,
      providesTags: ["brandLead"],
    }),

    allLeads: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `lead?page=${page}&limit=${limit}`,
      providesTags: ["allLeads"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
  }),
});

export const {
  useAllLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useDepartmentsLeadQuery,
  useImportLeadMutation,
  useBrandLeadQuery,
  useGetLeadByIdQuery
} = LeadApi;

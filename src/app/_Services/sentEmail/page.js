import { createApiAuction } from "@/redux/createApi";
import {
  setLeadImportProgress,
  resetLeadImportProgress,
} from "@/redux/uploadSlice";
import { BaseUrl } from "@/app/_Services/baseUrl";
import Cookies from "js-cookie";

const SentEmailApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createSentEmail: builder.mutation({
      query: (formData) => ({
        url: "sentEmail/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allSentEmails"],
    }),

    sentBulkEmail: builder.mutation({
      query: (formData) => ({
        url: "sentEmail/sentBulk",
        method: "POST",
        body: formData,
      }),
    }),

    LeadbyEmail: builder.query({
         query: ({ page = 1, limit = 50 ,id} = {}) =>
        `sentEmail/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      providesTags: ["leadbyEmail"],
    }),

    allBulkEmails: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `sentEmail/bulk?page=${page}&limit=${limit}`,
      providesTags: ["allBulkEmails"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
  }),
});

export const {
  useAllBulkEmailsQuery,
  useCreateSentEmailMutation,
  useLeadbyEmailQuery,
  useSentBulkEmailMutation,
} = SentEmailApi;

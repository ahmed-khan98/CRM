import { createApiAuction } from "@/redux/createApi";
import {
  setLeadImportProgress,
  resetLeadImportProgress,
} from "@/redux/uploadSlice";
import { BaseUrl } from "@/app/_Services/baseUrl";
import Cookies from "js-cookie";

const BulkEmailApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createSentEmail: builder.mutation({
      query: (formData) => ({
        url: "sentEmail/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allSentEmails"],
    }),

    allSentEmails: builder.query({
      query: () =>
        `sentEmail`,
      providesTags: ["allSentEmails"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
  }),
});

export const {
 useAllSentEmailsQuery,
 useCreateSentEmailMutation,
} = BulkEmailApi;

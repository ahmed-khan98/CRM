import { createApiAuction } from "@/redux/createApi";


const SentTmEmailApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    sentTmBulkEmail: builder.mutation({
      query: (formData) => ({
        url: "sentTmEmail/sentBulk",
        method: "POST",
        body: formData,
      }),
      providesTags: ["allTmBulkEmail"],
    }),

    allTmBulkEmails: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `sentTmEmail/bulk?page=${page}&limit=${limit}`,
      providesTags: ["allTmBulkEmail"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
  }),
});

export const { useAllTmBulkEmailsQuery,useSentTmBulkEmailMutation } =
  SentTmEmailApi;

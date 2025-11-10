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
    createPaymentLink: builder.mutation({
      query: (formData) => ({
        url: "paymentlink/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allPaymentlinks"],
    }),


    updatePaymentLink: builder.mutation({
      query: (formData) => ({
        url: `paymentlink/${formData?.id}`,
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
      invalidatesTags: ["allPaymentlinks"],
    }),

    deletePaymentLink: builder.mutation({
      query: (id) => ({
        url: `paymentlink/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allPaymentlinks"],
    }),

    getPaymentLinkById: builder.query({
      query: ({id}) => ({
        url: `paymentlink/${id}`,
        method: "GET",
      }),
      providesTags: ["singlePaymentlink"],
    }),

    brandPaymentLink: builder.query({
      query: ({ page = 1, limit = 50 ,id} = {}) =>
        `paymentlink/${id}/brandPaymentLink?page=${page}&limit=${limit}`,
      providesTags: ["brandPaymentLinks"],
    }),

    allPaymentLinks: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `paymentlink?page=${page}&limit=${limit}`,
      providesTags: ["allPaymentlinks"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
  }),
});

export const {
 useAllPaymentLinksQuery,
 useBrandPaymentLinkQuery,
 useCreatePaymentLinkMutation,
 useDeletePaymentLinkMutation,
 useGetPaymentLinkByIdQuery,
 useUpdatePaymentLinkMutation
} = LeadApi;

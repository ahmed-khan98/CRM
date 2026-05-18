import { createApiAuction } from "@/redux/createApi";
import {
  setLeadImportProgress,
  resetLeadImportProgress,
} from "@/redux/uploadSlice";
import { BaseUrl } from "@/app/_Services/baseUrl";
import Cookies from "js-cookie";

const paymentApi = createApiAuction.injectEndpoints({
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

     updatePaymentStatus: builder.mutation({
      query: ({ id }) => {
        console.log(id, "updateStatusID");
        return {
          url: `paymentlink/${id}/status`,
          method: "PATCH",
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          paymentApi.util.updateQueryData(
            "getPaymentLinks",
            undefined,
            (draft) => {
              const emp = draft.find((e) => e._id === id);
              if (emp) {
                emp.isActive = emp.isActive === "enabled" ? "disabled" : "enabled";
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["allPaymentlinks"],
    }),
  }),
});

export const {
 useAllPaymentLinksQuery,
 useBrandPaymentLinkQuery,
 useCreatePaymentLinkMutation,
 useDeletePaymentLinkMutation,
 useGetPaymentLinkByIdQuery,
 useUpdatePaymentLinkMutation,
 useUpdatePaymentStatusMutation
} = paymentApi;

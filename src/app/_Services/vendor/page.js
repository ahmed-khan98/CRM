import { createApiAuction } from "@/redux/createApi";

const vendorApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.page) q.set("page", params.page);
        if (params.limit) q.set("limit", params.limit);
        if (params.search) q.set("search", params.search);
        if (params.status) q.set("status", params.status);
        if (params.sortBy) q.set("sortBy", params.sortBy);
        if (params.sortOrder) q.set("sortOrder", params.sortOrder);
        const qs = q.toString();
        return `vendor${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["vendors"],
    }),
    getVendorById: builder.query({
      query: (id) => `vendor/${id}`,
      providesTags: (r, e, id) => [{ type: "vendors", id }],
    }),
    createVendor: builder.mutation({
      query: (body) => ({ url: "vendor/add", method: "POST", body }),
      invalidatesTags: ["vendors"],
    }),
    updateVendor: builder.mutation({
      query: ({ id, body }) => ({
        url: `vendor/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    deleteVendor: builder.mutation({
      query: (id) => ({ url: `vendor/${id}`, method: "DELETE" }),
      invalidatesTags: ["vendors", "vehicles"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;

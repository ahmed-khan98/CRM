import { createApiAuction } from "@/redux/createApi";

const vehicleApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.page) q.set("page", params.page);
        if (params.limit) q.set("limit", params.limit);
        if (params.search) q.set("search", params.search);
        if (params.status) q.set("status", params.status);
        if (params.vendor) q.set("vendor", params.vendor);
        if (params.sortBy) q.set("sortBy", params.sortBy);
        if (params.sortOrder) q.set("sortOrder", params.sortOrder);
        const qs = q.toString();
        return `vehicle${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["vehicles"],
    }),
    getVehicleById: builder.query({
      query: (id) => `vehicle/${id}`,
      providesTags: (r, e, id) => [{ type: "vehicles", id }],
    }),
    createVehicle: builder.mutation({
      query: (body) => ({ url: "vehicle/add", method: "POST", body }),
      invalidatesTags: ["vehicles", "vendors"],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, body }) => ({
        url: `vehicle/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["vehicles"],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({ url: `vehicle/${id}`, method: "DELETE" }),
      invalidatesTags: ["vehicles", "vendors"],
    }),
    addVehicleMileage: builder.mutation({
      query: ({ id, body }) => ({
        url: `vehicle/${id}/mileage`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["vehicles"],
    }),
    addVehicleMaintenance: builder.mutation({
      query: ({ id, body }) => ({
        url: `vehicle/${id}/maintenance`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["vehicles"],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useAddVehicleMileageMutation,
  useAddVehicleMaintenanceMutation,
} = vehicleApi;

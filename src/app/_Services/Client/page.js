import { createApiAuction } from "@/redux/createApi";

const ClientApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: (formData) => {
        return {
          url: "client/add",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["allClients"],
    }),
    updateClient: builder.mutation({
      query: ({ id, body }) => {
        console.log(body, "updateClient");
        return {
          url: `client/${id}`,
          method: "PATCH",
          body
        };
      },
      invalidatesTags: ["allClients"],
    }),
    deleteClient: builder.mutation({
      query: (id) => {
        return {
          url: `client/${id}`,
          method: "DELETE",
        }
      },
      invalidatesTags: ['allClients']
    }
    ),
    departmentsCLient: builder.query({
      query: (id) => {
        return {
          url: `client/${id}/departmentClient`,
          method: "GET",
        };
      },
      invalidatesTags: ["departmentClient"],
    }),
    allClients: builder.query({
      query: (data) => `client/`,
      providesTags: ["allClients"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
  }),
});

export const {
  useAllClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useDepartmentsCLientQuery
} = ClientApi;

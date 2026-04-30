import { createApiAuction } from "@/redux/createApi";

const monthApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createMonth: builder.mutation({
      query: (formData) => ({
        url: "month/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allmonths"],
    }),
   
    allMonths: builder.query({
      query: (data) => `month/`,
      providesTags: ["allmonths"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),

    deleteMonth: builder.mutation({
      query: (id) => {
        return {
          url: `month/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["allmonths"],
    }),

     closeMonth: builder.mutation({
      query: ({ id }) => {
        console.log(id, "close month");
        return {
          url: `month/${id}`,
          method: "PATCH",
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          monthApi.util.updateQueryData(
            "allMonths",
            undefined,
            (draft) => {
              const emp = draft.find((e) => e._id === id);
              if (emp) {
                emp.status = emp.status === "OPEN" ? "OPEN" : "CLOSED";
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

      invalidatesTags: ["allmonths"],
    }),

  }),
});

export const {
  useAllMonthsQuery,
  useCreateMonthMutation,
  useDeleteMonthMutation,
  useCloseMonthMutation
} = monthApi;

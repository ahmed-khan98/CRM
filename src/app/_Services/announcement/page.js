import { createApiAuction } from "@/redux/createApi";

const announcementApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createAnnouncement: builder.mutation({
      query: (formData) => ({
        url: "announcement/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allAnnouncements"],
    }),
    updateAnnouncement: builder.mutation({
      query: (formData) => {
        console.log(formData, "annoucement update data");
        return {
          url: `announcement/${formData.id}`,
          method: "PATCH",
          body: {
            title: formData?.title,
            message: formData?.message,
          },
        };
      },
      invalidatesTags: ["allAnnouncements"],
    }),
    allAnnouncements: builder.query({
      query: (data) => `announcement/`,
      providesTags: ["allAnnouncements"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
    deleteAnnouncement: builder.mutation({
      query: (id) => {
        return {
          url: `announcement/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["allAnnouncements"],
    }),
     updateAnnouncementStatus: builder.mutation({
      query: ({ id }) => {
        console.log(id, "updateStatusID");
        return {
          url: `announcement/change-status/${id}`,
          method: "PATCH",
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          announcementApi.util.updateQueryData(
            "getAnnoucements",
            undefined,
            (draft) => {
              const emp = draft.find((e) => e._id === id);
              if (emp) {
                emp.isActive = emp.isActive === "active" ? "inactive" : "active";
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

      invalidatesTags: ["allAnnouncements"],
    }),
  }),
});

export const {
  useAllAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementStatusMutation
} = announcementApi;

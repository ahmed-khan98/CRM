import { createApiAuction } from "@/redux/createApi";

const ProjectApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: () => "project/",
      providesTags: ["allProjects"],
      keepUnusedDataFor: 180,
    }),
    getProjectById: builder.query({
      query: (id) => `project/${id}`,
      providesTags: (result, error, id) => [{ type: "project", id }],
    }),
    createProject: builder.mutation({
      query: (body) => ({ url: "project/", method: "POST", body }),
      invalidatesTags: ["allProjects"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({ url: `project/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => ["allProjects", { type: "project", id }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({ url: `project/${id}`, method: "DELETE" }),
      invalidatesTags: ["allProjects"],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = ProjectApi;

import { createApiAuction } from "@/redux/createApi";
import {
  setTmImportProgress,
  resetTmImportProgress,
} from "@/redux/uploadSlice";
import Cookies from "js-cookie";

const EmailListApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({
    importTmEmailList: builder.mutation({
      async queryFn(formData, api) {
        try {
          api.dispatch(setTmImportProgress(0));
          const token = Cookies.get("token");
          const url = `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/tmEmailList/importEmailList`;

          // If we're not in the browser (SSR/Edge), fall back to fetch (no progress)
          if (typeof window === "undefined") {
            const res = await fetch(url, {
              method: "POST",
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return { error: { status: res.status, data } };
            api.dispatch(setTmImportProgress(100));
            setTimeout(() => api.dispatch(resetTmImportProgress()), 800);
            return { data };
          }

          // ✅ Browser: dynamically import axios to avoid "axios is not defined"
          const { default: axios } = await import("axios");

          const res = await axios.post(url, formData, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              // "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (evt) => {
              if (!evt?.total) return;
              const percent = Math.round((evt.loaded * 100) / evt.total);
              api.dispatch(setTmImportProgress(percent));
            },
          });

          api.dispatch(setTmImportProgress(100));
          setTimeout(() => api.dispatch(resetTmImportProgress()), 800);
          return { data: res.data };
        } catch (error) {
          // Normalize error for RTKQ
          const status = error?.response?.status ?? 500;
          const data = error?.response?.data ?? {
            message: error?.message ?? "Upload failed",
          };
          return { error: { status, data } };
        }
      },
      invalidatesTags: ["allTmEmailLists"],
    }),

    allTmEmailLists: builder.query({
      query: () => `tmEmailList`,
      providesTags: ["allTmEmailLists"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),

    deleteTmEmailList: builder.mutation({
      query: (id) => ({
        url: `tmEmailList/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allTmEmailLists"],
    }),
  }),
});

export const {
  useAllTmEmailListsQuery,
  useImportTmEmailListMutation,
  useDeleteTmEmailListMutation,
} = EmailListApi;

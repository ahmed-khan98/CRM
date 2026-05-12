import { createApiAuction } from "@/redux/createApi";
import {
  setLeadImportProgress,
  resetLeadImportProgress,
} from "@/redux/uploadSlice";
import Cookies from "js-cookie";

const EmailListApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({
    importEmailList: builder.mutation({
      async queryFn(formData, api) {
        try {
          api.dispatch(setLeadImportProgress(0));
          const token = Cookies.get("token");
          const url = `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/emailList/importEmailList`;

          // If we're not in the browser (SSR/Edge), fall back to fetch (no progress)
          if (typeof window === "undefined") {
            const res = await fetch(url, {
              method: "POST",
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return { error: { status: res.status, data } };
            api.dispatch(setLeadImportProgress(100));
            setTimeout(() => api.dispatch(resetLeadImportProgress()), 800);
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
              api.dispatch(setLeadImportProgress(percent));
            },
          });

          api.dispatch(setLeadImportProgress(100));
          setTimeout(() => api.dispatch(resetLeadImportProgress()), 800);
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
      invalidatesTags: ["allEmailLists"],
    }),
    
    allEmailLists: builder.query({
      query: () => `emailList`,
      providesTags: ["allEmailLists"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),

     deleteEmailList: builder.mutation({
      query: (id) => ({
        url: `emailList/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allEmailLists"],
    }),
  }),
});

export const { useAllEmailListsQuery, useImportEmailListMutation,useDeleteEmailListMutation } = EmailListApi;

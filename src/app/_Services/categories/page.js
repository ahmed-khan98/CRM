import { createApiAuction } from "@/redux/createApi"

const categoriesApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getCategories: builder.query({
      query: () => 'user/category',
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getIsAllCategories: builder.query({
      query: () => 'user/category?isAll=1',
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getallsubCategories: builder.query({
      query: () => 'user/subcategory',
    }),
    getSubCategories: builder.query({
      query: (categoryId) => `user/subcategory/subCatByCatId/${categoryId}`,
    }),
    getIsAllSubCategories: builder.query({
      query: (categoryId) => `user/subcategory/subCatByCatId/${categoryId}?isAll=1`,
    }),
  }),
})

export const { useGetCategoriesQuery, useGetSubCategoriesQuery,useGetallsubCategoriesQuery,useGetIsAllCategoriesQuery,useGetIsAllSubCategoriesQuery } = categoriesApi
import { createApiAuction } from "@/redux/createApi"

const categoriesApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getCategories: builder.query({
      query: () => 'user/category',
    }),
    getSubCategories: builder.query({
      query: (categoryId) => `user/subcategory/getAllSubCategoriesByCategoryId/${categoryId}`,
    }),
  }),
})

export const { useGetCategoriesQuery, useGetSubCategoriesQuery } = categoriesApi
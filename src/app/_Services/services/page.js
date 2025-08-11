import { createApiAuction } from "@/redux/createApi"

const aboutApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getService: builder.query({
      query: () => 'user/service/', 
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getAuctionPage: builder.query({
      query: () => 'user/auction-page/', 
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getConsignment: builder.query({
      query: () => 'user/consignment-page/', 
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getLiquidation: builder.query({
      query: () => 'user/liquidation-page/', 
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getSidebarTitle: builder.query({
      query: () => 'user/sidebar/',
      providesTags: ['sidebar'],
      keepUnusedDataFor: 3800, 
      refetchOnMountOrArgChange: false,
    }),
    getBillBoard: builder.query({
      query: () => 'user/notice-board/',
      providesTags: ['billBoard'],
      keepUnusedDataFor: 3800, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useGetAuctionPageQuery,useGetConsignmentQuery,useGetLiquidationQuery,useGetServiceQuery,useGetSidebarTitleQuery,useGetBillBoardQuery } = aboutApi
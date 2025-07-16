import { createApiAuction } from "@/redux/createApi"
import { io } from "socket.io-client"

// Socket connection
let socket = null

export const initializeSocket = () => {
  if (socket) return socket

  try {
    // Get socket URL from environment or fallback
    const socketUrl =  "https://auction-api.devssh.xyz"

    socket = io(socketUrl, {
      // path: "/api/v1",
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,

    })

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Socket connected successfully:", socket.id)
    })
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason)
    })
console.log(socket,'socket')
    socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error---->>>>:", error.message)
      // Don't throw error, just log it
    })

    return socket
  } catch (error) {
    console.error("Failed to initialize socket:", error)
    return null
  }
}

// Get socket instance
export const getSocket = () => socket

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getSortTitle: builder.query({
      query: () => "user/sortTitle/",
      providesTags: ["sortTitle"],
      keepUnusedDataFor: 3800,
      refetchOnMountOrArgChange: false,
    }),

    getTodayyAuctionsProduct: builder.query({
      query: () => "user/product/allProducts",
      providesTags: ["auction"],
      keepUnusedDataFor: 1800,
      refetchOnMountOrArgChange: false,
      // Override with socket data
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded

          const socket = initializeSocket()

          // Listen for real-time product updates
          socket.on("product-auction-start", (updatedProducts) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProducts,
              }
            })
          })
          socket.on("product-auction-end", (updatedProducts) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProducts,
              }
            })
          })
          socket.on("product-bid", (updatedProducts) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProducts,
              }
            })
          })
          socket.on("product-dold", (updatedProducts) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProducts,
              }
            })
          })


          await cacheEntryRemoved
          socket.off("product-auction-start")
          socket.off("product-auction-end")
          socket.off("product-bid")
          socket.off("product-sold")
        } catch (error) {
          console.error("Socket connection error:", error)
        }
      },
    }),

    getMissedProduct: builder.query({
      query: () => "user/product/missedProducts",
      providesTags: ["auction"],
      keepUnusedDataFor: 1800,
      refetchOnMountOrArgChange: false,
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded

          const socket = initializeSocket()

          socket.on("missed_products_updated", (missedProducts) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: missedProducts,
              }
            })
          })

          await cacheEntryRemoved
          socket.off("missed_products_updated")
        } catch (error) {
          console.error("Socket connection error:", error)
        }
      },
    }),

    productDetail: builder.query({
      query: (id) => `user/product/${id}`,
      providesTags: ["detailproduct"],
      invalidatesTags: ["watch"],
      async onCacheEntryAdded(id, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded

          const socket = initializeSocket()

          // Join product-specific room for real-time updates
          socket.emit("join_product_room", id)

          // Listen for real-time product detail updates
          socket.on(`product-auction-start-${id}`, (updatedProduct) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProduct,
              }
            })
          })
          socket.on(`product-auction-end-${id}`, (updatedProduct) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProduct,
              }
            })
          })
          socket.on(`product-bid-${id}`, (updatedProduct) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProduct,
              }
            })
          })
          socket.on(`product-sold-${id}`, (updatedProduct) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: updatedProduct,
              }
            })
          })

       

          await cacheEntryRemoved
          socket.emit("leave_product_room", id)
          socket.off(`product-auction-start-${id}`)
          socket.off(`product-auction-end-${id}`)
          socket.off(`product-bid-${id}`)
          socket.off(`product-sold-${id}`)
        } catch (error) {
          console.error("Socket connection error:", error)
        }
      },
    }),

    relatedProducts: builder.query({
      query: (id) => `user/product/${id}/relatedProducts`,
      async onCacheEntryAdded(id, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded

          const socket = initializeSocket()

          socket.on(`related_products_${id}_updated`, (relatedProducts) => {
            updateCachedData((draft) => {
              return {
                ...draft,
                data: relatedProducts,
              }
            })
          })

          await cacheEntryRemoved
          socket.off(`related_products_${id}_updated`)
        } catch (error) {
          console.error("Socket connection error:", error)
        }
      },
    }),

    addListing: builder.mutation({
      query: (formData) => {
        return {
          url: "user/product/add/user",
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: ["auction", "detailproduct"],
    }),

    addBid: builder.mutation({
      query: (formData) => {
        return {
          url: `user/product/${formData?.id}/PlaceBid`,
          method: "POST",
          body: {
            bidAmount: formData?.bidAmount,
            bidType: formData?.bidType,
          },
        }
      },
      invalidatesTags: ["auction", "detailproduct"],
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          // Emit socket event for new bid placed
          const socket = initializeSocket()
          socket.emit(`product-bid-${formData.id}`, {
            productId: formData.id,
            bidData: data.data,
          })
        } catch (error) {
          console.error("Error placing bid:", error)
        }
      },
    }),

    addWatch: builder.query({
      query: (id) => `user/product/${id}/watch`,
      providesTags: ["watch"],
      invalidatesTags: ["auction", "detailproduct"],

    }),
  }),
})

export const {
  useGetSortTitleQuery,
  useAddListingMutation,
  useGetTodayyAuctionsProductQuery,
  useAddWatchQuery,
  useProductDetailQuery,
  useAddBidMutation,
  useGetMissedProductQuery,
  useRelatedProductsQuery,
} = productApi

// Export socket instance for use in components
export { initializeSocket }

// Default export
export default productApi

import { createApiAuction } from "@/redux/createApi"
import { io } from "socket.io-client"

// Socket connection
let socket = null

const initializeSocket = () => {
  if (socket) return socket

  try {
    // Get socket URL from environment or fallback
    const socket = io("https://auction-api.devssh.xyz", {
      transports: ["websocket"],
      secure: true,
      withCredentials: true,
    });


    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Socket connected successfully:", socket.id)
    })
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason)
    })
    socket.on("connect_error", (error) => {
      console.error("connection error---->>>>:", error)
      // Don't throw error, just log it
    })
    socket.io.on("connect_error", (err) => {
      console.error("Socket.IO connect_error:", err);
      console.error(err);
    });

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
      onCacheEntryAdded: async (arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
        try {
          await cacheDataLoaded;
          const socket = initializeSocket();
      
          // Access the cached product list
          const cachedProducts = [];
      
          updateCachedData((draft) => {
            if (Array.isArray(draft?.data)) {
              cachedProducts.push(...draft.data);
            }
          });
      
          // ✅ Loop over product IDs
          for (const product of cachedProducts) {
            const id = product._id;
      
            // Emit (optional, depends if server expects this)
            socket.emit(`product-auction-start-${id}`)
            socket.emit(`product-auction-end-${id}`)
            socket.emit(`product-bid-${id}`)
            socket.emit(`product-sold-${id}`)

            // Do the same for other events
            socket.on(`product-auction-start-${id}`, (updatedProduct) => {
              console.log(`product-auction-start-${id}`)
              updateCachedData((draft) => {
                const index = draft.data.findIndex((p) => p._id === updatedProduct._id);
                if (index !== -1) {
                  draft.data[index] = updatedProduct;
                }
              });
            });
      
            socket.on(`product-auction-end-${id}`, (updatedProduct) => {
              console.log(`product-auction-end-${id}`)

              updateCachedData((draft) => {
                const index = draft.data.findIndex((p) => p._id === updatedProduct._id);
                if (index !== -1) {
                  draft.data[index] = updatedProduct;
                }
              });
            });
      
            socket.on(`product-sold-${id}`, (updatedProduct) => {
              console.log(`product-sold-${id}`)

              updateCachedData((draft) => {
                const index = draft.data.findIndex((p) => p._id === updatedProduct._id);
                if (index !== -1) {
                  draft.data[index] = updatedProduct;
                }
              });
            });

            socket.on(`product-bid-${id}`, (updatedProduct) => {
              console.log(`product-bid-${id}`)

              updateCachedData((draft) => {
                const index = draft.data.findIndex((p) => p._id === updatedProduct._id);
                if (index !== -1) {
                  draft.data[index] = updatedProduct;
                }
              });
            });
          }
      
          // ✅ Clean up when cache is removed
          await cacheEntryRemoved;
          for (const product of cachedProducts) {
            const id = product._id;
            socket.off(`product-bid-${id}`);
            socket.off(`product-auction-start-${id}`);
            socket.off(`product-auction-end-${id}`);
            socket.off(`product-sold-${id}`);
          }
      
        } catch (error) {
          console.error("Socket connection error:", error);
        }
      }
      
    }),
    getClosingProducts: builder.query({
      query: () => "user/product/closingProducts",
      providesTags: ["closingProducts"],
      keepUnusedDataFor: 1800,
      refetchOnMountOrArgChange: false,
      // Override with socket data
      onCacheEntryAdded: async (arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
        try {
          await cacheDataLoaded;
          const socket = initializeSocket();
      
          // Access the cached product list
          const cachedProducts = [];
      
          updateCachedData((draft) => {
            if (Array.isArray(draft?.data)) {
              cachedProducts.push(...draft.data);
            }
          });
      
          // ✅ Loop over product IDs
          for (const product of cachedProducts) {
            const id = product._id;
      
            // Emit (optional, depends if server expects this)
            socket.emit(`product-auction-end-${id}`)
            
            // Do the same for other events
      
            socket.on(`product-auction-end-${id}`, (updatedProduct) => {
              console.log(`product-auction-end-${id}`)

              updateCachedData((draft) => {
                const index = draft.data.findIndex((p) => p._id === updatedProduct._id);
                if (index !== -1) {
                  draft.data[index] = updatedProduct;
                }
              });
            });
          }
      
          // ✅ Clean up when cache is removed
          await cacheEntryRemoved;
          for (const product of cachedProducts) {
            const id = product._id;
            socket.off(`product-auction-end-${id}`);
          }
      
        } catch (error) {
          console.error("Socket connection error:", error);
        }
      }
      
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
          socket.emit(`product-auction-start-${id}`)
          socket.emit(`product-auction-end-${id}`)
          socket.emit(`product-bid-${id}`)
          socket.emit(`product-sold-${id}`)

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
            console.log(updatedProduct, 'updatedProduct')
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
          // socket.emit("leave_product_room", id)
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

          socket.emit(`product-bid-${formData.id}`)
          socket.emit(`product-auction-start-${formData.id}`)
          socket.emit(`product-auction-end-${formData.id}`)
          socket.emit(`product-bid-${formData.id}`)
          socket.emit(`product-sold-${formData.id}`)

          // socket.on(`product-bid-${formData.id}`, (updatedProduct) => {
          //   console.log(updatedProduct,'updatedProduct')
          //   updateCachedData((draft) => {
          //     return {
          //       ...draft,
          //       data: updatedProduct,
          //     }
          //   })
          // })

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
  useGetClosingProductsQuery
} = productApi

// Export socket instance for use in components
export { initializeSocket }

// Default export
// export default productApi

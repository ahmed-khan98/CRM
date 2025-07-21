"use client"

import { useEffect, useState } from "react"
import { initializeSocket, getSocket } from "@/app/_Services/products/page"

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const socketInstance = initializeSocket()
      setSocket(socketInstance)

      if (socketInstance) {
        socketInstance.on("connect", () => {
          setIsConnected(true)
          setError(null)
          console.log("✅ Socket connected in hook:", socketInstance.id)
        })

        socketInstance.on("disconnect", (reason) => {
          setIsConnected(false)
          console.log("❌ Socket disconnected in hook:", reason)
        })

        socketInstance.on("connect_error", (err) => {
          setIsConnected(false)
          setError(err.message)
          console.log("🔴 Socket connection error in hook:", err.message)
        })
      }
    } catch (err) {
      setError(err.message)
      console.error("Failed to initialize socket in hook:", err)
    }

    return () => {
      const socketInstance = getSocket()
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [])

  return { socket, isConnected, error }
}

export const useProductSocket = (productId) => {
  const { socket, isConnected, error } = useSocket()

  useEffect(() => {
    if (socket && productId && isConnected) {
      console.log(`🔌 Setting up socket events for product: ${productId}`)

      // Emit the 4 socket events for this product
      socket.emit(`product-auction-start-${productId}`)
      socket.emit(`product-auction-end-${productId}`)
      socket.emit(`product-bid-${productId}`)
      socket.emit(`product-sold-${productId}`)

      return () => {
        console.log(`🧹 Cleaning up socket events for product: ${productId}`)
        // Clean up listeners when component unmounts
        socket.off(`product-bid-${productId}`)
        socket.off(`product-auction-start-${productId}`)
        socket.off(`product-auction-end-${productId}`)
        socket.off(`product-sold-${productId}`)
      }
    }
  }, [socket, productId, isConnected])

  return { socket, isConnected, error }
}

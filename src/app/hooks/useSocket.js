"use client"

import { useEffect, useState } from "react"
import { getSocket, initializeSocket } from "../_Services/products/page"

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
          console.log("✅ Socket connected:", socketInstance.id)
        })

        socketInstance.on("disconnect", (reason) => {
          setIsConnected(false)
          console.log("❌ Socket disconnected:", reason)
        })

        socketInstance.on("connect_error", (err) => {
          setIsConnected(false)
          setError(err.message)
          console.log("🔴 Socket connection error:", err.message)
        })
      }
    } catch (err) {
      setError(err.message)
      console.error("Failed to initialize socket:", err)
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
      socket.emit("join_product_room", productId)

      return () => {
        socket.emit("leave_product_room", productId)
      }
    }
  }, [socket, productId, isConnected])

  return { socket, isConnected, error }
}

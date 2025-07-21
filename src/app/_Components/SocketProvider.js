"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeSocket } from "@/app/_Services/products/page"

const SocketContext = createContext()

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return context
}

export default function SocketProvider({ children }) {
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
          console.log("✅ Socket connected in provider:", socketInstance.id)
        })

        socketInstance.on("disconnect", (reason) => {
          setIsConnected(false)
          console.log("❌ Socket disconnected in provider:", reason)
        })

        socketInstance.on("connect_error", (err) => {
          setIsConnected(false)
          setError(err.message)
          console.error("🔴 Socket connection error in provider:", err.message)
        })
      }
    } catch (err) {
      setError(err.message)
      console.error("Failed to initialize socket in provider:", err)
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const value = {
    socket,
    isConnected,
    error,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

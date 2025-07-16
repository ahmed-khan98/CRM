"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { initializeSocket } from "../_Services/products/page"


const SocketContext = createContext()

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocketContext must be used within SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = initializeSocket()
    setSocket(socketInstance)

    socketInstance.on("connect", () => {
      setIsConnected(true)
      console.log("Socket connected:", socketInstance.id)
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
      console.log("Socket disconnected")
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setIsConnected(false)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const value = {
    socket,
    isConnected,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

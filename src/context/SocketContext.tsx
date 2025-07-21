// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
  token?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, token }) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (token) {
      socketRef.current = io("https://clinicpal.onrender.com", {
        transports: ["websocket"],
        auth: { token }
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
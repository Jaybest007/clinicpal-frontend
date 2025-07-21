import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

const SocketTest = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      toast.success(`WebSocket connected: ${socket.id}`);
      console.log("WebSocket connected:", socket.id);
      socket.emit("message", "Hello from SocketTest!");
    });

    socket.on("disconnect", () => {
      toast.info("WebSocket disconnected");
      console.log("WebSocket disconnected");
    });

    socket.on("message", (msg) => {
      toast.info(`WebSocket message: ${msg}`);
      console.log("WebSocket message:", msg);
    });

    socket.on("connect_error", (err) => {
      toast.error(`WebSocket error: ${err.message}`);
      console.error("WebSocket error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("connect_error");
    };
  }, [socket]);

  return null;
};

export default SocketTest;
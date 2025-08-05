import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSocket } from "../../SocketContext"; // Adjust path to your socket context
import type { PatientsData, nextOfKinData, QueList } from "../types";

/**
 * Custom hook for managing socket events and real-time updates
 */
export const useSocketEvents = (
  setPatientsData: (data: PatientsData[]) => void,
  setNextOfKinData: (data: nextOfKinData[]) => void,
  setQueList: (data: QueList[]) => void
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Patient added event
    const handlePatientAdded = ({ patients, next_of_kin }: any) => {
      setPatientsData(patients);
      setNextOfKinData(next_of_kin);
      toast.info("A new patient was added!");
    };

    // Patient queued event
    const handleQuePatient = (queList: any) => {
      setQueList(queList);
      toast.info("A patient was added to the queue!");
    };

    // Queue action event
    const handleQueActions = (queue: any) => {
      setQueList(queue);
      toast.info("A patient was updated in the queue!");
    };

    // Register event listeners
    socket.on("patientAdded", handlePatientAdded);
    socket.on("quePatient", handleQuePatient);
    socket.on("queActions", handleQueActions);

    // Cleanup on unmount
    return () => {
      socket.off("patientAdded", handlePatientAdded);
      socket.off("quePatient", handleQuePatient);
      socket.off("queActions", handleQueActions);
    };
  }, [socket, setPatientsData, setNextOfKinData, setQueList]);
};
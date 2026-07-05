import { useState } from "react";
import toast from "react-hot-toast";
import {getCode} from "../yjs/ydoc.js";
import {
  updateLanguage,
  leaveRoom,
  disbandRoom,
} from "../services/roomApi";

import { runCode } from "../services/compilerApi";

const useRoomActions = ({
  roomId,
  user,
  code,
  language,
  input,
  fetchHistory,
  emitLanguageChange,
  navigate,
}) => {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");

  const handleRun = async () => {
    try {
      setRunning(true);
      const collaborativeCode = getCode(roomId);

      const res = await runCode({
        roomId,
        code: collaborativeCode,
        language,
        input,
      });

      const result = res.data.result;

      setOutput(
        result.stdout ||
          result.stderr ||
          result.compile_output ||
          result.message ||
          "No Output"
      );

      await fetchHistory();

    } catch (error) {

      setOutput("Execution Failed");

    } finally {

      setRunning(false);

    }
  };

  const handleLanguageChange = async (
    e,
    setLanguage
  ) => {

    const newLanguage = e.target.value;

    setLanguage(newLanguage);

    emitLanguageChange(newLanguage);

    try {

      await updateLanguage(
        roomId,
        newLanguage
      );

    } catch (error) {

      console.log(error);

    }

  };

  const handleLeaveRoom = async (
    setIsLeaving
  ) => {

    const confirmLeave = window.confirm(
      "Are you sure you want to leave this room?"
    );

    if (!confirmLeave) return;

    try {

      setIsLeaving(true);

      await leaveRoom(roomId);

      toast.success(
        "Left room successfully"
      );

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to leave room"
      );

    }

  };

  const handleDisbandRoom = async () => {

    const confirmDelete = window.confirm(
      "Are you sure?\nThis will permanently delete the room."
    );

    if (!confirmDelete) return;

    try {

      await disbandRoom(roomId);

      toast.success(
        "Room disbanded."
      );

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to disband room"
      );

    }

  };

  return {

    running,
    output,

    handleRun,

    handleLeaveRoom,

    handleDisbandRoom,

    handleLanguageChange,

  };

};

export default useRoomActions;
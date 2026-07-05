import socket from "../services/socket";
import * as Y from "yjs";

export const setupProvider = (roomId, ydoc) => {

    const handleRemoteUpdate = ({ update }) => {
        Y.applyUpdate(
            ydoc,
            new Uint8Array(update),
            "remote"
        );
    };

    socket.off("yjs-update", handleRemoteUpdate);
    socket.on("yjs-update", handleRemoteUpdate);

    const updateListener = (update, origin) => {
        if (origin === "remote") return;

        socket.emit("yjs-update", {
            roomId,
            update: Array.from(update),
        });
    };

    ydoc.on("update", updateListener);

    return () => {
        socket.off("yjs-update", handleRemoteUpdate);
        ydoc.off("update", updateListener);
    };
};
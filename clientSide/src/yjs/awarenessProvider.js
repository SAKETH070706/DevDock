import * as awarenessProtocol from "y-protocols/awareness"
import socket from "../services/socket.js";

export const setupAwareness=(roomId,awareness)=>{
    awareness.on("update",({added,updated,removed})=>{

        const changedClients=[...added,...updated,...removed];

        const update=awarenessProtocol.encodeAwarenessUpdate(awareness,changedClients);

        socket.emit("awareness-update",{
            roomId,
            update:Array.from(update)
        });
});

socket.on("awareness-update",(update)=>{
    awarenessProtocol.applyAwarenessUpdate(awareness, new Uint8Array(update),"remote");
});
};
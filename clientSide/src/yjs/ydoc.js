import * as Y from "yjs";

const docs = new Map();

export const getYDoc = (roomId) => {

    if (!docs.has(roomId)) {

        const ydoc = new Y.Doc();

        docs.set(roomId, {
            ydoc,
            ytext: ydoc.getText("monaco"),
        });

    }

    return docs.get(roomId);

};

export const getCode = (roomId) => {
    return getYDoc(roomId).ytext.toString();
};

export const removeYDoc = (roomId) => {

    const doc = docs.get(roomId);

    if (doc) {
        doc.ydoc.destroy();
        docs.delete(roomId);
    }

};
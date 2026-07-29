import { setupProvider } from "./socketProvider.js";
import { createBinding } from "./binding.js";
import { getYDoc } from "./ydoc.js";
import { createAwareness } from "./awareness.js";
import { getUserColor } from "./colors.js";
import {setupAwareness} from "./awarenessProvider.js";

export const handleEditorMount = (editor, roomId, user, initialCode) => {
    const { ydoc, ytext } = getYDoc(roomId);

    if (ytext.length === 0 && initialCode) {
        ytext.insert(0, initialCode);
    }
  const cleanupProvider = setupProvider(roomId, ydoc);
  const awareness = createAwareness(ydoc);
  setupAwareness(roomId, awareness);
  const binding = createBinding(ytext, editor, awareness);
  awareness.setLocalStateField("user",{
    name:user.username,
    color:getUserColor(user._id)
  }); 


  return () => {
    binding.destroy();
    cleanupProvider();
  };
};

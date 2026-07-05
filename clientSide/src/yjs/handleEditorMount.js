import { setupProvider } from "./socketProvider.js";
import { createBinding } from "./binding.js";
import { getYDoc } from "./ydoc.js";
import { createAwareness } from "./awareness.js";
import { getUserColor } from "./colors.js";
import {setupAwareness} from "./awarenessProvider.js";

export const handleEditorMount = (editor, roomId,user) => {
  const { ydoc, ytext } = getYDoc(roomId);
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

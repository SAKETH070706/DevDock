import OnlineUsers from "./OnlineUsers";
import ChatSection from "./ChatSection";
import ExecutionHistory from "./ExecutionHistory";

const Sidebar = ({
  onlineUsers,
  participantMap,
  messages,
  message,
  setMessage,
  sendMessage,
  history,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <OnlineUsers
        onlineUsers={onlineUsers}
        participantMap={participantMap}
      />

      <ChatSection
        messages={messages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />

      <ExecutionHistory
        history={history}
      />
    </div>
  );
};

export default Sidebar;
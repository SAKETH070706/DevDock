const ChatSection = ({ messages, message, setMessage, sendMessage }) => {
  return (
    <div
      style={{
        flex: 1,
        padding: "10px",
      }}
    >
      <h3>Chat</h3>

      {/* Messages List */}
      <div
        style={{
          height: "200px",
          overflowY: "auto",
          marginBottom: "10px",
          border: "1px solid #ddd",
          padding: "8px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.username}</strong>: {msg.message}
            </p>
          ))
        )}
      </div>

      {/* Input + Send Button */}
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <input
          style={{
            flex: 1,
            padding: "8px",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "8px 14px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;

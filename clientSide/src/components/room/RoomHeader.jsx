const RoomHeader=({room,language,isHost,onLanguageChange,onLeaveRoom,onDisbandRoom})=>{
    return (
       <>
         <div
        style={{
          height: "70px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>
          <h2>Room Name: {room.roomName}</h2>
        </div>
        <div>
          Invite Code: <strong>{room.inviteCode}</strong>
        </div>
        <div>
          <select value={language} onChange={onLanguageChange} disabled={!isHost}>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <button
          onClick={onLeaveRoom}
          style={{
            background: "#ef4444",
            color: "white",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Leave Room
        </button>
        {isHost && (

<button
    onClick={onDisbandRoom}
    style={{
        background: "#b91c1c",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        marginLeft: "10px"
    }}
>
    🗑 Disband Room
</button>

)}
      </div>
       </>
    )
};

export default RoomHeader;

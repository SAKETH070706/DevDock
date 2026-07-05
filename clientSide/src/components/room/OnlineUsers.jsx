const OnlineUsers=({onlineUsers,participantMap})=>{
    return(
        <div  style={{
              flex: 1,
              borderBottom: "1px solid #ddd",
              padding: "10px",
              }}>
              <h3>Online Users</h3>
              {onlineUsers.length===0 ?(
                <p>No Users Online</p>
              ) : (
                onlineUsers.map((onlineId)=>(<p key={onlineId}>
                      {participantMap[onlineId]?.username || "Unkmown user"}
                </p>))
              )
            }
        </div>
    );
};

export default OnlineUsers;
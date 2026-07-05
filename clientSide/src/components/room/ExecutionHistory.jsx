const ExecutionHistory = ({ history }) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "10px",
      }}
    >
      <h3>Execution History</h3>

      {history.length === 0 ? (
        <p>No executions yet.</p>
      ) : (
        history.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              marginBottom: "10px",
              padding: "8px",
            }}
          >
            <p>
              <strong>{item.user?.username}</strong>
            </p>
            <p>{item.language}</p>
            <p>{item.output}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ExecutionHistory;

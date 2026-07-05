const InputOutput = ({ input, setInput, output, running, onRun }) => {
  return (
    <div
      style={{
        width: "320px",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #ddd",
      }}
    >
      {/* Run Button + Input */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={onRun}
          disabled={running}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            background: running ? "#9ca3af" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Running..." : "▶ Run"}
        </button>

        <h3>Custom Input</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          style={{
            width: "100%",
            resize: "none",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          placeholder="Enter input..."
        />
      </div>

      {/* Output Section */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <h3>Output</h3>
        <pre
          style={{
            background: "#f9fafb",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default InputOutput;

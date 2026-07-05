import Editor from "./Editor";
import InputOutput from "./InputOutput";

const EditorWorkspace = ({
  language,
  onMount,
  input,
  setInput,
  output,
  running,
  onRun,
}) => {
  return (
    <>
      {/* Monaco Editor */}
      <div
        style={{
          flex: 3,
          borderRight: "1px solid #ddd",
          display: "flex",
        }}
      >
        <Editor
          language={language}
          onMount={onMount}
        />
      </div>

      {/* Input / Output */}
      <InputOutput
        input={input}
        setInput={setInput}
        output={output}
        running={running}
        onRun={onRun}
      />
    </>
  );
};

export default EditorWorkspace;
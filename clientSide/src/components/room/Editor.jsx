import MonacoEditor from "@monaco-editor/react";

const Editor = ({ language,onMount }) => {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs-dark"
      onMount={onMount}
      options={{
        minimap: { enabled: false },
        fontSize: 24,
        automaticLayout: true,
      }}
    />
  );
};

export default Editor;

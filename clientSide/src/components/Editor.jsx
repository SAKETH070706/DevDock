import MonacoEditor from "@monaco-editor/react";

const Editor = ({ language, code, onChange }) => {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 24,
        automaticLayout: true,
      }}
    />
  );
};

export default Editor;

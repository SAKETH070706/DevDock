import axios from "axios";

const languageMap = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

export const runCode = async (sourceCode, language,input) => {
  const language_id = languageMap[language];

  if (!language_id) {
    throw new Error("Unsupported language");
  }

  const response = await axios.post(
    "https://ce.judge0.com/submissions?wait=true",
    {
      source_code: sourceCode,
      language_id,
      stdin: input || ""
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

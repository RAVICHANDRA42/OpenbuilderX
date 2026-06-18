"use client";

import * as React from "react";
import { CodeEditor } from "@/components/code/code-editor";
import { CodeOutput } from "@/components/code/code-output";
import { post } from "@/lib/api-client";

function CodePage() {
  const [code, setCode] = React.useState(`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(f"Fibonacci(10) = {result}")`);
  const [language, setLanguage] = React.useState("python");
  const [isRunning, setIsRunning] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");
  const [executionTime, setExecutionTime] = React.useState<number | undefined>();

  const handleRun = async () => {
    setIsRunning(true);
    setError("");
    setOutput("");
    setExecutionTime(undefined);

    const startTime = Date.now();

    try {
      const data = await post<{ explanation: string }>("/code/explain", { code, language });
      setOutput(data.explanation);
    } catch (err: unknown) {
      let message = "Failed to process code. Please try again.";
      if (err && typeof err === "object") {
        const axiosErr = err as { response?: { data?: { detail?: string } }; message?: string };
        if (axiosErr.response?.data?.detail) {
          message = axiosErr.response.data.detail;
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      }
      setError(message);
    }

    setExecutionTime(Date.now() - startTime);
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Code Editor</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
          onLanguageChange={setLanguage}
          onRun={handleRun}
          isRunning={isRunning}
        />
        <CodeOutput
          output={output}
          error={error}
          executionTime={executionTime}
          language={language}
        />
      </div>
    </div>
  );
}

export default CodePage;

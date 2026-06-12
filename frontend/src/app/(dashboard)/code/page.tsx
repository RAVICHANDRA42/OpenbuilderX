"use client";

import * as React from "react";
import { CodeEditor } from "@/components/code/code-editor";
import { CodeOutput } from "@/components/code/code-output";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CodePage() {
  const [code, setCode] = React.useState(`def hello_world():
    print("Hello, OpenBuilder!")
  
if __name__ == "__main__":
    hello_world()`);
  const [language, setLanguage] = React.useState("python");
  const [isRunning, setIsRunning] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");

  const handleRun = () => {
    setIsRunning(true);
    setError("");
    setOutput("");

    setTimeout(() => {
      if (language === "python") {
        setOutput("Hello, OpenBuilder!\n\nProcess finished with exit code 0");
      } else {
        setError(`Execution failed: ${language} runtime not available in browser demo`);
      }
      setIsRunning(false);
    }, 1000);
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
          executionTime={isRunning ? undefined : 234}
          language={language}
        />
      </div>
    </div>
  );
}

export default CodePage;

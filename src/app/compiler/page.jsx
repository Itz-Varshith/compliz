
"use client";

import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Copy, Download, Terminal, Clock, Database, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const languageTemplates = {
  javascript: `// Welcome to JavaScript Editor
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
console.log("Current date:", new Date().toLocaleDateString());`,

  python: `# Welcome to Python Editor
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
print("Python version: 3.x")

# Example: List comprehension
squares = [x**2 for x in range(5)]
print("Squares:", squares)`,

  java: `// Welcome to Java Editor
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Java Programming");
        
        // Example: Simple loop
        for (int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,

  cpp: `// Welcome to C++ Editor
#include <iostream>
#include <vector>
using namespace std;

int main() {
 // your code goes here
    
    return 0;
}`,

  c: `// Welcome to C Editor
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Example: Simple loop
    for (int i = 0; i < 5; i++) {
        printf("Count: %d\\n", i);
    }
    
    return 0;
}`,
};

// Language ID mapping for Judge0 API
const languageIdMap = {
  cpp: "cpp",
  c: "c",
  python: "python",
  java: "java",
  javascript: "javascript",
};

function App() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(languageTemplates.cpp);
  const [executionResult, setExecutionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const editorRef = useRef(null);

  const languageOptions = [
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(languageTemplates[newLang] || "");
    setExecutionResult(null);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);

    try {
      const response = await fetch("http://localhost:5000/code/self", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          input,
          language: languageIdMap[language],
        }),
      });

      const data = await response.json();

      if (data.success && data.submission) {
        setExecutionResult(data.submission);
      } else {
        setExecutionResult({
          stdout: null,
          stderr: data.message || "Execution failed",
          compile_output: null,
          status: { id: 0, description: "Error" },
          time: null,
          memory: null,
          exit_code: null,
        });
      }
    } catch (error) {
      setExecutionResult({
        stdout: null,
        stderr: `Network error: ${error.message || "Unknown error"}`,
        compile_output: null,
        status: { id: 0, description: "Error" },
        time: null,
        memory: null,
        exit_code: null,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const downloadCode = () => {
    const extensions = { javascript: "js", python: "py", java: "java", cpp: "cpp", c: "c" };
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    if (!executionResult) return null;
    const statusId = executionResult.status.id;
    if (statusId === 3) return <CheckCircle2 className="text-green-600" size={18} />;
    if ([5, 6, 7, 8, 9, 10, 11, 12].includes(statusId)) return <XCircle className="text-red-600" size={18} />;
    return <AlertCircle className="text-yellow-600" size={18} />;
  };

  const getStatusColor = () => {
    if (!executionResult) return "";
    const statusId = executionResult.status.id;
    if (statusId === 3) return "bg-green-100 text-green-800 border-green-300";
    if ([5, 6, 7, 8, 9, 10, 11, 12].includes(statusId)) return "bg-red-100 text-red-800 border-red-300";
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const compareOutputs = () => {
    if (!executionResult || !expectedOutput.trim()) return null;
    return (executionResult.stdout || "").trim() === expectedOutput.trim();
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Editor Section */}
      <div className="w-3/5 overflow-hidden flex flex-col border-r border-border">
        {/* Editor Controls */}
        <div className="bg-muted px-4 py-3 flex items-center justify-between border-b border-border flex-shrink-0">
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background text-foreground px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="text-muted-foreground text-sm">{lineCount} lines</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition border border-input"
              title="Copy Code"
            >
              <Copy size={16} />
              <span className="hidden sm:inline">{showCopied ? "Copied!" : "Copy"}</span>
            </button>
            <button
              onClick={downloadCode}
              className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition border border-input"
              title="Download"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition border border-input"
              title="Toggle Theme"
            >
              {isDark ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="m17.66 17.66 1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="m6.34 17.66-1.41 1.41"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                  </svg>
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition disabled:opacity-50"
            >
              <Play size={16} />
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            theme={isDark ? "vs-dark" : "light"}
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              inlineSuggest: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              roundedSelection: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </div>

      {/* Right Panel - Input/Output Section */}
      <div className="w-2/5 overflow-hidden flex flex-col">
        {/* Top Half - Input and Expected Output Side by Side */}
        <div className="h-1/2 flex border-b border-border">
          {/* Input Section (Left) */}
          <div className="w-1/2 border-r border-border flex flex-col bg-muted/30 overflow-hidden">
            <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border flex-shrink-0">
              <Terminal size={18} className="text-blue-600" />
              <h2 className="font-semibold text-foreground">Input</h2>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input here..."
              className="flex-1 p-4 font-mono text-sm bg-background text-foreground resize-none focus:outline-none border-none overflow-auto"
            />
          </div>

          {/* Expected Output Section (Right) */}
          <div className="w-1/2 flex flex-col bg-muted/30 overflow-hidden">
            <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border flex-shrink-0">
              <Terminal size={18} className="text-green-600" />
              <h2 className="font-semibold text-foreground">Expected Output</h2>
            </div>
            <textarea
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="Enter expected output here..."
              className="flex-1 p-4 font-mono text-sm bg-background text-foreground resize-none focus:outline-none border-none overflow-auto"
            />
          </div>
        </div>

        {/* Bottom Half - Actual Output */}
        <div className="h-1/2 flex flex-col bg-muted/30 overflow-hidden">
          <div className="bg-muted px-4 py-3 flex items-center justify-between border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-orange-600" />
              <h2 className="font-semibold text-foreground">Output</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Execution Stats */}
              {executionResult && executionResult.time && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={14} />
                  <span>{executionResult.time}s</span>
                </div>
              )}
              {executionResult && executionResult.memory && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Database size={14} />
                  <span>{(executionResult.memory / 1024).toFixed(2)} MB</span>
                </div>
              )}
              
              {/* Test Case Result */}
              {expectedOutput.trim() && executionResult && executionResult.stdout && (
                <div
                  className={`px-3 py-1 rounded-md text-sm font-semibold ${
                    compareOutputs() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {compareOutputs() ? "✓ Test Passed" : "✗ Test Failed"}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-background">
            {!executionResult ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Terminal size={48} className="mb-4 opacity-50" />
                <p className="text-foreground">No output yet</p>
                <p className="text-xs mt-2">Click "Run Code" to execute</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Compile Error */}
                {executionResult.compile_output && (
                  <div className="p-3 rounded-md bg-red-50 text-red-700 border-l-4 border-red-500">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <XCircle size={16} />
                      Compilation Error
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">{executionResult.compile_output}</pre>
                  </div>
                )}

                {/* Standard Output */}
                {executionResult.stdout && (
                  <div className="p-3 rounded-md bg-muted/50 border border-border">
                    <div className="font-semibold mb-2 text-foreground text-xs">Standard Output</div>
                    <pre className="whitespace-pre-wrap text-foreground">{executionResult.stdout}</pre>
                  </div>
                )}

                {/* Standard Error */}
                {executionResult.stderr && (
                  <div className="p-3 rounded-md bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Runtime Error
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">{executionResult.stderr}</pre>
                  </div>
                )}

                {/* No Output Message */}
                {!executionResult.stdout && !executionResult.stderr && !executionResult.compile_output && (
                  <div className="text-muted-foreground text-center py-8">No output generated</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

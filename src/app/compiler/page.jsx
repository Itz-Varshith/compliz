"use client"

import { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { Play, Copy, Download, Terminal } from 'lucide-react';

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
    cout << "Hello, World!" << endl;
    
    // Example: Vector operations
    vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        cout << "Number: " << num << endl;
    }
    
    return 0;
}`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Editor</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Welcome to HTML Editor</h1>
    <p>Start building your webpage here!</p>
</body>
</html>`,
  
  css: `/* Welcome to CSS Editor */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  margin: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}`
};

function App() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(languageTemplates.cpp);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const editorRef = useRef(null);

  const languageOptions = [
    { value: 'cpp', label: 'C++' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' }
  ];

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(languageTemplates[newLang]);
    setOutput([]);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    if (language === 'javascript') {
      const logs = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = (...args) => {
        logs.push({ type: 'log', message: args.join(' ') });
        originalLog(...args);
      };
      console.error = (...args) => {
        logs.push({ type: 'error', message: args.join(' ') });
        originalError(...args);
      };
      console.warn = (...args) => {
        logs.push({ type: 'warn', message: args.join(' ') });
        originalWarn(...args);
      };

      try {
        eval(code);
        setOutput(logs.length > 0 ? logs : [{ type: 'log', message: 'Code executed successfully (no output)' }]);
      } catch (error) {
        setOutput([{ type: 'error', message: `Error: ${error.message}` }]);
      } finally {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
      }
    } else {
      setOutput([{ 
        type: 'warn', 
        message: `Note: ${language.toUpperCase()} code execution is not supported in browser. This is a demonstration editor.` 
      }]);
    }
    
    setIsRunning(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const downloadCode = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Editor Section */}
      <div className="w-3/5 overflow-hidden flex flex-col border-r border-gray-400">
        {/* Editor Controls */}
        <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-400 flex-shrink-0">
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {languageOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="text-gray-500 text-sm">{lineCount} lines</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition border border-gray-300 relative"
              title="Copy Code"
            >
              <Copy size={16} />
              <span className="hidden sm:inline">{showCopied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={downloadCode}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition border border-gray-300"
              title="Download"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition border border-gray-300"
              title="Toggle Theme"
            >
              {isDark ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition disabled:opacity-50"
            >
              <Play size={16} />
              Run Code
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme={isDark ? "vs-dark" : "light"}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
              inlineSuggest: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: false,
              padding: { top: 16, bottom: 16 }
            }}
          />
        </div>
      </div>

      {/* Right Panel - Input/Output Section */}
      <div className="w-2/5 overflow-hidden flex flex-col">
        {/* Top Half - Input and Expected Output Side by Side */}
        <div className="h-1/2 flex border-b border-gray-300">
          {/* Input Section (Left) */}
          <div className="w-1/2 border-r border-gray-300 flex flex-col bg-gray-50 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200 flex-shrink-0">
              <Terminal size={18} className="text-blue-600" />
              <h2 className="font-semibold text-gray-800">Input</h2>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input here..."
              className="flex-1 p-4 font-mono text-sm bg-white text-gray-800 resize-none focus:outline-none border-none overflow-auto"
            />
          </div>

          {/* Expected Output Section (Right) */}
          <div className="w-1/2 flex flex-col bg-gray-50 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200 flex-shrink-0">
              <Terminal size={18} className="text-green-600" />
              <h2 className="font-semibold text-gray-800">Expected Output</h2>
            </div>
            <textarea
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="Enter expected output here..."
              className="flex-1 p-4 font-mono text-sm bg-white text-gray-800 resize-none focus:outline-none border-none overflow-auto"
            />
          </div>
        </div>

        {/* Bottom Half - Actual Output */}
        <div className="h-1/2 flex flex-col bg-gray-50 overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-orange-600" />
              <h2 className="font-semibold text-gray-800">Actual Output</h2>
            </div>
            {expectedOutput.trim() && output.length > 0 && output[0].type !== 'warn' && (
              <div className={`px-3 py-1 rounded-md text-sm font-semibold ${
                output.map(o => o.message).join('\n').trim() === expectedOutput.trim()
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {output.map(o => o.message).join('\n').trim() === expectedOutput.trim() 
                  ? '✓ Test Case Passed' 
                  : '✗ Test Case Failed'}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-white">
            {output.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Terminal size={48} className="mb-4 opacity-50" />
                <p className="text-gray-600">No output yet</p>
                <p className="text-xs mt-2 text-gray-500">Click "Run Code" to execute</p>
              </div>
            ) : (
              <div className="space-y-2">
                {output.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      log.type === 'error'
                        ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                        : log.type === 'warn'
                        ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    {log.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
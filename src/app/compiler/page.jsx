"use client"
import { useState, useRef, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Play, Copy, Download, Terminal, Clock, Database, CheckCircle2, XCircle, AlertCircle, Save, ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Sun, Moon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
}

const languageIdMap = {
  cpp: "cpp",
  c: "c",
  python: "python",
  java: "java",
  javascript: "javascript",
}

function App() {
  const [language, setLanguage] = useState("cpp")
  const [code, setCode] = useState(languageTemplates.cpp)
  const [executionResult, setExecutionResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [input, setInput] = useState("")
  const [expectedOutput, setExpectedOutput] = useState("")
  const [showCopied, setShowCopied] = useState(false)
  const editorRef = useRef(null)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [codeName, setCodeName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [savePopoverOpen, setSavePopoverOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [showOutput, setShowOutput] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const getToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setToken(session.access_token)
      }
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getToken() 
    getUser()
  }, [supabase])

  const languageOptions = [
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ]

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    setCode(languageTemplates[newLang] || "")
    setExecutionResult(null)
  }

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  const runCode = async () => {
    setIsRunning(true)
    setExecutionResult(null)
    setShowOutput(true)

    try {
      const response = await fetch("http://localhost:5000/code/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          input,
          language: languageIdMap[language],
        }),
      })

      const data = await response.json()

      if (data?.success && data?.submission) {
        setExecutionResult(data.submission)
      } else {
        setExecutionResult({
          stdout: null,
          stderr: data?.message || "Execution failed",
          compile_output: null,
          status: { id: 0, description: "Error" },
          time: null,
          memory: null,
          exit_code: null,
        })
      }
    } catch (error) {
      setExecutionResult({
        stdout: null,
        stderr: `Network error: ${error?.message || "Unknown error"}`,
        compile_output: null,
        status: { id: 0, description: "Error" },
        time: null,
        memory: null,
        exit_code: null,
      })
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const downloadCode = () => {
    const extensions = { javascript: "js", python: "py", java: "java", cpp: "cpp", c: "c" }
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extensions[language]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveCode = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    const nameToSend = (codeName || "").trim()
    if (!nameToSend) {
      setSaveStatus({ type: "error", message: "Please provide a non-empty code name." })
      return
    }

    try {
      setIsSaving(true)
      setSaveStatus(null)

      if (!token) {
        setSaveStatus({ type: "error", message: "No user session found. Please log in again." })
        return
      }

      const response = await fetch("http://localhost:5000/code/self", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nameToSend,
          code,
          input,
          language: languageIdMap[language],
        }),
      })

      const data = await response.json()

      if (data?.success) {
        setSaveStatus({ type: "success", message: data?.message || "Code saved successfully." })
        if (data?.submission) {
          setExecutionResult(data.submission)
        }
        setTimeout(() => setSavePopoverOpen(false), 800)
      } else {
        setSaveStatus({ type: "error", message: data?.message || "Failed to save code." })
      }
    } catch (err) {
      setSaveStatus({ type: "error", message: err?.message || "Unexpected error while saving." })
    } finally {
      setIsSaving(false)
    }
  }

  const compareOutputs = () => {
    if (!executionResult || !expectedOutput.trim()) return null
    return (executionResult.stdout || "").trim() === expectedOutput.trim()
  }

  const lineCount = code.split("\n").length

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Desktop Layout - 3/5 and 2/5 split */}
      <div className="hidden lg:flex lg:w-3/5 overflow-hidden flex-col border-r border-border">
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

            <Popover open={savePopoverOpen} onOpenChange={setSavePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition border border-input"
                  title="Save Code"
                >
                  <Save size={16} />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Save Code</h4>
                    <p className="text-sm text-muted-foreground">
                      {user ? "Give your code a name to save it" : "Sign in to save your code"}
                    </p>
                  </div>

                  {user ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="codeName">Code Name</Label>
                        <Input
                          id="codeName"
                          placeholder="e.g., Hello World Program"
                          value={codeName}
                          onChange={(e) => setCodeName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isSaving) {
                              handleSaveCode()
                            }
                          }}
                        />
                      </div>

                      {saveStatus && (
                        <div
                          className={`text-sm p-2 rounded-md ${
                            saveStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {saveStatus.message}
                        </div>
                      )}

                      <Button onClick={handleSaveCode} disabled={isSaving} className="w-full">
                        {isSaving ? "Saving..." : "Save Code"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => router.push("/login")} className="w-full gap-2">
                      Sign In to Save
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition border border-input"
              title="Toggle Theme"
            >
              {isDark ? (
                <>
                  <Sun size={16} />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
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

      {/* Desktop Right Panel */}
      <div className="hidden lg:flex lg:w-2/5 overflow-hidden flex-col">
        <div className="h-1/2 flex border-b border-border">
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

        <div className="h-1/2 flex flex-col bg-muted/30 overflow-hidden">
          <div className="bg-muted px-4 py-3 flex items-center justify-between border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-orange-600" />
              <h2 className="font-semibold text-foreground">Output</h2>
            </div>
            <div className="flex items-center gap-2">
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
                {executionResult.compile_output && (
                  <div className="p-3 rounded-md bg-red-50 text-red-700 border-l-4 border-red-500">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <XCircle size={16} />
                      Compilation Error
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">{executionResult.compile_output}</pre>
                  </div>
                )}

                {executionResult.stdout && (
                  <div className="p-3 rounded-md bg-muted/50 border border-border">
                    <div className="font-semibold mb-2 text-foreground text-xs">Standard Output</div>
                    <pre className="whitespace-pre-wrap text-foreground">{executionResult.stdout}</pre>
                  </div>
                )}

                {executionResult.stderr && (
                  <div className="p-3 rounded-md bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Runtime Error
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">{executionResult.stderr}</pre>
                  </div>
                )}

                {!executionResult.stdout && !executionResult.stderr && !executionResult.compile_output && (
                  <div className="text-muted-foreground text-center py-8">No output generated</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full overflow-hidden">
        {/* Mobile Controls */}
        <div className="bg-muted px-3 py-2 flex items-center justify-between border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background text-foreground px-2 py-1 text-sm rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="text-muted-foreground text-xs">{lineCount}</span>
          </div>

          <div className="flex gap-1">
            <button onClick={copyCode} className="p-2 bg-secondary hover:bg-secondary/80 rounded-md" title="Copy">
              <Copy size={14} />
            </button>
            <button onClick={downloadCode} className="p-2 bg-secondary hover:bg-secondary/80 rounded-md" title="Download">
              <Download size={14} />
            </button>
            <button onClick={() => setIsDark(!isDark)} className="p-2 bg-secondary hover:bg-secondary/80 rounded-md">
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-1 px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm disabled:opacity-50"
            >
              <Play size={14} />
              {isRunning ? "..." : "Run"}
            </button>
          </div>
        </div>

        {/* Mobile Editor */}
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
              fontSize: 12,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              roundedSelection: false,
              padding: { top: 8, bottom: 8 },
            }}  
          />
        </div>

        {/* Mobile Input/Output Panel */}
        <div className={`border-t border-border bg-background transition-all ${showOutput ? 'h-2/5' : 'h-12'}`}>
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="w-full bg-muted px-4 py-3 flex items-center justify-between border-b border-border"
          >
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-orange-600" />
              <span className="font-semibold text-sm">Input / Output</span>
            </div>
            {showOutput ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>

          {showOutput && (
            <Tabs defaultValue="input" className="h-[calc(100%-48px)]">
              <TabsList className="w-full grid grid-cols-3 rounded-none">
                <TabsTrigger value="input" className="text-xs">Input</TabsTrigger>
                <TabsTrigger value="expected" className="text-xs">Expected</TabsTrigger>
                <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
              </TabsList>
              <TabsContent value="input" className="h-[calc(100%-40px)] m-0">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input here..."
                  className="w-full h-full p-3 font-mono text-xs bg-background text-foreground resize-none focus:outline-none border-none"
                />
              </TabsContent>
              <TabsContent value="expected" className="h-[calc(100%-40px)] m-0">
                <textarea
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  placeholder="Enter expected output..."
                  className="w-full h-full p-3 font-mono text-xs bg-background text-foreground resize-none focus:outline-none border-none"
                />
              </TabsContent>
              <TabsContent value="output" className="h-[calc(100%-40px)] m-0 overflow-auto">
                <div className="p-3 font-mono text-xs">
                  {!executionResult ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Terminal size={32} className="mb-2 opacity-50" />
                      <p className="text-xs">No output yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {executionResult.compile_output && (
                        <div className="p-2 rounded-md bg-red-50 text-red-700 border-l-4 border-red-500">
                          <div className="font-semibold mb-1 flex items-center gap-1 text-xs">
                            <XCircle size={12} />
                            Compilation Error
                          </div>
                          <pre className="whitespace-pre-wrap text-xs">{executionResult.compile_output}</pre>
                        </div>
                      )}
                      {executionResult.stdout && (
                        <div className="p-2 rounded-md bg-muted/50 border border-border">
                          <div className="font-semibold mb-1 text-xs">Output</div>
                          <pre className="whitespace-pre-wrap">{executionResult.stdout}</pre>
                        </div>
                      )}
                      {executionResult.stderr && (
                        <div className="p-2 rounded-md bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500">
                          <div className="font-semibold mb-1 flex items-center gap-1 text-xs">
                            <AlertCircle size={12} />
                            Error
                          </div>
                          <pre className="whitespace-pre-wrap text-xs">{executionResult.stderr}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
// // "use client"
// // import { useState, useRef, use, useEffect } from "react"
// // import Editor from "@monaco-editor/react"
// // import {
// //   Play,
// //   Copy,
// //   Terminal,
// //   SunIcon,
// //   CheckCircle2,
// //   XCircle,
// //   Clock,
// //   TrendingUp,
// //   Lightbulb,
// //   ChevronDown,
// //   Pause,
// //   Loader2,
// // } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Card } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// // // Dummy submissions data
// // const submissionsData = {
// //   1: [
// //     {
// //       id: 1,
// //       timestamp: "2025-02-10 14:30:25",
// //       status: "Accepted",
// //       runtime: "52 ms",
// //       memory: "16.2 MB",
// //       language: "C++",
// //     },
// //     {
// //       id: 2,
// //       timestamp: "2025-02-10 14:25:10",
// //       status: "Wrong Answer",
// //       runtime: "N/A",
// //       memory: "N/A",
// //       language: "C++",
// //     },
// //     {
// //       id: 3,
// //       timestamp: "2025-02-10 14:20:45",
// //       status: "Time Limit Exceeded",
// //       runtime: "N/A",
// //       memory: "15.8 MB",
// //       language: "Python",
// //     },
// //   ],
// //   2: [
// //     {
// //       id: 1,
// //       timestamp: "2025-02-09 10:15:30",
// //       status: "Accepted",
// //       runtime: "8 ms",
// //       memory: "10.5 MB",
// //       language: "JavaScript",
// //     },
// //   ],
// // }

// // const languageTemplates = {
// //   cpp: `class Solution {
// // public:
// //     bool canJump(vector<int>& nums) {
// //         // Write your solution here
        
// //     }
// // };`,
// //   javascript: `/**
// // * @param {number[]} nums
// // * @return {boolean}
// // */
// // var canJump = function(nums) {
// //     // Write your solution here
    
// // };`,
// //   python: `class Solution:
// //     def canJump(self, nums: List[int]) -> bool:
// //         # Write your solution here
// //         pass`,
// //   java: `class Solution {
// //     public boolean canJump(int[] nums) {
// //         // Write your solution here
        
// //     }
// // }`,
// // }

// // function transformQuestionData(apiData) {
// //   const acceptanceRate =
// //     apiData.total_submissions > 0
// //       ? ((apiData.accepted_submissions / apiData.total_submissions) * 100).toFixed(1)
// //       : "0.0"

// //   const examples =
// //     apiData.testCases?.map((testCase, index) => {
// //       const outputValue = Array.isArray(testCase.output) ? testCase.output[0] : testCase.output
// //       return {
// //         input: testCase.input || "",
// //         output: outputValue || "",
// //         explanation: `Test case ${index + 1}`,
// //       }
// //     }) || []

// //   let difficulty = "Medium"
// //   if (apiData.topics?.some((t) => t.toLowerCase().includes("easy"))) {
// //     difficulty = "Easy"
// //   } else if (apiData.topics?.some((t) => t.toLowerCase().includes("hard"))) {
// //     difficulty = "Hard"
// //   }

// //   return {
// //     _id: apiData._id,
// //     number: apiData._id?.slice(-4) || "0000",
// //     title: apiData.title || "Untitled Problem",
// //     difficulty: difficulty,
// //     description: apiData.description || "No description available",
// //     examples: examples,
// //     constraints: apiData.constraints || [],
// //     timeLimit: apiData.timeLimit || 1000,
// //     memoryLimit: apiData.memoryLimit || 256,
// //     hints: apiData.hints || [],
// //     topics: apiData.topics || [],
// //     companies: [],
// //     acceptedSubmissions: apiData.accepted_submissions || 0,
// //     totalSubmissions: apiData.total_submissions || 0,
// //     acceptanceRate: Number.parseFloat(acceptanceRate),
// //     testCases: apiData.testCases || [],
// //   }
// // }

// // export default function SolvePage({ params }) {
// //   const resolvedParams = use(params)
// //   const questionId = Number.parseInt(resolvedParams.id)

// //   const editorRef = useRef(null)

// //   const [question, setQuestion] = useState(null)
// //   const [submissions, setSubmissions] = useState([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [error, setError] = useState(null)

// //   const [activeTab, setActiveTab] = useState("description")
// //   const [language, setLanguage] = useState("cpp")
// //   const [code, setCode] = useState(languageTemplates.cpp)
// //   const [customInput, setCustomInput] = useState("")
// //   const [output, setOutput] = useState([])
// //   const [isRunning, setIsRunning] = useState(false)
// //   const [isDark, setIsDark] = useState(true)
// //   const [time, setTime] = useState(0)
// //   const [isTimerRunning, setIsTimerRunning] = useState(false)

// //   useEffect(() => {
// //     let interval
// //     if (isTimerRunning) {
// //       interval = setInterval(() => {
// //         setTime((prevTime) => prevTime + 1)
// //       }, 1000)
// //     }
// //     return () => clearInterval(interval)
// //   }, [isTimerRunning])

// //   useEffect(() => {
// //     const fetchQuestion = async () => {
// //       try {
// //         setIsLoading(true)
// //         setError(null)
// //         const response = await fetch(`http://localhost:5000/question/one/${questionId}`)

// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`)
// //         }

// //         const data = await response.json()
// //         console.log("API Response:", data)

// //         if (data.success && data.questionData) {
// //           const transformedData = transformQuestionData(data.questionData)
// //           console.log("Transformed Data:", transformedData)
// //           setQuestion(transformedData)

// //           if (transformedData.testCases && transformedData.testCases.length > 0) {
// //             setCustomInput(transformedData.testCases[0].input || "")
// //           }
// //         } else {
// //           throw new Error(data.message || "Failed to fetch question")
// //         }
// //       } catch (err) {
// //         setError(err instanceof Error ? err.message : "Failed to fetch question")
// //         console.error("Error fetching question:", err)
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }

// //     fetchQuestion()
// //   }, [questionId])

// //   if (isLoading) {
// //     return (
// //       <div className="flex h-screen items-center justify-center bg-background">
// //         <div className="text-center">
// //           <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
// //           <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
// //           <p className="text-muted-foreground">Please wait</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (error || !question) {
// //     return (
// //       <div className="flex h-screen items-center justify-center bg-background">
// //         <div className="text-center max-w-md">
// //           <XCircle size={48} className="mx-auto mb-4 text-destructive" />
// //           <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
// //           <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
// //           <Button onClick={() => window.location.reload()} variant="outline">
// //             Retry
// //           </Button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   const formatTime = (seconds) => {
// //     const hrs = Math.floor(seconds / 3600)
// //     const mins = Math.floor((seconds % 3600) / 60)
// //     const secs = seconds % 60
// //     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
// //   }

// //   const languageOptions = [
// //     { value: "cpp", label: "C++" },
// //     { value: "javascript", label: "JavaScript" },
// //     { value: "python", label: "Python" },
// //     { value: "java", label: "Java" },
// //   ]

// //   const handleLanguageChange = (newLang) => {
// //     setLanguage(newLang)
// //     setCode(languageTemplates[newLang])
// //     setOutput([])
// //   }

// //   const handleEditorDidMount = (editor) => {
// //     editorRef.current = editor
// //   }

// //   const runCode = () => {
// //     setIsRunning(true)
// //     setOutput([])

// //     setTimeout(() => {
// //       setOutput([
// //         { type: "log", message: "Running test cases..." },
// //         { type: "log", message: "Test case 1: Passed ✓" },
// //         { type: "log", message: "Test case 2: Passed ✓" },
// //         { type: "log", message: "Runtime: 52 ms" },
// //         { type: "log", message: "Memory: 16.2 MB" },
// //       ])
// //       setIsRunning(false)
// //     }, 1500)
// //   }

// //   const submitCode = () => {
// //     setIsRunning(true)
// //     setOutput([])

// //     setTimeout(() => {
// //       setOutput([
// //         { type: "log", message: "Submitting solution..." },
// //         { type: "log", message: "All test cases passed! ✓" },
// //         { type: "log", message: "Accepted" },
// //         { type: "log", message: "Runtime: 52 ms (Beats 85.2%)" },
// //         { type: "log", message: "Memory: 16.2 MB (Beats 72.4%)" },
// //       ])
// //       setIsRunning(false)
// //     }, 2000)
// //   }

// //   const copyCode = () => {
// //     navigator.clipboard.writeText(code)
// //   }

// //   const getDifficultyColor = (difficulty) => {
// //     switch (difficulty) {
// //       case "Easy":
// //         return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
// //       case "Medium":
// //         return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
// //       case "Hard":
// //         return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
// //       default:
// //         return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
// //     }
// //   }

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case "Accepted":
// //         return "text-green-600"
// //       case "Wrong Answer":
// //         return "text-red-600"
// //       case "Time Limit Exceeded":
// //         return "text-yellow-600"
// //       default:
// //         return "text-gray-600"
// //     }
// //   }

// //   const getStatusIcon = (status) => {
// //     switch (status) {
// //       case "Accepted":
// //         return <CheckCircle2 className="h-4 w-4" />
// //       case "Wrong Answer":
// //         return <XCircle className="h-4 w-4" />
// //       default:
// //         return <Clock className="h-4 w-4" />
// //     }
// //   }
// // }

// //   return (
// //     <div className="flex h-screen bg-background">
// //       {/* Left Panel - Problem Description */}
// //       <div className="w-1/2 border-r border-border overflow-hidden flex flex-col">
// //         <div className="flex-1 overflow-auto">
// //           <div className="p-6">
// //             {/* Problem Header */}
// //             <div className="mb-6">
// //               <div className="flex items-center gap-3 mb-3">
// //                 <span className="text-sm font-semibold text-muted-foreground">{question.number}.</span>
// //                 <h1 className="text-2xl font-bold text-foreground">{question.title}</h1>
// //               </div>
// //               <div className="flex items-center gap-2 flex-wrap">
// //                 <Badge className={`${getDifficultyColor(question.difficulty)} border`}>{question.difficulty}</Badge>
// //                 {question.topics.map((topic, idx) => (
// //                   <Badge key={idx} variant="outline" className="text-xs">
// //                     {topic}
// //                   </Badge>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Tabs */}
// //             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
// //               <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
// //                 <TabsTrigger
// //                   value="description"
// //                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
// //                 >
// //                   Description
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="hints"
// //                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
// //                 >
// //                   Hints
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="submissions"
// //                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
// //                 >
// //                   Submissions
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="solutions"
// //                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
// //                 >
// //                   Solutions
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="description" className="mt-6 space-y-6">
// //                 {/* Description */}
// //                 <div>
// //                   <p className="text-foreground leading-relaxed whitespace-pre-line">{question.description}</p>
// //                 </div>

// //                 {question.examples && question.examples.length > 0 && (
// //                   <div className="space-y-4">
// //                     {question.examples.map((example, idx) => (
// //                       <Card key={idx} className="p-4 bg-muted/50">
// //                         <p className="font-semibold mb-2">Example {idx + 1}:</p>
// //                         <div className="space-y-1 font-mono text-sm">
// //                           <p>
// //                             <span className="font-semibold">Input:</span> {example.input}
// //                           </p>
// //                           <p>
// //                             <span className="font-semibold">Output:</span> {example.output}
// //                           </p>
// //                           {example.explanation && (
// //                             <p className="text-muted-foreground">
// //                               <span className="font-semibold">Explanation:</span> {example.explanation}
// //                             </p>
// //                           )}
// //                         </div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {question.constraints && question.constraints.length > 0 && (
// //                   <div>
// //                     <h3 className="font-semibold mb-3">Constraints:</h3>
// //                     <ul className="space-y-2 font-mono text-sm">
// //                       {question.constraints.map((constraint, idx) => (
// //                         <li key={idx} className="text-muted-foreground">
// //                           • {constraint}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 )}

// //                 {/* Time and Memory Limits */}
// //                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
// //                   <div>
// //                     <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
// //                     <p className="text-lg font-semibold">{question.timeLimit} ms</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
// //                     <p className="text-lg font-semibold">{question.memoryLimit} MB</p>
// //                   </div>
// //                 </div>

// //                 {/* Stats */}
// //                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
// //                   <div>
// //                     <p className="text-sm text-muted-foreground mb-1">Accepted</p>
// //                     <p className="text-lg font-semibold">{question.acceptedSubmissions.toLocaleString()}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-muted-foreground mb-1">Submissions</p>
// //                     <p className="text-lg font-semibold">{question.totalSubmissions.toLocaleString()}</p>
// //                   </div>
// //                   <div className="col-span-2">
// //                     <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
// //                     <div className="flex items-center gap-2">
// //                       <p className="text-lg font-semibold">{question.acceptanceRate}%</p>
// //                       <TrendingUp className="h-4 w-4 text-green-600" />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="hints" className="mt-6">
// //                 {question.hints && question.hints.length > 0 ? (
// //                   <div className="space-y-3">
// //                     {question.hints.map((hint, idx) => (
// //                       <Collapsible key={idx}>
// //                         <Card className="overflow-hidden">
// //                           <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
// //                             <div className="flex items-center gap-2">
// //                               <Lightbulb className="h-4 w-4 text-yellow-600" />
// //                               <span className="font-semibold">Hint {idx + 1}</span>
// //                             </div>
// //                             <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
// //                           </CollapsibleTrigger>
// //                           <CollapsibleContent>
// //                             <div className="p-4 pt-0 border-t bg-muted/30">
// //                               <p className="text-base text-foreground">{hint}</p>
// //                             </div>
// //                           </CollapsibleContent>
// //                         </Card>
// //                       </Collapsible>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <Card className="p-8 text-center">
// //                     <p className="text-muted-foreground">No hints available for this problem</p>
// //                   </Card>
// //                 )}
// //               </TabsContent>

// //               <TabsContent value="submissions" className="mt-6">
// //                 <div className="space-y-3">
// //                   {submissions.length === 0 ? (
// //                     <Card className="p-8 text-center">
// //                       <p className="text-muted-foreground">No submissions yet</p>
// //                     </Card>
// //                   ) : (
// //                     submissions.map((submission) => (
// //                       <Card key={submission.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
// //                         <div className="flex items-center justify-between">
// //                           <div className="flex items-center gap-3">
// //                             <div className={getStatusColor(submission.status)}>{getStatusIcon(submission.status)}</div>
// //                             <div>
// //                               <p className={`font-semibold ${getStatusColor(submission.status)}`}>
// //                                 {submission.status}
// //                               </p>
// //                               <p className="text-sm text-muted-foreground">{submission.timestamp}</p>
// //                             </div>
// //                           </div>
// //                           <div className="text-right text-sm">
// //                             <p className="text-muted-foreground">{submission.language}</p>
// //                             {submission.runtime !== "N/A" && (
// //                               <p className="text-muted-foreground">
// //                                 {submission.runtime} • {submission.memory}
// //                               </p>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </Card>
// //                     ))
// //                   )}
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="solutions" className="mt-6">
// //                 <Card className="p-8 text-center">
// //                   <p className="text-muted-foreground mb-2">Solutions are available after solving</p>
// //                   <p className="text-sm text-muted-foreground">Complete this problem to unlock community solutions</p>
// //                 </Card>
// //               </TabsContent>
// //             </Tabs>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Right Panel - Code Editor */}
// //       <div className="w-1/2 flex flex-col bg-background">
// //         {/* Editor Controls */}
// //         <div className="bg-muted/30 px-4 py-2 flex items-center justify-between border-b border-border">
// //           <div className="flex items-center gap-4">
// //             <select
// //               value={language}
// //               onChange={(e) => handleLanguageChange(e.target.value)}
// //               className="bg-background text-foreground px-4 py-1 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
// //             >
// //               {languageOptions.map((opt) => (
// //                 <option key={opt.value} value={opt.value}>
// //                   {opt.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Timer Display with Controls */}
// //           <div className="flex items-center gap-2">
// //             <Clock className="h-4 w-4 text-muted-foreground" />
// //             <span className="font-mono text-sm font-medium">{formatTime(time)}</span>
// //             <Button onClick={() => setIsTimerRunning(!isTimerRunning)} variant="ghost" size="icon" className="h-7 w-7">
// //               {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
// //             </Button>
// //           </div>

// //           <div className="flex gap-2">
// //             <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
// //               <Copy size={16} />
// //               <span className="hidden sm:inline">Copy</span>
// //             </Button>
// //             <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
// //               <SunIcon size={16} />
// //             </Button>
// //             <Button onClick={runCode} disabled={isRunning} variant="outline" size="sm" className="gap-2 bg-transparent">
// //               <Play size={16} />
// //               Run
// //             </Button>
// //             <Button
// //               onClick={submitCode}
// //               disabled={isRunning}
// //               size="sm"
// //               className="gap-2 bg-green-600 hover:bg-green-700 text-white"
// //             >
// //               Submit
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Monaco Editor */}
// //         <div className="flex-1 overflow-hidden">
// //           <Editor
// //             height="100%"
// //             language={language}
// //             theme={isDark ? "vs-dark" : "light"}
// //             value={code}
// //             onChange={(value) => setCode(value || "")}
// //             onMount={handleEditorDidMount}
// //             options={{
// //               fontSize: 14,
// //               minimap: { enabled: false },
// //               scrollBeyondLastLine: false,
// //               lineNumbers: "on",
// //               roundedSelection: false,
// //               padding: { top: 16, bottom: 16 },
// //             }}
// //           />
// //         </div>

// //         {/* Input/Output Section */}
// //         <div className="h-64 border-t border-border flex flex-col bg-background">
// //           <Tabs defaultValue="testcase" className="flex-1 flex flex-col">
// //             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
// //               <TabsTrigger
// //                 value="testcase"
// //                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
// //               >
// //                 Testcase
// //               </TabsTrigger>
// //               <TabsTrigger
// //                 value="result"
// //                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
// //               >
// //                 Test Result
// //               </TabsTrigger>
// //             </TabsList>

// //             <TabsContent value="testcase" className="flex-1 p-4 overflow-auto">
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium">Custom Input</label>
// //                 <textarea
// //                   value={customInput}
// //                   onChange={(e) => setCustomInput(e.target.value)}
// //                   placeholder="Enter your test input here"
// //                   className="w-full h-24 p-3 bg-muted border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
// //                 />
// //               </div>
// //             </TabsContent>

// //             <TabsContent value="result" className="flex-1 p-4 overflow-auto font-mono text-sm">
// //               {output.length === 0 ? (
// //                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
// //                   <Terminal size={32} className="mb-2 opacity-50" />
// //                   <p className="text-sm">Run code to see output</p>
// //                 </div>
// //               ) : (
// //                 <div className="space-y-2">
// //                   {output.map((log, index) => (
// //                     <div
// //                       key={index}
// //                       className={`p-2 rounded ${log.type === "error" ? "bg-destructive/10 text-destructive" : "text-foreground"}`}
// //                     >
// //                       {log.message}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </TabsContent>
// //           </Tabs>
// //         </div>
// //       </div>
// //     </div>
// //   )




// "use client"

// import { useState, useRef, use, useEffect } from "react"
// import Editor from "@monaco-editor/react"
// import {
//   Play,
//   Copy,
//   Terminal,
//   SunIcon,
//   XCircle,
//   Clock,
//   TrendingUp,
//   Lightbulb,
//   ChevronDown,
//   Pause,
//   Loader2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// const languageTemplates = {
//   cpp: `class Solution {
// public:
//     // Write your solution here
    
// };`,
//   javascript: `/**
// * @param {any} input
// * @return {any}
// */
// var solution = function(input) {
//     // Write your solution here
    
// };`,
//   python: `class Solution:
//     def solve(self, input):
//         # Write your solution here
//         pass`,
//   java: `class Solution {
//     public void solve() {
//         // Write your solution here
        
//     }
// }`,
// }

// export default function SolvePage({ params }) {
//   const resolvedParams = use(params)
//   const questionId = resolvedParams.id

//   const [question, setQuestion] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [activeTab, setActiveTab] = useState("description")
//   const [language, setLanguage] = useState("cpp")
//   const [code, setCode] = useState(languageTemplates.cpp)
//   const [customInput, setCustomInput] = useState("")
//   const [output, setOutput] = useState([])
//   const [isRunning, setIsRunning] = useState(false)
//   const [isDark, setIsDark] = useState(true)
//   const [time, setTime] = useState(0)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const editorRef = useRef(null)

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)
//         const response = await fetch(`http://localhost:5000/question/one/${questionId}`)

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data = await response.json()
//         console.log("API Response:", data)
//         if (data.success && data.questionData) {
//           setQuestion(data.questionData)
//         } else {
//           throw new Error(data.message || "Failed to fetch question")
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch question")
//         console.error("Error fetching question:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchQuestion()
//   }, [questionId])

//   useEffect(() => {
//     let interval
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [isTimerRunning])

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600)
//     const mins = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const languageOptions = [
//     { value: "cpp", label: "C++" },
//     { value: "javascript", label: "JavaScript" },
//     { value: "python", label: "Python" },
//     { value: "java", label: "Java" },
//   ]

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang)
//     setCode(languageTemplates[newLang])
//     setOutput([])
//   }

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor
//   }

//   const runCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Running test cases..." },
//         { type: "log", message: "Test case 1: Passed ✓" },
//         { type: "log", message: "Test case 2: Passed ✓" },
//         { type: "log", message: "Runtime: 52 ms" },
//         { type: "log", message: "Memory: 16.2 MB" },
//       ])
//       setIsRunning(false)
//     }, 1500)
//   }

//   const submitCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Submitting solution..." },
//         { type: "log", message: "All test cases passed! ✓" },
//         { type: "log", message: "Accepted" },
//         { type: "log", message: "Runtime: 52 ms (Beats 85.2%)" },
//         { type: "log", message: "Memory: 16.2 MB (Beats 72.4%)" },
//       ])
//       setIsRunning(false)
//     }, 2000)
//   }

//   const copyCode = () => {
//     navigator.clipboard.writeText(code)
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy":
//         return "text-green-600 bg-green-50 border-green-200"
//       case "Medium":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200"
//       case "Hard":
//         return "text-red-600 bg-red-50 border-red-200"
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200"
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
//           <p className="text-muted-foreground">Please wait</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !question) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <XCircle size={48} className="mx-auto mb-4 text-destructive" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
//           <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
//           <Button onClick={() => window.location.reload()} variant="outline">
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const acceptanceRate =
//     question.total_submissions > 0
//       ? ((question.accepted_submissions / question.total_submissions) * 100).toFixed(1)
//       : "0.0"



//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       {/* Left Panel - Problem Description */}
//       <div className="w-1/2 border-r border-border flex flex-col">
//         <div className="flex-1 overflow-auto">
//           <div className="p-6">
//             {/* Problem Header */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <h1 className="text-2xl font-bold text-foreground">{question.title}</h1>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {question.topics.map((topic, idx) => (
//                   <Badge key={idx} variant="outline" className="text-xs">
//                     {topic}
//                   </Badge>
//                 ))}
//               </div>
//             </div>

//             {/* Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
//                 <TabsTrigger
//                   value="description"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Description
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hints"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Hints
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="description" className="mt-6 space-y-6">
//                 {/* Description */}
//                 <div>
//                   <p className="text-foreground leading-relaxed whitespace-pre-line">{question.description}</p>
//                 </div>

//                 {/* Examples */}
//                 <div className="space-y-4">
//                   {question.examples.map((example, idx) => (
//                     <Card key={idx} className="p-4 bg-muted/50">
//                       <p className="font-semibold mb-2">Example {idx + 1}:</p>
//                       <div className="space-y-1 font-mono text-sm">
//                         <p>
//                           <span className="font-semibold">Input:</span> {example.input}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Output:</span> {example.output}
//                         </p>
//                         {example.explanation !== "--" && (
//                           <p className="text-muted-foreground">
//                             <span className="font-semibold">Explanation:</span> {example.explanation}
//                           </p>
//                         )}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>

//                 {/* Constraints */}
//                 {question.constraints.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-3">Constraints:</h3>
//                     <ul className="space-y-2 font-mono text-sm">
//                       {question.constraints.map((constraint, idx) => (
//                         <li key={idx} className="text-muted-foreground">
//                           • {constraint}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Time and Memory Limits */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
//                     <p className="text-lg font-semibold">{question.timeLimit} s</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
//                     <p className="text-lg font-semibold">{question.memoryLimit} MB</p>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Accepted</p>
//                     <p className="text-lg font-semibold">{question.accepted_submissions.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Submissions</p>
//                     <p className="text-lg font-semibold">{question.total_submissions.toLocaleString()}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-lg font-semibold">{acceptanceRate}%</p>
//                       <TrendingUp className="h-4 w-4 text-green-600" />
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="hints" className="mt-6">
//                 <div className="space-y-3">
//                   {question.hints.length === 0 ? (
//                     <Card className="p-8 text-center">
//                       <p className="text-muted-foreground">No hints available</p>
//                     </Card>
//                   ) : (
//                     question.hints.map((hint, idx) => (
//                       <Collapsible key={idx}>
//                         <Card className="overflow-hidden">
//                           <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
//                             <div className="flex items-center gap-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-600" />
//                               <span className="font-semibold">Hint {idx + 1}</span>
//                             </div>
//                             <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
//                           </CollapsibleTrigger>
//                           <CollapsibleContent>
//                             <div className="p-4 pt-0 border-t bg-muted/50">
//                               <p className="text-base text-foreground">{hint}</p>
//                             </div>
//                           </CollapsibleContent>
//                         </Card>
//                       </Collapsible>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Code Editor */}
//       <div className="w-1/2 flex flex-col bg-background">
//         <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
//           <div className="flex items-center gap-4">
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-background text-foreground px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//             >
//               {languageOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
//               <Clock className="h-4 w-4 text-muted-foreground" />
//               <span className="font-mono text-sm font-medium">{formatTime(time)}</span>
//               <Button
//                 onClick={() => setIsTimerRunning(!isTimerRunning)}
//                 variant="ghost"
//                 size="icon"
//                 className="h-6 w-6 ml-1"
//               >
//                 {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
//               </Button>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Copy size={16} />
//               <span className="hidden sm:inline">Copy</span>
//             </Button>
//             <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
//               <SunIcon size={16} />
//             </Button>
//             <Button onClick={runCode} disabled={isRunning} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Play size={16} />
//               Run
//             </Button>
//             <Button
//               onClick={submitCode}
//               disabled={isRunning}
//               size="sm"
//               className="gap-2 bg-green-600 hover:bg-green-700 text-white"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>

//         {/* Monaco Editor */}
//         <div className="flex-1 overflow-hidden">
//           <Editor
//             height="100%"
//             language={language}
//             theme={isDark ? "vs-dark" : "light"}
//             value={code}
//             onChange={(value) => setCode(value || "")}
//             onMount={handleEditorDidMount}
//             options={{
//               fontSize: 14,
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               lineNumbers: "on",
//               roundedSelection: false,
//               padding: { top: 16, bottom: 16 },
//             }}
//           />
//         </div>

//         {/* Input/Output Section */}
//         <div className="h-64 border-t border-border flex flex-col bg-background">
//           <Tabs defaultValue="testcase" className="flex-1 flex flex-col">
//             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
//               <TabsTrigger
//                 value="testcase"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Testcase
//               </TabsTrigger>
//               <TabsTrigger
//                 value="result"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Test Result
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="testcase" className="flex-1 p-4 overflow-auto">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Custom Input</label>
//                 <textarea
//                   value={customInput}
//                   onChange={(e) => setCustomInput(e.target.value)}
//                   placeholder="Enter your test input here..."
//                   className="w-full h-24 p-3 bg-muted border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//             </TabsContent>

//             <TabsContent value="result" className="flex-1 p-4 overflow-auto font-mono text-sm">
//               {output.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                   <Terminal size={32} className="mb-2 opacity-50" />
//                   <p className="text-sm">Run code to see output</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {output.map((log, index) => (
//                     <div
//                       key={index}
//                       className={`p-2 rounded ${log.type === "error" ? "bg-destructive/10 text-destructive" : "text-foreground"}`}
//                     >
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState, useRef, use, useEffect } from "react"
// import Editor from "@monaco-editor/react"
// import {
//   Play,
//   Copy,
//   Terminal,
//   SunIcon,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   TrendingUp,
//   Lightbulb,
//   ChevronDown,
//   Pause,
//   Loader2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// const languageTemplates = {
//   cpp: `class Solution {
// public:
//     // Write your solution here
    
// };`,
//   javascript: `/**
// * @param {any} input
// * @return {any}
// */
// var solution = function(input) {
//     // Write your solution here
    
// };`,
//   python: `class Solution:
//     def solve(self, input):
//         # Write your solution here
//         pass`,
//   java: `class Solution {
//     public void solve() {
//         // Write your solution here
        
//     }
// }`,
// }

// const submissionsData = {
//   1: [
//     {
//       id: 1,
//       timestamp: "2025-02-10 14:30:25",
//       status: "Accepted",
//       runtime: "52 ms",
//       memory: "16.2 MB",
//       language: "C++",
//     },
//     {
//       id: 2,
//       timestamp: "2025-02-10 14:25:10",
//       status: "Wrong Answer",
//       runtime: "N/A",
//       memory: "N/A",
//       language: "C++",
//     },
//     {
//       id: 3,
//       timestamp: "2025-02-10 14:20:45",
//       status: "Time Limit Exceeded",
//       runtime: "N/A",
//       memory: "15.8 MB",
//       language: "Python",
//     },
//   ],
//   2: [
//     {
//       id: 1,
//       timestamp: "2025-02-09 10:15:30",
//       status: "Accepted",
//       runtime: "8 ms",
//       memory: "10.5 MB",
//       language: "JavaScript",
//     },
//   ],
// }

// export default function SolvePage({ params }) {
//   const resolvedParams = use(params)
//   const questionId = resolvedParams.id

//   const [question, setQuestion] = useState(null)
//   const [submissions, setSubmissions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [activeTab, setActiveTab] = useState("description")
//   const [language, setLanguage] = useState("cpp")
//   const [code, setCode] = useState(languageTemplates.cpp)
//   const [customInput, setCustomInput] = useState("")
//   const [output, setOutput] = useState([])
//   const [isRunning, setIsRunning] = useState(false)
//   const [isDark, setIsDark] = useState(true)
//   const [time, setTime] = useState(0)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const editorRef = useRef(null)

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)
//         const response = await fetch(`http://localhost:5000/question/one/${questionId}`)

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data = await response.json()
//         console.log("API Response:", data)
//         if (data.success && data.questionData) {
//           setQuestion(data.questionData)
//           setSubmissions(submissionsData[questionId] || [])
//         } else {
//           throw new Error(data.message || "Failed to fetch question")
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch question")
//         console.error("Error fetching question:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchQuestion()
//   }, [questionId])

//   useEffect(() => {
//     let interval
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [isTimerRunning])

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [isDark])

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600)
//     const mins = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const languageOptions = [
//     { value: "cpp", label: "C++" },
//     { value: "javascript", label: "JavaScript" },
//     { value: "python", label: "Python" },
//     { value: "java", label: "Java" },
//   ]

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang)
//     setCode(languageTemplates[newLang])
//     setOutput([])
//   }

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor
//   }

//   const runCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Running test cases..." },
//         { type: "log", message: "Test case 1: Passed ✓" },
//         { type: "log", message: "Test case 2: Passed ✓" },
//         { type: "log", message: "Runtime: 52 ms" },
//         { type: "log", message: "Memory: 16.2 MB" },
//       ])
//       setIsRunning(false)
//     }, 1500)
//   }

//   const submitCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Submitting solution..." },
//         { type: "log", message: "All test cases passed! ✓" },
//         { type: "log", message: "Accepted" },
//         { type: "log", message: "Runtime: 52 ms (Beats 85.2%)" },
//         { type: "log", message: "Memory: 16.2 MB (Beats 72.4%)" },
//       ])
//       setIsRunning(false)
//     }, 2000)
//   }

//   const copyCode = () => {
//     navigator.clipboard.writeText(code)
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy":
//         return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
//       case "Medium":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
//       case "Hard":
//         return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Accepted":
//         return "text-green-600 dark:text-green-400"
//       case "Wrong Answer":
//         return "text-red-600 dark:text-red-400"
//       case "Time Limit Exceeded":
//         return "text-yellow-600 dark:text-yellow-400"
//       default:
//         return "text-gray-600 dark:text-gray-400"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Accepted":
//         return <CheckCircle2 className="h-4 w-4" />
//       case "Wrong Answer":
//         return <XCircle className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
//           <p className="text-muted-foreground">Please wait</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !question) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <XCircle size={48} className="mx-auto mb-4 text-destructive" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
//           <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
//           <Button onClick={() => window.location.reload()} variant="outline">
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const acceptanceRate =
//     question.total_submissions > 0
//       ? ((question.accepted_submissions / question.total_submissions) * 100).toFixed(1)
//       : "0.0"

//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       {/* Left Panel - Problem Description */}
//       <div className="w-1/2 border-r border-border flex flex-col">
//         <div className="flex-1 overflow-auto">
//           <div className="p-6">
//             {/* Problem Header */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <h1 className="text-2xl font-bold text-foreground">{question.title}</h1>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {question.topics.map((topic, idx) => (
//                   <Badge key={idx} variant="outline" className="text-xs">
//                     {topic}
//                   </Badge>
//                 ))}
//               </div>
//             </div>

//             {/* Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
//                 <TabsTrigger
//                   value="description"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Description
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hints"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Hints
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="submissions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Submissions
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="solutions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Solutions
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="description" className="mt-6 space-y-6">
//                 {/* Description */}
//                 <div>
//                   <p className="text-foreground leading-relaxed whitespace-pre-line">{question.description}</p>
//                 </div>

//                 {/* Examples */}
//                 <div className="space-y-4">
//                   {question.examples.map((example, idx) => (
//                     <Card key={idx} className="p-4 bg-muted/50">
//                       <p className="font-semibold mb-2">Example {idx + 1}:</p>
//                       <div className="space-y-1 font-mono text-sm">
//                         <p>
//                           <span className="font-semibold">Input:</span> {example.input}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Output:</span> {example.output}
//                         </p>
//                         {example.explanation !== "--" && (
//                           <p className="text-muted-foreground">
//                             <span className="font-semibold">Explanation:</span> {example.explanation}
//                           </p>
//                         )}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>

//                 {/* Constraints */}
//                 {question.constraints.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-3">Constraints:</h3>
//                     <ul className="space-y-2 font-mono text-sm">
//                       {question.constraints.map((constraint, idx) => (
//                         <li key={idx} className="text-muted-foreground">
//                           • {constraint}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Time and Memory Limits */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
//                     <p className="text-lg font-semibold">{question.timeLimit} s</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
//                     <p className="text-lg font-semibold">{question.memoryLimit} MB</p>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Accepted</p>
//                     <p className="text-lg font-semibold">{question.accepted_submissions.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Submissions</p>
//                     <p className="text-lg font-semibold">{question.total_submissions.toLocaleString()}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-lg font-semibold">{acceptanceRate}%</p>
//                       <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="hints" className="mt-6">
//                 <div className="space-y-3">
//                   {question.hints.length === 0 ? (
//                     <Card className="p-8 text-center">
//                       <p className="text-muted-foreground">No hints available</p>
//                     </Card>
//                   ) : (
//                     question.hints.map((hint, idx) => (
//                       <Collapsible key={idx}>
//                         <Card className="overflow-hidden">
//                           <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
//                             <div className="flex items-center gap-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                               <span className="font-semibold">Hint {idx + 1}</span>
//                             </div>
//                             <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
//                           </CollapsibleTrigger>
//                           <CollapsibleContent>
//                             <div className="p-4 pt-0 border-t bg-muted/50">
//                               <p className="text-base text-foreground">{hint}</p>
//                             </div>
//                           </CollapsibleContent>
//                         </Card>
//                       </Collapsible>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="submissions" className="mt-6">
//                 <div className="space-y-3">
//                   {submissions.length === 0 ? (
//                     <Card className="p-8 text-center">
//                       <p className="text-muted-foreground">No submissions yet</p>
//                     </Card>
//                   ) : (
//                     submissions.map((submission) => (
//                       <Card key={submission.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={getStatusColor(submission.status)}>{getStatusIcon(submission.status)}</div>
//                             <div>
//                               <p className={`font-semibold ${getStatusColor(submission.status)}`}>
//                                 {submission.status}
//                               </p>
//                               <p className="text-sm text-muted-foreground">{submission.timestamp}</p>
//                             </div>
//                           </div>
//                           <div className="text-right text-sm">
//                             <p className="text-muted-foreground">{submission.language}</p>
//                             {submission.runtime !== "N/A" && (
//                               <p className="text-muted-foreground">
//                                 {submission.runtime} • {submission.memory}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </Card>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="solutions" className="mt-6">
//                 <Card className="p-8 text-center">
//                   <p className="text-muted-foreground mb-2">Solutions are available after solving</p>
//                   <p className="text-sm text-muted-foreground">Complete this problem to unlock community solutions</p>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Code Editor */}
//       <div className="w-1/2 flex flex-col bg-background">
//         <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
//           <div className="flex items-center gap-4">
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-background text-foreground px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//             >
//               {languageOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
//               <Clock className="h-4 w-4 text-muted-foreground" />
//               <span className="font-mono text-sm font-medium">{formatTime(time)}</span>
//               <Button
//                 onClick={() => setIsTimerRunning(!isTimerRunning)}
//                 variant="ghost"
//                 size="icon"
//                 className="h-6 w-6 ml-1"
//               >
//                 {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
//               </Button>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Copy size={16} />
//               <span className="hidden sm:inline">Copy</span>
//             </Button>
//             <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
//               <SunIcon size={16} />
//             </Button>
//             <Button onClick={runCode} disabled={isRunning} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Play size={16} />
//               Run
//             </Button>
//             <Button
//               onClick={submitCode}
//               disabled={isRunning}
//               size="sm"
//               className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>

//         {/* Monaco Editor */}
//         <div className="flex-1 overflow-hidden">
//           <Editor
//             height="100%"
//             language={language}
//             theme={isDark ? "vs-dark" : "light"}
//             value={code}
//             onChange={(value) => setCode(value || "")}
//             onMount={handleEditorDidMount}
//             options={{
//               fontSize: 14,
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               lineNumbers: "on",
//               roundedSelection: false,
//               padding: { top: 16, bottom: 16 },
//             }}
//           />
//         </div>

//         {/* Input/Output Section */}
//         <div className="h-64 border-t border-border flex flex-col bg-background">
//           <Tabs defaultValue="testcase" className="flex-1 flex flex-col">
//             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
//               <TabsTrigger
//                 value="testcase"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Testcase
//               </TabsTrigger>
//               <TabsTrigger
//                 value="result"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Test Result
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="testcase" className="flex-1 p-4 overflow-auto">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Custom Input</label>
//                 <textarea
//                   value={customInput}
//                   onChange={(e) => setCustomInput(e.target.value)}
//                   placeholder="Enter your test input here..."
//                   className="w-full h-24 p-3 bg-muted border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//             </TabsContent>

//             <TabsContent value="result" className="flex-1 p-4 overflow-auto font-mono text-sm">
//               {output.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                   <Terminal size={32} className="mb-2 opacity-50" />
//                   <p className="text-sm">Run code to see output</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {output.map((log, index) => (
//                     <div
//                       key={index}
//                       className={`p-2 rounded ${log.type === "error" ? "bg-destructive/10 text-destructive" : "text-foreground"}`}
//                     >
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState, useRef, use, useEffect } from "react"
// import Editor from "@monaco-editor/react"
// import {
//   Play,
//   Copy,
//   Terminal,
//   SunIcon,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   TrendingUp,
//   Lightbulb,
//   ChevronDown,
//   Pause,
//   Loader2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { createClient } from "@/lib/supabase/client"


// const languageTemplates = {
//   cpp: `class Solution {
// public:
//     // Write your solution here
    
// };`,
//   javascript: `/**
// * @param {any} input
// * @return {any}
// */
// var solution = function(input) {
//     // Write your solution here
    
// };`,
//   python: `class Solution:
//     def solve(self, input):
//         # Write your solution here
//         pass`,
//   java: `class Solution {
//     public void solve() {
//         // Write your solution here
        
//     }
// }`,
// }

// const submissionsData = {
//   1: [
//     {
//       id: 1,
//       timestamp: "2025-02-10 14:30:25",
//       status: "Accepted",
//       runtime: "52 ms",
//       memory: "16.2 MB",
//       language: "C++",
//     },
//     {
//       id: 2,
//       timestamp: "2025-02-10 14:25:10",
//       status: "Wrong Answer",
//       runtime: "N/A",
//       memory: "N/A",
//       language: "C++",
//     },
//     {
//       id: 3,
//       timestamp: "2025-02-10 14:20:45",
//       status: "Time Limit Exceeded",
//       runtime: "N/A",
//       memory: "15.8 MB",
//       language: "Python",
//     },
//   ],
//   2: [
//     {
//       id: 1,
//       timestamp: "2025-02-09 10:15:30",
//       status: "Accepted",
//       runtime: "8 ms",
//       memory: "10.5 MB",
//       language: "JavaScript",
//     },
//   ],
// }

// export default function SolvePage({ params }) {
//   const resolvedParams = use(params)
//   const questionId = resolvedParams.id

//   const [question, setQuestion] = useState(null)
//   const [submissions, setSubmissions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [activeTab, setActiveTab] = useState("description")
//   const [language, setLanguage] = useState("cpp")
//   const [code, setCode] = useState(languageTemplates.cpp)
//   const [customInput, setCustomInput] = useState("")
//   const [output, setOutput] = useState([])
//   const [isRunning, setIsRunning] = useState(false)
//   const [isDark, setIsDark] = useState(true)
//   const [time, setTime] = useState(0)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const editorRef = useRef(null)

//  const [token, setToken] = useState(null)
//  const supabase = createClient()
//   useEffect(() => {
//     const getToken = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (session) {
//         setToken(session.access_token)  // ✅ JWT here
//       }
//     }

//     getToken()
//   }, [token])

//  useEffect(() => {
//   if (!token) return  // don't fetch until token is set

//   const fetchQuestion = async () => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const response = await fetch(`http://localhost:5000/question/one/${questionId}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()

//       if (data.success && data.questionData) {
//         const questionData = {
//           ...data.questionData,
//           examples: Array.isArray(data.questionData.examples) ? data.questionData.examples : [],
//           testCases: Array.isArray(data.questionData.testCases) ? data.questionData.testCases : [],
//           constraints: Array.isArray(data.questionData.constraints) ? data.questionData.constraints : [],
//           topics: Array.isArray(data.questionData.topics) ? data.questionData.topics : [],
//           hints: Array.isArray(data.questionData.hints) ? data.questionData.hints : [],
//           accepted_submissions: data.questionData.accepted_submissions || 0,
//           total_submissions: data.questionData.total_submissions || 0,
//           timeLimit: data.questionData.timeLimit || 1,
//           memoryLimit: data.questionData.memoryLimit || 128,
//         }
//         setQuestion(questionData)
//         setSubmissions(submissionsData[questionId] || [])
//       } else {
//         throw new Error(data.message || "Failed to fetch question")
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch question")
//       console.error("Error fetching question:", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   fetchQuestion()
// }, [questionId, token])  // ✅ add token dependency


//   useEffect(() => {
//     let interval
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [isTimerRunning])

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [isDark])

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600)
//     const mins = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const languageOptions = [
//     { value: "cpp", label: "C++" },
//     { value: "javascript", label: "JavaScript" },
//     { value: "python", label: "Python" },
//     { value: "java", label: "Java" },
//   ]

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang)
//     setCode(languageTemplates[newLang])
//     setOutput([])
//   }

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor
//   }

//   const runCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Running test cases..." },
//         { type: "log", message: "Test case 1: Passed ✓" },
//         { type: "log", message: "Test case 2: Passed ✓" },
//         { type: "log", message: "Runtime: 52 ms" },
//         { type: "log", message: "Memory: 16.2 MB" },
//       ])
//       setIsRunning(false)
//     }, 1500)
//   }

//   const submitCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Submitting solution..." },
//         { type: "log", message: "All test cases passed! ✓" },
//         { type: "log", message: "Accepted" },
//         { type: "log", message: "Runtime: 52 ms (Beats 85.2%)" },
//         { type: "log", message: "Memory: 16.2 MB (Beats 72.4%)" },
//       ])
//       setIsRunning(false)
//     }, 2000)
//   }

//   const copyCode = () => {
//     navigator.clipboard.writeText(code)
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy":
//         return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
//       case "Medium":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
//       case "Hard":
//         return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Accepted":
//         return "text-green-600 dark:text-green-400"
//       case "Wrong Answer":
//         return "text-red-600 dark:text-red-400"
//       case "Time Limit Exceeded":
//         return "text-yellow-600 dark:text-yellow-400"
//       default:
//         return "text-gray-600 dark:text-gray-400"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Accepted":
//         return <CheckCircle2 className="h-4 w-4" />
//       case "Wrong Answer":
//         return <XCircle className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
//           <p className="text-muted-foreground">Please wait</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !question) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <XCircle size={48} className="mx-auto mb-4 text-destructive" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
//           <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
//           <Button onClick={() => window.location.reload()} variant="outline">
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const acceptanceRate =
//     question.total_submissions > 0
//       ? ((question.accepted_submissions / question.total_submissions) * 100).toFixed(1)
//       : "0.0"

//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       {/* Left Panel - Problem Description */}
//       <div className="w-1/2 border-r border-border flex flex-col">
//         <div className="flex-1 overflow-auto">
//           <div className="p-6">
//             {/* Problem Header */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <h1 className="text-2xl font-bold text-foreground">{question.title || "Untitled Problem"}</h1>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {question.topics &&
//                   question.topics.length > 0 &&
//                   question.topics.map((topic, idx) => (
//                     <Badge key={idx} variant="outline" className="text-xs">
//                       {topic}
//                     </Badge>
//                   ))}
//               </div>
//             </div>

//             {/* Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
//                 <TabsTrigger
//                   value="description"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Description
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hints"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Hints
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="submissions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Submissions
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="solutions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Solutions
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="description" className="mt-6 space-y-6">
//                 {/* Description */}
//                 <div>
//                   <p className="text-foreground leading-relaxed whitespace-pre-line">
//                     {question.description || "No description available"}
//                   </p>
//                 </div>

//                 {/* Examples */}
//                 {question.examples && question.examples.length > 0 && (
//                   <div className="space-y-4">
//                     {question.examples.map((example, idx) => (
//                       <Card key={example._id || idx} className="p-4 bg-muted/50">
//                         <p className="font-semibold mb-2">Example {idx + 1}:</p>
//                         <div className="space-y-1 font-mono text-sm">
//                           <p>
//                             <span className="font-semibold">Input:</span> {example.input || "N/A"}
//                           </p>
//                           <p>
//                             <span className="font-semibold">Output:</span> {example.output || "N/A"}
//                           </p>
//                           {example.explanation && example.explanation !== "--" && (
//                             <p className="text-muted-foreground">
//                               <span className="font-semibold">Explanation:</span> {example.explanation}
//                             </p>
//                           )}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 )}

//                 {/* Constraints */}
//                 {question.constraints && question.constraints.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-3">Constraints:</h3>
//                     <ul className="space-y-2 font-mono text-sm">
//                       {question.constraints.map((constraint, idx) => (
//                         <li key={idx} className="text-muted-foreground">
//                           • {constraint}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Time and Memory Limits */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
//                     <p className="text-lg font-semibold">{question.timeLimit} s</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
//                     <p className="text-lg font-semibold">{question.memoryLimit} MB</p>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Accepted</p>
//                     <p className="text-lg font-semibold">{question.accepted_submissions.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Submissions</p>
//                     <p className="text-lg font-semibold">{question.total_submissions.toLocaleString()}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-lg font-semibold">{acceptanceRate}%</p>
//                       <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="hints" className="mt-6">
//                 <div className="space-y-3">
//                   {!question.hints || question.hints.length === 0 ? (
//                     <Card className="p-8 text-center">
//                       <p className="text-muted-foreground">No hints available</p>
//                     </Card>
//                   ) : (
//                     question.hints.map((hint, idx) => (
//                       <Collapsible key={idx}>
//                         <Card className="overflow-hidden">
//                           <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
//                             <div className="flex items-center gap-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                               <span className="font-semibold">Hint {idx + 1}</span>
//                             </div>
//                             <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
//                           </CollapsibleTrigger>
//                           <CollapsibleContent>
//                             <div className="p-4 pt-0 border-t bg-muted/50">
//                               <p className="text-base text-foreground">{hint}</p>
//                             </div>
//                           </CollapsibleContent>
//                         </Card>
//                       </Collapsible>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="submissions" className="mt-6">
//                 <div className="space-y-3">
//                   {!submissions || submissions.length === 0 ? (
//                     <Card className="p-8 text-center">
//                       <p className="text-muted-foreground">No submissions yet</p>
//                     </Card>
//                   ) : (
//                     submissions.map((submission) => (
//                       <Card key={submission.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={getStatusColor(submission.status)}>{getStatusIcon(submission.status)}</div>
//                             <div>
//                               <p className={`font-semibold ${getStatusColor(submission.status)}`}>
//                                 {submission.status}
//                               </p>
//                               <p className="text-sm text-muted-foreground">{submission.timestamp}</p>
//                             </div>
//                           </div>
//                           <div className="text-right text-sm">
//                             <p className="text-muted-foreground">{submission.language}</p>
//                             {submission.runtime !== "N/A" && (
//                               <p className="text-muted-foreground">
//                                 {submission.runtime} • {submission.memory}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </Card>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="solutions" className="mt-6">
//                 <Card className="p-8 text-center">
//                   <p className="text-muted-foreground mb-2">Solutions are available after solving</p>
//                   <p className="text-sm text-muted-foreground">Complete this problem to unlock community solutions</p>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Code Editor */}
//       <div className="w-1/2 flex flex-col bg-background">
//         <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
//           <div className="flex items-center gap-4">
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-background text-foreground px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//             >
//               {languageOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
//               <Clock className="h-4 w-4 text-muted-foreground" />
//               <span className="font-mono text-sm font-medium">{formatTime(time)}</span>
//               <Button
//                 onClick={() => setIsTimerRunning(!isTimerRunning)}
//                 variant="ghost"
//                 size="icon"
//                 className="h-6 w-6 ml-1"
//               >
//                 {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
//               </Button>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Copy size={16} />
//               <span className="hidden sm:inline">Copy</span>
//             </Button>
//             <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
//               <SunIcon size={16} />
//             </Button>
//             <Button onClick={runCode} disabled={isRunning} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Play size={16} />
//               Run
//             </Button>
//             <Button
//               onClick={submitCode}
//               disabled={isRunning}
//               size="sm"
//               className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>

//         {/* Monaco Editor */}
//         <div className="flex-1 overflow-hidden">
//           <Editor
//             height="100%"
//             language={language}
//             theme={isDark ? "vs-dark" : "light"}
//             value={code}
//             onChange={(value) => setCode(value || "")}
//             onMount={handleEditorDidMount}
//             options={{
//               fontSize: 14,
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               lineNumbers: "on",
//               roundedSelection: false,
//               padding: { top: 16, bottom: 16 },
//             }}
//           />
//         </div>

//         {/* Input/Output Section */}
//         <div className="h-64 border-t border-border flex flex-col bg-background">
//           <Tabs defaultValue="testcase" className="flex-1 flex flex-col">
//             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
//               <TabsTrigger
//                 value="testcase"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Testcase
//               </TabsTrigger>
//               <TabsTrigger
//                 value="result"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Test Result
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="testcase" className="flex-1 p-4 overflow-auto">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Custom Input</label>
//                 <textarea
//                   value={customInput}
//                   onChange={(e) => setCustomInput(e.target.value)}
//                   placeholder="Enter your test input here..."
//                   className="w-full h-24 p-3 bg-muted border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//             </TabsContent>

//             <TabsContent value="result" className="flex-1 p-4 overflow-auto font-mono text-sm">
//               {!output || output.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                   <Terminal size={32} className="mb-2 opacity-50" />
//                   <p className="text-sm">Run code to see output</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {output.map((log, index) => (
//                     <div
//                       key={index}
//                       className={`p-2 rounded ${log.type === "error" ? "bg-destructive/10 text-destructive" : "text-foreground"}`}
//                     >
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState, useRef, use, useEffect } from "react"
// import Editor from "@monaco-editor/react"
// import {
//   Play,
//   Copy,
//   Terminal,
//   SunIcon,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   TrendingUp,
//   Lightbulb,
//   ChevronDown,
//   Pause,
//   Loader2,
//   Code2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { createClient } from "@/lib/supabase/client"

// const languageTemplates = {
//   cpp: `// Write your code here`,
//   javascript: `/**
// * @param {any} input
// * @return {any}
// */
// var solution = function(input) {
//     // Write your solution here
    
// };`,
//   python: `class Solution:
//     def solve(self, input):
//         # Write your solution here
//         pass`,
//   java: `class Solution {
//     public void solve() {
//         // Write your solution here
        
//     }
// }`,
// }

// const submissionsData = {
//   1: [
//     {
//       id: 1,
//       timestamp: "2025-02-10 14:30:25",
//       status: "Accepted",
//       runtime: "52 ms",
//       memory: "16.2 MB",
//       language: "C++",
//     },
//     {
//       id: 2,
//       timestamp: "2025-02-10 14:25:10",
//       status: "Wrong Answer",
//       runtime: "N/A",
//       memory: "N/A",
//       language: "C++",
//     },
//     {
//       id: 3,
//       timestamp: "2025-02-10 14:20:45",
//       status: "Time Limit Exceeded",
//       runtime: "N/A",
//       memory: "15.8 MB",
//       language: "Python",
//     },
//   ],
//   2: [
//     {
//       id: 1,
//       timestamp: "2025-02-09 10:15:30",
//       status: "Accepted",
//       runtime: "8 ms",
//       memory: "10.5 MB",
//       language: "JavaScript",
//     },
//   ],
// }

// export default function SolvePage({ params }) {
//   const resolvedParams = use(params)
//   const questionId = resolvedParams.id

//   const [question, setQuestion] = useState(null)
//   const [submissions, setSubmissions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [activeTab, setActiveTab] = useState("description")
//   const [language, setLanguage] = useState("cpp")
//   const [code, setCode] = useState(languageTemplates.cpp)
//   const [customInput, setCustomInput] = useState("")
//   const [output, setOutput] = useState([])
//   const [isRunning, setIsRunning] = useState(false)
//   const [isDark, setIsDark] = useState(true)
//   const [time, setTime] = useState(0)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const [solutionCode, setSolutionCode] = useState("")
//   const editorRef = useRef(null)

//   const [token, setToken] = useState(null)
//   const supabase = createClient()
//   useEffect(() => {
//     const getToken = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (session) {
//         setToken(session.access_token) // ✅ JWT here
//       }
//     }

//     getToken()
//   }, [token])

//   useEffect(() => {
//     if (!token) return // don't fetch until token is set

//     const fetchQuestion = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const response = await fetch(`http://localhost:5000/question/one/${questionId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data = await response.json()

//         if (data.success && data.questionData) {
//           const questionData = {
//             ...data.questionData,
//             examples: Array.isArray(data.questionData.examples) ? data.questionData.examples : [],
//             testCases: Array.isArray(data.questionData.testCases) ? data.questionData.testCases : [],
//             constraints: Array.isArray(data.questionData.constraints) ? data.questionData.constraints : [],
//             topics: Array.isArray(data.questionData.topics) ? data.questionData.topics : [],
//             hints: Array.isArray(data.questionData.hints) ? data.questionData.hints : [],
//             accepted_submissions: data.questionData.accepted_submissions || 0,
//             total_submissions: data.questionData.total_submissions || 0,
//             timeLimit: data.questionData.timeLimit || 1,
//             memoryLimit: data.questionData.memoryLimit || 128,
//           }
//           setQuestion(questionData)
//           setSolutionCode(data.questionData.solutionCode || "")
//           setSubmissions(submissionsData[questionId] || [])
//         } else {
//           throw new Error(data.message || "Failed to fetch question")
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch question")
//         console.error("Error fetching question:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchQuestion()
//   }, [questionId, token]) // ✅ add token dependency

//   useEffect(() => {
//     let interval
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [isTimerRunning])

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [isDark])

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600)
//     const mins = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const languageOptions = [
//     { value: "cpp", label: "C++" },
//     { value: "javascript", label: "JavaScript" },
//     { value: "python", label: "Python" },
//     { value: "java", label: "Java" },
//   ]

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang)
//     setCode(languageTemplates[newLang])
//     setOutput([])
//   }

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor
//   }

//   const runCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Running test cases..." },
//         { type: "log", message: "Test case 1: Passed ✓" },
//         { type: "log", message: "Test case 2: Passed ✓" },
//         { type: "log", message: "Runtime: 52 ms" },
//         { type: "log", message: "Memory: 16.2 MB" },
//       ])
//       setIsRunning(false)
//     }, 1500)
//   }

//   const submitCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Submitting solution..." },
//         { type: "log", message: "All test cases passed! ✓" },
//         { type: "log", message: "Accepted" },
//         { type: "log", message: "Runtime: 52 ms (Beats 85.2%)" },
//         { type: "log", message: "Memory: 16.2 MB (Beats 72.4%)" },
//       ])
//       setIsRunning(false)
//     }, 2000)
//   }

//   const copyCode = () => {
//     navigator.clipboard.writeText(code)
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy":
//         return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
//       case "Medium":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
//       case "Hard":
//         return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Accepted":
//         return "text-green-600 dark:text-green-400"
//       case "Wrong Answer":
//         return "text-red-600 dark:text-red-400"
//       case "Time Limit Exceeded":
//         return "text-yellow-600 dark:text-yellow-400"
//       default:
//         return "text-gray-600 dark:text-gray-400"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Accepted":
//         return <CheckCircle2 className="h-4 w-4" />
//       case "Wrong Answer":
//         return <XCircle className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
//           <p className="text-muted-foreground">Please wait</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !question) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <XCircle size={48} className="mx-auto mb-4 text-destructive" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
//           <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
//           <Button onClick={() => window.location.reload()} variant="outline">
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const acceptanceRate =
//     question.total_submissions > 0
//       ? ((question.accepted_submissions / question.total_submissions) * 100).toFixed(1)
//       : "0.0"

//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       {/* Left Panel - Problem Description */}
//       <div className="w-1/2 border-r border-border flex flex-col">
//         <div className="flex-1 overflow-auto">
//           <div className="p-6">
//             {/* Problem Header */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <h1 className="text-2xl font-bold text-foreground text-balance">
//                   {question.title || "Untitled Problem"}
//                 </h1>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {question.topics &&
//                   question.topics.length > 0 &&
//                   question.topics.map((topic, idx) => (
//                     <Badge key={idx} variant="outline" className="text-xs">
//                       {topic}
//                     </Badge>
//                   ))}
//               </div>
//             </div>

//             {/* Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
//                 <TabsTrigger
//                   value="description"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Description
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hints"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Hints
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="submissions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Submissions
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="solutions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Solutions
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="description" className="mt-6 space-y-6">
//                 {/* Description */}
//                 <div>
//                   <p className="text-foreground leading-relaxed whitespace-pre-line text-pretty">
//                     {question.description || "No description available"}
//                   </p>
//                 </div>

//                 {/* Examples */}
//                 {question.examples && question.examples.length > 0 && (
//                   <div className="space-y-4">
//                     {question.examples.map((example, idx) => (
//                       <Card key={example._id || idx} className="p-4 bg-muted/50 border-muted">
//                         <p className="font-semibold mb-3 text-foreground">Example {idx + 1}:</p>
//                         <div className="space-y-2 font-mono text-sm">
//                           <div className="bg-background/50 p-3 rounded-md">
//                             <span className="font-semibold text-muted-foreground">Input:</span>{" "}
//                             <span className="text-foreground">{example.input || "N/A"}</span>
//                           </div>
//                           <div className="bg-background/50 p-3 rounded-md">
//                             <span className="font-semibold text-muted-foreground">Output:</span>{" "}
//                             <span className="text-foreground">{example.output || "N/A"}</span>
//                           </div>
//                           {example.explanation && example.explanation !== "--" && (
//                             <div className="bg-background/50 p-3 rounded-md">
//                               <span className="font-semibold text-muted-foreground">Explanation:</span>{" "}
//                               <span className="text-foreground">{example.explanation}</span>
//                             </div>
//                           )}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 )}

//                 {/* Constraints */}
//                 {question.constraints && question.constraints.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-3 text-foreground">Constraints:</h3>
//                     <ul className="space-y-2 font-mono text-sm">
//                       {question.constraints.map((constraint, idx) => (
//                         <li key={idx} className="text-muted-foreground">
//                           • {constraint}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Time and Memory Limits */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
//                     <p className="text-lg font-semibold text-foreground">{question.timeLimit} s</p>
//                   </div>
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
//                     <p className="text-lg font-semibold text-foreground">{question.memoryLimit} MB</p>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Accepted</p>
//                     <p className="text-lg font-semibold text-foreground">
//                       {question.accepted_submissions.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Submissions</p>
//                     <p className="text-lg font-semibold text-foreground">
//                       {question.total_submissions.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="col-span-2 bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-lg font-semibold text-foreground">{acceptanceRate}%</p>
//                       <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="hints" className="mt-6">
//                 <div className="space-y-3">
//                   {!question.hints || question.hints.length === 0 ? (
//                     <Card className="p-8 text-center border-dashed">
//                       <Lightbulb className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                       <p className="text-muted-foreground">No hints available for this problem</p>
//                     </Card>
//                   ) : (
//                     question.hints.map((hint, idx) => (
//                       <Collapsible key={idx}>
//                         <Card className="overflow-hidden border-muted">
//                           <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
//                             <div className="flex items-center gap-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                               <span className="font-semibold text-foreground">Hint {idx + 1}</span>
//                             </div>
//                             <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180 text-muted-foreground" />
//                           </CollapsibleTrigger>
//                           <CollapsibleContent>
//                             <div className="p-4 pt-0 border-t bg-muted/30">
//                               <p className="text-base text-foreground leading-relaxed">{hint}</p>
//                             </div>
//                           </CollapsibleContent>
//                         </Card>
//                       </Collapsible>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="submissions" className="mt-6">
//                 <div className="space-y-3">
//                   {!submissions || submissions.length === 0 ? (
//                     <Card className="p-8 text-center border-dashed">
//                       <Terminal className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                       <p className="text-muted-foreground mb-1">No submissions yet</p>
//                       <p className="text-sm text-muted-foreground">Submit your solution to see it here</p>
//                     </Card>
//                   ) : (
//                     submissions.map((submission) => (
//                       <Card
//                         key={submission.id}
//                         className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-muted"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={getStatusColor(submission.status)}>{getStatusIcon(submission.status)}</div>
//                             <div>
//                               <p className={`font-semibold ${getStatusColor(submission.status)}`}>
//                                 {submission.status}
//                               </p>
//                               <p className="text-sm text-muted-foreground">{submission.timestamp}</p>
//                             </div>
//                           </div>
//                           <div className="text-right text-sm">
//                             <p className="text-muted-foreground font-medium">{submission.language}</p>
//                             {submission.runtime !== "N/A" && (
//                               <p className="text-muted-foreground">
//                                 {submission.runtime} • {submission.memory}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </Card>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="solutions" className="mt-6">
//                 {!solutionCode || solutionCode.trim() === "" ? (
//                   <Card className="p-8 text-center border-dashed">
//                     <Code2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                     <p className="text-muted-foreground mb-2">No solution available yet</p>
//                     <p className="text-sm text-muted-foreground">
//                       Solutions will be available after you solve this problem
//                     </p>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Code2 className="h-5 w-5 text-primary" />
//                         <h3 className="font-semibold text-foreground">Official Solution</h3>
//                       </div>
//                       <Button
//                         onClick={() => navigator.clipboard.writeText(solutionCode)}
//                         variant="outline"
//                         size="sm"
//                         className="gap-2"
//                       >
//                         <Copy size={14} />
//                         Copy
//                       </Button>
//                     </div>
//                     <Card className="overflow-hidden border-muted">
//                       <div className="bg-muted/30 px-4 py-2 border-b border-border">
//                         <p className="text-sm text-muted-foreground font-medium">Solution Code</p>
//                       </div>
//                       <div className="h-[500px]">
//                         <Editor
//                           height="100%"
//                           language="cpp"
//                           theme={isDark ? "vs-dark" : "light"}
//                           value={solutionCode}
//                           options={{
//                             readOnly: true,
//                             fontSize: 14,
//                             minimap: { enabled: false },
//                             scrollBeyondLastLine: false,
//                             lineNumbers: "on",
//                             roundedSelection: false,
//                             padding: { top: 16, bottom: 16 },
//                           }}
//                         />
//                       </div>
//                     </Card>
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Code Editor */}
//       <div className="w-1/2 flex flex-col bg-background">
//         <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
//           <div className="flex items-center gap-4">
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-background text-foreground px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
//             >
//               {languageOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
//               <Clock className="h-4 w-4 text-muted-foreground" />
//               <span className="font-mono text-sm font-medium text-foreground">{formatTime(time)}</span>
//               <Button
//                 onClick={() => setIsTimerRunning(!isTimerRunning)}
//                 variant="ghost"
//                 size="icon"
//                 className="h-6 w-6 ml-1"
//               >
//                 {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
//               </Button>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Copy size={16} />
//               <span className="hidden sm:inline">Copy</span>
//             </Button>
//             <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
//               <SunIcon size={16} />
//             </Button>
            
//             <Button
//               onClick={submitCode}
//               disabled={isRunning}
//               size="sm"
//               className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>

//         {/* Monaco Editor */}
//         <div className="flex-1 overflow-hidden">
//           <Editor
//             height="100%"
//             language={language}
//             theme={isDark ? "vs-dark" : "light"}
//             value={code}
//             onChange={(value) => setCode(value || "")}
//             onMount={handleEditorDidMount}
//             options={{
//               fontSize: 14,
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               lineNumbers: "on",
//               roundedSelection: false,
//               padding: { top: 16, bottom: 16 },
//             }}
//           />
//         </div>

//         {/* Input/Output Section */}
//         <div className="h-64 border-t border-border flex flex-col bg-background">
//           <Tabs defaultValue="testcase" className="flex-1 flex flex-col">
//             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
//               <TabsTrigger
//                 value="testcase"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Testcase
//               </TabsTrigger>
//               <TabsTrigger
//                 value="result"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Test Result
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="testcase" className="flex-1 p-4 overflow-auto">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-foreground">Custom Input</label>
//                 <textarea
//                   value={customInput}
//                   onChange={(e) => setCustomInput(e.target.value)}
//                   placeholder="Enter your test input here..."
//                   className="w-full h-24 p-3 bg-muted border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
//                 />
//               </div>
//             </TabsContent>

//             <TabsContent value="result" className="flex-1 p-4 overflow-auto font-mono text-sm">
//               {!output || output.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                   <Terminal size={32} className="mb-2 opacity-50" />
//                   <p className="text-sm">Run code to see output</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {output.map((log, index) => (
//                     <div
//                       key={index}
//                       className={`p-2 rounded ${log.type === "error" ? "bg-destructive/10 text-destructive" : "text-foreground bg-muted/30"}`}
//                     >
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState, useRef, use, useEffect } from "react"
// import Editor from "@monaco-editor/react"
// import {
//   Play,
//   Copy,
//   Terminal,
//   SunIcon,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   TrendingUp,
//   Lightbulb,
//   ChevronDown,
//   Pause,
//   Loader2,
//   Code2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { createClient } from "@/lib/supabase/client"

// const languageTemplates = {
//   cpp: `// Write your code here`,
//   javascript: `/**
// * @param {any} input
// * @return {any}
// */
// var solution = function(input) {
//     // Write your solution here
    
// };`,
//   python: `class Solution:
//     def solve(self, input):
//         # Write your solution here
//         pass`,
//   java: `class Solution {
//     public void solve() {
//         // Write your solution here
        
//     }
// }`,
// }

// const submissionsData = {
//   1: [
//     {
//       id: 1,
//       timestamp: "2025-02-10 14:30:25",
//       status: "Accepted",
//       runtime: "52 ms",
//       memory: "16.2 MB",
//       language: "C++",
//     },
//     {
//       id: 2,
//       timestamp: "2025-02-10 14:25:10",
//       status: "Wrong Answer",
//       runtime: "N/A",
//       memory: "N/A",
//       language: "C++",
//     },
//     {
//       id: 3,
//       timestamp: "2025-02-10 14:20:45",
//       status: "Time Limit Exceeded",
//       runtime: "N/A",
//       memory: "15.8 MB",
//       language: "Python",
//     },
//   ],
//   2: [
//     {
//       id: 1,
//       timestamp: "2025-02-09 10:15:30",
//       status: "Accepted",
//       runtime: "8 ms",
//       memory: "10.5 MB",
//       language: "JavaScript",
//     },
//   ],
// }

// export default function SolvePage({ params }) {
//   const resolvedParams = use(params)
//   const questionId = resolvedParams.id

//   const [question, setQuestion] = useState(null)
//   const [submissions, setSubmissions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [activeTab, setActiveTab] = useState("description")
//   const [language, setLanguage] = useState("cpp")
//   const [code, setCode] = useState(languageTemplates.cpp)
//   const [customInput, setCustomInput] = useState("")
//   const [output, setOutput] = useState([])
//   const [isRunning, setIsRunning] = useState(false)
//   const [isDark, setIsDark] = useState(true)
//   const [time, setTime] = useState(0)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const [solutionCode, setSolutionCode] = useState("")
//   const editorRef = useRef(null)

//   const [token, setToken] = useState(null)
//   const supabase = createClient()
//   useEffect(() => {
//     const getToken = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (session) {
//         setToken(session.access_token) // ✅ JWT here
//       }
//     }

//     getToken()
//   }, [token])

//   useEffect(() => {
//     if (!token) return // don't fetch until token is set

//     const fetchQuestion = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const response = await fetch(`http://localhost:5000/question/one/${questionId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data = await response.json()

//         if (data.success && data.questionData) {
//           const questionData = {
//             ...data.questionData,
//             examples: data.questionData.examples || { input: "", output: "" },
//             testCases: Array.isArray(data.questionData.testCases) ? data.questionData.testCases : [],
//             constraints: Array.isArray(data.questionData.constraints) ? data.questionData.constraints : [],
//             topics: Array.isArray(data.questionData.topics) ? data.questionData.topics : [],
//             hints: Array.isArray(data.questionData.hints) ? data.questionData.hints : [],
//             accepted_submissions: data.questionData.accepted_submissions || 0,
//             total_submissions: data.questionData.total_submissions || 0,
//             timeLimit: data.questionData.timeLimit || 1,
//             memoryLimit: data.questionData.memoryLimit || 128,
//           }
//           setQuestion(questionData)
//           setSolutionCode(data.questionData.solutionCode || "")
//           setSubmissions(submissionsData[questionId] || [])
//         } else {
//           throw new Error(data.message || "Failed to fetch question")
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch question")
//         console.error("Error fetching question:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchQuestion()
//   }, [questionId, token]) // ✅ add token dependency

//   useEffect(() => {
//     let interval
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [isTimerRunning])

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [isDark])

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600)
//     const mins = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const languageOptions = [
//     { value: "cpp", label: "C++" },
//     { value: "javascript", label: "JavaScript" },
//     { value: "python", label: "Python" },
//     { value: "java", label: "Java" },
//   ]

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang)
//     setCode(languageTemplates[newLang])
//     setOutput([])
//   }

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor
//   }

//   const runCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Running test cases..." },
//         { type: "log", message: "Test case 1: Passed ✓" },
//         { type: "log", message: "Test case 2: Passed ✓" },
//         { type: "log", message: "Runtime: 52 ms" },
//         { type: "log", message: "Memory: 16.2 MB" },
//       ])
//       setIsRunning(false)
//     }, 1500)
//   }

//   const submitCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Submitting solution..." },
//         { type: "log", message: "All test cases passed! ✓" },
//         { type: "log", message: "Accepted" },
//         { type: "log", message: "Runtime: 52 ms (Beats 85.2%)" },
//         { type: "log", message: "Memory: 16.2 MB (Beats 72.4%)" },
//       ])
//       setIsRunning(false)
//     }, 2000)
//   }

//   const copyCode = () => {
//     navigator.clipboard.writeText(code)
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy":
//         return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
//       case "Medium":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
//       case "Hard":
//         return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Accepted":
//         return "text-green-600 dark:text-green-400"
//       case "Wrong Answer":
//         return "text-red-600 dark:text-red-400"
//       case "Time Limit Exceeded":
//         return "text-yellow-600 dark:text-yellow-400"
//       default:
//         return "text-gray-600 dark:text-gray-400"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Accepted":
//         return <CheckCircle2 className="h-4 w-4" />
//       case "Wrong Answer":
//         return <XCircle className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
//           <p className="text-muted-foreground">Please wait</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !question) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <XCircle size={48} className="mx-auto mb-4 text-destructive" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
//           <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
//           <Button onClick={() => window.location.reload()} variant="outline">
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const acceptanceRate =
//     question.total_submissions > 0
//       ? ((question.accepted_submissions / question.total_submissions) * 100).toFixed(1)
//       : "0.0"

//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       {/* Left Panel - Problem Description */}
//       <div className="w-1/2 border-r border-border flex flex-col">
//         <div className="flex-1 overflow-auto">
//           <div className="p-6">
//             {/* Problem Header */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <h1 className="text-2xl font-bold text-foreground text-balance">
//                   {question.title || "Untitled Problem"}
//                 </h1>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {question.topics &&
//                   question.topics.length > 0 &&
//                   question.topics.map((topic, idx) => (
//                     <Badge key={idx} variant="outline" className="text-xs">
//                       {topic}
//                     </Badge>
//                   ))}
//               </div>
//             </div>

//             {/* Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
//                 <TabsTrigger
//                   value="description"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Description
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hints"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Hints
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="submissions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Submissions
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="solutions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Solutions
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="description" className="mt-6 space-y-6">
//                 {/* Description */}
//                 <div>
//                   <p className="text-foreground leading-relaxed whitespace-pre-line text-pretty">
//                     {question.description || "No description available"}
//                   </p>
//                 </div>

//                 {/* Examples */}
//                 {question.examples && (question.examples.input || question.examples.output) && (
//                   <div className="space-y-4">
//                     <Card className="p-4 bg-muted/50 border-muted">
//                       <p className="font-semibold mb-3 text-foreground">Example:</p>
//                       <div className="space-y-2 font-mono text-sm">
//                         <div className="bg-background/50 p-3 rounded-md">
//                           <span className="font-semibold text-muted-foreground">Input:</span>{" "}
//                           <span className="text-foreground">{question.examples.input || "N/A"}</span>
//                         </div>
//                         <div className="bg-background/50 p-3 rounded-md">
//                           <span className="font-semibold text-muted-foreground">Output:</span>{" "}
//                           <span className="text-foreground">{question.examples.output || "N/A"}</span>
//                         </div>
//                         {question.examples.explanation && question.examples.explanation !== "--" && (
//                           <div className="bg-background/50 p-3 rounded-md">
//                             <span className="font-semibold text-muted-foreground">Explanation:</span>{" "}
//                             <span className="text-foreground">{question.examples.explanation}</span>
//                           </div>
//                         )}
//                       </div>
//                     </Card>
//                   </div>
//                 )}

//                 {/* Constraints */}
//                 {question.constraints && question.constraints.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-3 text-foreground">Constraints:</h3>
//                     <ul className="space-y-2 font-mono text-sm">
//                       {question.constraints.map((constraint, idx) => (
//                         <li key={idx} className="text-muted-foreground">
//                           • {constraint}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Time and Memory Limits */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
//                     <p className="text-lg font-semibold text-foreground">{question.timeLimit} s</p>
//                   </div>
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
//                     <p className="text-lg font-semibold text-foreground">{question.memoryLimit} MB</p>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Accepted</p>
//                     <p className="text-lg font-semibold text-foreground">
//                       {question.accepted_submissions.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Submissions</p>
//                     <p className="text-lg font-semibold text-foreground">
//                       {question.total_submissions.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="col-span-2 bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-lg font-semibold text-foreground">{acceptanceRate}%</p>
//                       <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="hints" className="mt-6">
//                 <div className="space-y-3">
//                   {!question.hints || question.hints.length === 0 ? (
//                     <Card className="p-8 text-center border-dashed">
//                       <Lightbulb className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                       <p className="text-muted-foreground">No hints available for this problem</p>
//                     </Card>
//                   ) : (
//                     question.hints.map((hint, idx) => (
//                       <Collapsible key={idx}>
//                         <Card className="overflow-hidden border-muted">
//                           <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
//                             <div className="flex items-center gap-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                               <span className="font-semibold text-foreground">Hint {idx + 1}</span>
//                             </div>
//                             <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180 text-muted-foreground" />
//                           </CollapsibleTrigger>
//                           <CollapsibleContent>
//                             <div className="p-4 pt-0 border-t bg-muted/30">
//                               <p className="text-base text-foreground leading-relaxed">{hint}</p>
//                             </div>
//                           </CollapsibleContent>
//                         </Card>
//                       </Collapsible>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="submissions" className="mt-6">
//                 <div className="space-y-3">
//                   {!submissions || submissions.length === 0 ? (
//                     <Card className="p-8 text-center border-dashed">
//                       <Terminal className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                       <p className="text-muted-foreground mb-1">No submissions yet</p>
//                       <p className="text-sm text-muted-foreground">Submit your solution to see it here</p>
//                     </Card>
//                   ) : (
//                     submissions.map((submission) => (
//                       <Card
//                         key={submission.id}
//                         className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-muted"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={getStatusColor(submission.status)}>{getStatusIcon(submission.status)}</div>
//                             <div>
//                               <p className={`font-semibold ${getStatusColor(submission.status)}`}>
//                                 {submission.status}
//                               </p>
//                               <p className="text-sm text-muted-foreground">{submission.timestamp}</p>
//                             </div>
//                           </div>
//                           <div className="text-right text-sm">
//                             <p className="text-muted-foreground font-medium">{submission.language}</p>
//                             {submission.runtime !== "N/A" && (
//                               <p className="text-muted-foreground">
//                                 {submission.runtime} • {submission.memory}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </Card>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="solutions" className="mt-6">
//                 {!solutionCode || solutionCode.trim() === "" ? (
//                   <Card className="p-8 text-center border-dashed">
//                     <Code2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                     <p className="text-muted-foreground mb-2">No solution available yet</p>
//                     <p className="text-sm text-muted-foreground">
//                       Solutions will be available after you solve this problem
//                     </p>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Code2 className="h-5 w-5 text-primary" />
//                         <h3 className="font-semibold text-foreground">Official Solution</h3>
//                       </div>
//                       <Button
//                         onClick={() => navigator.clipboard.writeText(solutionCode)}
//                         variant="outline"
//                         size="sm"
//                         className="gap-2"
//                       >
//                         <Copy size={14} />
//                         Copy
//                       </Button>
//                     </div>
//                     <Card className="overflow-hidden border-muted">
//                       <div className="bg-muted/30 px-4 py-2 border-b border-border">
//                         <p className="text-sm text-muted-foreground font-medium">Solution Code</p>
//                       </div>
//                       <div className="h-[500px]">
//                         <Editor
//                           height="100%"
//                           language="cpp"
//                           theme={isDark ? "vs-dark" : "light"}
//                           value={solutionCode}
//                           options={{
//                             readOnly: true,
//                             fontSize: 14,
//                             minimap: { enabled: false },
//                             scrollBeyondLastLine: false,
//                             lineNumbers: "on",
//                             roundedSelection: false,
//                             padding: { top: 16, bottom: 16 },
//                           }}
//                         />
//                       </div>
//                     </Card>
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Code Editor */}
//       <div className="w-1/2 flex flex-col bg-background">
//         <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
//           <div className="flex items-center gap-4">
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-background text-foreground px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
//             >
//               {languageOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
//               <Clock className="h-4 w-4 text-muted-foreground" />
//               <span className="font-mono text-sm font-medium text-foreground">{formatTime(time)}</span>
//               <Button
//                 onClick={() => setIsTimerRunning(!isTimerRunning)}
//                 variant="ghost"
//                 size="icon"
//                 className="h-6 w-6 ml-1"
//               >
//                 {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
//               </Button>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Copy size={16} />
//               <span className="hidden sm:inline">Copy</span>
//             </Button>
//             <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
//               <SunIcon size={16} />
//             </Button>

//             <Button
//               onClick={submitCode}
//               disabled={isRunning}
//               size="sm"
//               className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>

//         {/* Monaco Editor */}
//         <div className="flex-1 overflow-hidden">
//           <Editor
//             height="100%"
//             language={language}
//             theme={isDark ? "vs-dark" : "light"}
//             value={code}
//             onChange={(value) => setCode(value || "")}
//             onMount={handleEditorDidMount}
//             options={{
//               fontSize: 14,
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               lineNumbers: "on",
//               roundedSelection: false,
//               padding: { top: 16, bottom: 16 },
//             }}
//           />
//         </div>

//         {/* Input/Output Section */}
//         <div className="h-64 border-t border-border flex flex-col bg-background">
//           <Tabs defaultValue="testcase" className="flex-1 flex flex-col">
//             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
//               <TabsTrigger
//                 value="testcase"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Testcase
//               </TabsTrigger>
//               <TabsTrigger
//                 value="result"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Test Result
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="testcase" className="flex-1 p-4 overflow-auto">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-foreground">Custom Input</label>
//                 <textarea
//                   value={customInput}
//                   onChange={(e) => setCustomInput(e.target.value)}
//                   placeholder="Enter your test input here..."
//                   className="w-full h-24 p-3 bg-muted border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
//                 />
//               </div>
//             </TabsContent>

//             <TabsContent value="result" className="flex-1 p-4 overflow-auto font-mono text-sm">
//               {!output || output.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                   <Terminal size={32} className="mb-2 opacity-50" />
//                   <p className="text-sm">Run code to see output</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {output.map((log, index) => (
//                     <div
//                       key={index}
//                       className={`p-2 rounded ${log.type === "error" ? "bg-destructive/10 text-destructive" : "text-foreground bg-muted/30"}`}
//                     >
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState, useRef, use, useEffect } from "react"
// import Editor from "@monaco-editor/react"
// import {
//   Play,
//   Copy,
//   Terminal,
//   SunIcon,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   TrendingUp,
//   Lightbulb,
//   ChevronDown,
//   Pause,
//   Loader2,
//   Code2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { createClient } from "@/lib/supabase/client"
// import { useToast } from "@/hooks/use-toast"

// const languageTemplates = {
//   cpp: `// Write your code here`,
//   javascript: `/**
// * @param {any} input
// * @return {any}
// */
// var solution = function(input) {
//     // Write your solution here
    
// };`,
//   python: `class Solution:
//     def solve(self, input):
//         # Write your solution here
//         pass`,
//   java: `class Solution {
//     public void solve() {
//         // Write your solution here
        
//     }
// }`,
// }

// const submissionsData = {
//   1: [
//     {
//       id: 1,
//       timestamp: "2025-02-10 14:30:25",
//       status: "Accepted",
//       runtime: "52 ms",
//       memory: "16.2 MB",
//       language: "C++",
//     },
//     {
//       id: 2,
//       timestamp: "2025-02-10 14:25:10",
//       status: "Wrong Answer",
//       runtime: "N/A",
//       memory: "N/A",
//       language: "C++",
//     },
//     {
//       id: 3,
//       timestamp: "2025-02-10 14:20:45",
//       status: "Time Limit Exceeded",
//       runtime: "N/A",
//       memory: "15.8 MB",
//       language: "Python",
//     },
//   ],
//   2: [
//     {
//       id: 1,
//       timestamp: "2025-02-09 10:15:30",
//       status: "Accepted",
//       runtime: "8 ms",
//       memory: "10.5 MB",
//       language: "JavaScript",
//     },
//   ],
// }

// export default function SolvePage({ params }) {
//   const resolvedParams = use(params)
//   const questionId = resolvedParams.id

//   const [question, setQuestion] = useState(null)
//   const [submissions, setSubmissions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [activeTab, setActiveTab] = useState("description")
//   const [language, setLanguage] = useState("cpp")
//   const [code, setCode] = useState(languageTemplates.cpp)
//   const [customInput, setCustomInput] = useState("")
//   const [output, setOutput] = useState([])
//   const [isRunning, setIsRunning] = useState(false)
//   const [isDark, setIsDark] = useState(true)
//   const [time, setTime] = useState(0)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const [solutionCode, setSolutionCode] = useState("")
//   const editorRef = useRef(null)

//   const [token, setToken] = useState(null)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const supabase = createClient()
//   const { toast } = useToast()

//   useEffect(() => {
//     const getToken = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (session) {
//         setToken(session.access_token)
//         setIsAuthenticated(true)
//       } else {
//         setIsAuthenticated(false)
//       }
//     }

//     getToken()

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         setToken(session.access_token)
//         setIsAuthenticated(true)
//       } else {
//         setToken(null)
//         setIsAuthenticated(false)
//       }
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   useEffect(() => {
//     if (!token) return

//     const fetchQuestion = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const response = await fetch(`http://localhost:5000/question/one/${questionId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data = await response.json()

//         if (data.success && data.questionData) {
//           const questionData = {
//             ...data.questionData,
//             examples: data.questionData.examples || { input: "", output: "" },
//             testCases: Array.isArray(data.questionData.testCases) ? data.questionData.testCases : [],
//             constraints: Array.isArray(data.questionData.constraints) ? data.questionData.constraints : [],
//             topics: Array.isArray(data.questionData.topics) ? data.questionData.topics : [],
//             hints: Array.isArray(data.questionData.hints) ? data.questionData.hints : [],
//             accepted_submissions: data.questionData.accepted_submissions || 0,
//             total_submissions: data.questionData.total_submissions || 0,
//             timeLimit: data.questionData.timeLimit || 1,
//             memoryLimit: data.questionData.memoryLimit || 128,
//           }
//           setQuestion(questionData)
//           setSolutionCode(data.questionData.solutionCode || "")
//           setSubmissions(submissionsData[questionId] || [])
//         } else {
//           throw new Error(data.message || "Failed to fetch question")
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch question")
//         console.error("Error fetching question:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchQuestion()
//   }, [questionId, token])

//   useEffect(() => {
//     let interval
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [isTimerRunning])

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [isDark])

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600)
//     const mins = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const languageOptions = [
//     { value: "cpp", label: "C++" },
//     { value: "javascript", label: "JavaScript" },
//     { value: "python", label: "Python" },
//     { value: "java", label: "Java" },
//   ]

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang)
//     setCode(languageTemplates[newLang])
//     setOutput([])
//   }

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor
//   }

//   const runCode = () => {
//     setIsRunning(true)
//     setOutput([])

//     setTimeout(() => {
//       setOutput([
//         { type: "log", message: "Running test cases..." },
//         { type: "log", message: "Test case 1: Passed ✓" },
//         { type: "log", message: "Test case 2: Passed ✓" },
//         { type: "log", message: "Runtime: 52 ms" },
//         { type: "log", message: "Memory: 16.2 MB" },
//       ])
//       setIsRunning(false)
//     }, 1500)
//   }

//   const submitCode = async () => {
//     // Check if user is authenticated
//     if (!isAuthenticated || !token) {
//       toast({
//         title: "Authentication Required",
//         description: "Please log in to submit your solution.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Check if code is empty
//     if (!code || code.trim() === "") {
//       toast({
//         title: "Empty Code",
//         description: "Please write some code before submitting.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)
//     setIsRunning(true)
//     setOutput([{ type: "log", message: "Submitting solution..." }])

//     try {
//       const response = await fetch("http://localhost:5000/code/submit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           code: code,
//           language: language,
//           qNumber: questionId,
//         }),
//       })

//       const data = await response.json()

//       // Handle successful submission
//       if (data.success) {
//         const submission = data.submission || {}
//         const outputMessages = [
//           { type: "success", message: "✓ Submission successful!" },
//           { type: "info", message: `Status: ${submission.status?.description || "Accepted"}` },
//         ]

//         // Add test results if available
//         if (submission.stdout) {
//           outputMessages.push({ 
//             type: "log", 
//             message: `Output: ${submission.stdout}` 
//           })
//         }

//         // Add performance metrics
//         if (submission.time) {
//           outputMessages.push({ 
//             type: "metric", 
//             message: `⏱️ Runtime: ${submission.time}s` 
//           })
//         }

//         if (submission.memory) {
//           outputMessages.push({ 
//             type: "metric", 
//             message: `💾 Memory: ${(submission.memory / 1024).toFixed(2)} MB` 
//           })
//         }

//         // Add execution details
//         if (submission.compile_output) {
//           outputMessages.push({ 
//             type: "log", 
//             message: `Compile: ${submission.compile_output}` 
//           })
//         }

//         // Add wall time if different from cpu time
//         if (submission.wall_time && submission.wall_time !== submission.time) {
//           outputMessages.push({ 
//             type: "metric", 
//             message: `Wall Time: ${submission.wall_time}s` 
//           })
//         }

//         // Add language info
//         if (submission.language?.name) {
//           outputMessages.push({ 
//             type: "info", 
//             message: `Language: ${submission.language.name}` 
//           })
//         }

//         setOutput(outputMessages)

//         toast({
//           title: "Success!",
//           description: data.message || "Your solution has been submitted successfully.",
//         })

//         // Optionally refresh submissions list
//         // You can add logic here to fetch updated submissions
//       } else {
//         throw new Error(data.message || "Submission failed")
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to submit code"

//       setOutput([
//         { type: "error", message: "Submission failed" },
//         { type: "error", message: errorMessage },
//       ])

//       toast({
//         title: "Submission Failed",
//         description: errorMessage,
//         variant: "destructive",
//       })

//       console.error("Error submitting code:", err)
//     } finally {
//       setIsSubmitting(false)
//       setIsRunning(false)
//     }
//   }

//   const copyCode = () => {
//     navigator.clipboard.writeText(code)
//     toast({
//       title: "Copied!",
//       description: "Code copied to clipboard.",
//     })
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy":
//         return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
//       case "Medium":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
//       case "Hard":
//         return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Accepted":
//         return "text-green-600 dark:text-green-400"
//       case "Wrong Answer":
//         return "text-red-600 dark:text-red-400"
//       case "Time Limit Exceeded":
//         return "text-yellow-600 dark:text-yellow-400"
//       default:
//         return "text-gray-600 dark:text-gray-400"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Accepted":
//         return <CheckCircle2 className="h-4 w-4" />
//       case "Wrong Answer":
//         return <XCircle className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
//           <p className="text-muted-foreground">Please wait</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !question) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <XCircle size={48} className="mx-auto mb-4 text-destructive" />
//           <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
//           <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
//           <Button onClick={() => window.location.reload()} variant="outline">
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const acceptanceRate =
//     question.total_submissions > 0
//       ? ((question.accepted_submissions / question.total_submissions) * 100).toFixed(1)
//       : "0.0"

//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       {/* Left Panel - Problem Description */}
//       <div className="w-1/2 border-r border-border flex flex-col">
//         <div className="flex-1 overflow-auto">
//           <div className="p-6">
//             {/* Problem Header */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <h1 className="text-2xl font-bold text-foreground text-balance">
//                   {question.title || "Untitled Problem"}
//                 </h1>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {question.topics &&
//                   question.topics.length > 0 &&
//                   question.topics.map((topic, idx) => (
//                     <Badge key={idx} variant="outline" className="text-xs">
//                       {topic}
//                     </Badge>
//                   ))}
//               </div>
//             </div>

//             {/* Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
//                 <TabsTrigger
//                   value="description"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Description
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hints"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Hints
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="submissions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Submissions
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="solutions"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//                 >
//                   Solutions
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="description" className="mt-6 space-y-6">
//                 {/* Description */}
//                 <div>
//                   <p className="text-foreground leading-relaxed whitespace-pre-line text-pretty">
//                     {question.description || "No description available"}
//                   </p>
//                 </div>

//                 {/* Examples */}
//                 {question.examples && (question.examples.input || question.examples.output) && (
//                   <div className="space-y-4">
//                     <Card className="p-4 bg-muted/50 border-muted">
//                       <p className="font-semibold mb-3 text-foreground">Example:</p>
//                       <div className="space-y-2 font-mono text-sm">
//                         <div className="bg-background/50 p-3 rounded-md">
//                           <span className="font-semibold text-muted-foreground">Input:</span>{" "}
//                           <span className="text-foreground">{question.examples.input || "N/A"}</span>
//                         </div>
//                         <div className="bg-background/50 p-3 rounded-md">
//                           <span className="font-semibold text-muted-foreground">Output:</span>{" "}
//                           <span className="text-foreground">{question.examples.output || "N/A"}</span>
//                         </div>
//                         {question.examples.explanation && question.examples.explanation !== "--" && (
//                           <div className="bg-background/50 p-3 rounded-md">
//                             <span className="font-semibold text-muted-foreground">Explanation:</span>{" "}
//                             <span className="text-foreground">{question.examples.explanation}</span>
//                           </div>
//                         )}
//                       </div>
//                     </Card>
//                   </div>
//                 )}

//                 {/* Constraints */}
//                 {question.constraints && question.constraints.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-3 text-foreground">Constraints:</h3>
//                     <ul className="space-y-2 font-mono text-sm">
//                       {question.constraints.map((constraint, idx) => (
//                         <li key={idx} className="text-muted-foreground">
//                           • {constraint}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Time and Memory Limits */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
//                     <p className="text-lg font-semibold text-foreground">{question.timeLimit} s</p>
//                   </div>
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
//                     <p className="text-lg font-semibold text-foreground">{question.memoryLimit} MB</p>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Accepted</p>
//                     <p className="text-lg font-semibold text-foreground">
//                       {question.accepted_submissions.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Submissions</p>
//                     <p className="text-lg font-semibold text-foreground">
//                       {question.total_submissions.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="col-span-2 bg-muted/30 p-4 rounded-lg">
//                     <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-lg font-semibold text-foreground">{acceptanceRate}%</p>
//                       <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="hints" className="mt-6">
//                 <div className="space-y-3">
//                   {!question.hints || question.hints.length === 0 ? (
//                     <Card className="p-8 text-center border-dashed">
//                       <Lightbulb className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                       <p className="text-muted-foreground">No hints available for this problem</p>
//                     </Card>
//                   ) : (
//                     question.hints.map((hint, idx) => (
//                       <Collapsible key={idx}>
//                         <Card className="overflow-hidden border-muted">
//                           <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
//                             <div className="flex items-center gap-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                               <span className="font-semibold text-foreground">Hint {idx + 1}</span>
//                             </div>
//                             <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180 text-muted-foreground" />
//                           </CollapsibleTrigger>
//                           <CollapsibleContent>
//                             <div className="p-4 pt-0 border-t bg-muted/30">
//                               <p className="text-base text-foreground leading-relaxed">{hint}</p>
//                             </div>
//                           </CollapsibleContent>
//                         </Card>
//                       </Collapsible>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="submissions" className="mt-6">
//                 <div className="space-y-3">
//                   {!submissions || submissions.length === 0 ? (
//                     <Card className="p-8 text-center border-dashed">
//                       <Terminal className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                       <p className="text-muted-foreground mb-1">No submissions yet</p>
//                       <p className="text-sm text-muted-foreground">Submit your solution to see it here</p>
//                     </Card>
//                   ) : (
//                     submissions.map((submission) => (
//                       <Card
//                         key={submission.id}
//                         className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-muted"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={getStatusColor(submission.status)}>{getStatusIcon(submission.status)}</div>
//                             <div>
//                               <p className={`font-semibold ${getStatusColor(submission.status)}`}>
//                                 {submission.status}
//                               </p>
//                               <p className="text-sm text-muted-foreground">{submission.timestamp}</p>
//                             </div>
//                           </div>
//                           <div className="text-right text-sm">
//                             <p className="text-muted-foreground font-medium">{submission.language}</p>
//                             {submission.runtime !== "N/A" && (
//                               <p className="text-muted-foreground">
//                                 {submission.runtime} • {submission.memory}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </Card>
//                     ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="solutions" className="mt-6">
//                 {!solutionCode || solutionCode.trim() === "" ? (
//                   <Card className="p-8 text-center border-dashed">
//                     <Code2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                     <p className="text-muted-foreground mb-2">No solution available yet</p>
//                     <p className="text-sm text-muted-foreground">
//                       Solutions will be available after you solve this problem
//                     </p>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Code2 className="h-5 w-5 text-primary" />
//                         <h3 className="font-semibold text-foreground">Official Solution</h3>
//                       </div>
//                       <Button
//                         onClick={() => navigator.clipboard.writeText(solutionCode)}
//                         variant="outline"
//                         size="sm"
//                         className="gap-2"
//                       >
//                         <Copy size={14} />
//                         Copy
//                       </Button>
//                     </div>
//                     <Card className="overflow-hidden border-muted">
//                       <div className="bg-muted/30 px-4 py-2 border-b border-border">
//                         <p className="text-sm text-muted-foreground font-medium">Solution Code</p>
//                       </div>
//                       <div className="h-[500px]">
//                         <Editor
//                           height="100%"
//                           language="cpp"
//                           theme={isDark ? "vs-dark" : "light"}
//                           value={solutionCode}
//                           options={{
//                             readOnly: true,
//                             fontSize: 14,
//                             minimap: { enabled: false },
//                             scrollBeyondLastLine: false,
//                             lineNumbers: "on",
//                             roundedSelection: false,
//                             padding: { top: 16, bottom: 16 },
//                           }}
//                         />
//                       </div>
//                     </Card>
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Code Editor */}
//       <div className="w-1/2 flex flex-col bg-background">
//         <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
//           <div className="flex items-center gap-4">
//             <select
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="bg-background text-foreground px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
//             >
//               {languageOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
//               <Clock className="h-4 w-4 text-muted-foreground" />
//               <span className="font-mono text-sm font-medium text-foreground">{formatTime(time)}</span>
//               <Button
//                 onClick={() => setIsTimerRunning(!isTimerRunning)}
//                 variant="ghost"
//                 size="icon"
//                 className="h-6 w-6 ml-1"
//               >
//                 {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
//               </Button>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Copy size={16} />
//               <span className="hidden sm:inline">Copy</span>
//             </Button>
//             <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
//               <SunIcon size={16} />
//             </Button>

//             <Button
//               onClick={submitCode}
//               disabled={isSubmitting || !isAuthenticated}
//               size="sm"
//               className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               title={!isAuthenticated ? "Please log in to submit" : "Submit your solution"}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Monaco Editor */}
//         <div className="flex-1 overflow-hidden">
//           <Editor
//             height="100%"
//             language={language}
//             theme={isDark ? "vs-dark" : "light"}
//             value={code}
//             onChange={(value) => setCode(value || "")}
//             onMount={handleEditorDidMount}
//             options={{
//               fontSize: 14,
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               lineNumbers: "on",
//               roundedSelection: false,
//               padding: { top: 16, bottom: 16 },
//             }}
//           />
//         </div>

//         {/* Input/Output Section */}
//         <div className="h-64 border-t border-border flex flex-col bg-background">
//           <Tabs defaultValue="testcase" className="flex-1 flex flex-col">
//             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
//               <TabsTrigger
//                 value="result"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 Test Result
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="testcase" className="flex-1 p-4 overflow-auto">
//               <div className="space-y-2">
//                 <label className="text-lg font-medium text-foreground">Run code to see output</label>
//               </div>
//             </TabsContent>

//             <TabsContent value="result" className="flex-1 p-4 overflow-auto font-mono text-sm">
//               {!output || output.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                   <Terminal size={32} className="mb-2 opacity-50" />
//                   <p className="text-sm">Run code to see output</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {output.map((log, index) => (
//                     <div
//                       key={index}
//                       className={`p-2 rounded ${log.type === "error" ? "bg-destructive/10 text-destructive" : "text-foreground bg-muted/30"}`}
//                     >
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useRef, use, useEffect } from "react"
import Editor from "@monaco-editor/react"
import {
  Play,
  Copy,
  Terminal,
  SunIcon,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Lightbulb,
  ChevronDown,
  Pause,
  Loader2,
  Code2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

const languageTemplates = {
  cpp: `// Write your code here`,
  javascript: `/**
* @param {any} input
* @return {any}
*/
var solution = function(input) {
    // Write your solution here
    
};`,
  python: `class Solution:
    def solve(self, input):
        # Write your solution here
        pass`,
  java: `class Solution {
    public void solve() {
        // Write your solution here
        
    }
}`,
}

const submissionsData = {
  1: [
    {
      id: 1,
      timestamp: "2025-02-10 14:30:25",
      status: "Accepted",
      runtime: "52 ms",
      memory: "16.2 MB",
      language: "C++",
    },
    {
      id: 2,
      timestamp: "2025-02-10 14:25:10",
      status: "Wrong Answer",
      runtime: "N/A",
      memory: "N/A",
      language: "C++",
    },
    {
      id: 3,
      timestamp: "2025-02-10 14:20:45",
      status: "Time Limit Exceeded",
      runtime: "N/A",
      memory: "15.8 MB",
      language: "Python",
    },
  ],
  2: [
    {
      id: 1,
      timestamp: "2025-02-09 10:15:30",
      status: "Accepted",
      runtime: "8 ms",
      memory: "10.5 MB",
      language: "JavaScript",
    },
  ],
}

export default function SolvePage({ params }) {
  const resolvedParams = use(params)
  const questionId = resolvedParams.id

  const [question, setQuestion] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeTab, setActiveTab] = useState("description")
  const [language, setLanguage] = useState("cpp")
  const [code, setCode] = useState(languageTemplates.cpp)
  const [customInput, setCustomInput] = useState("")
  const [output, setOutput] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [time, setTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [solutionCode, setSolutionCode] = useState("")
  const editorRef = useRef(null)

  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const getToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setToken(session.access_token)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }

    getToken()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token)
        setIsAuthenticated(true)
      } else {
        setToken(null)
        setIsAuthenticated(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!token) return

    const fetchQuestion = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:5000/question/one/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.questionData) {
          const questionData = {
            ...data.questionData,
            examples: data.questionData.examples || { input: "", output: "" },
            testCases: Array.isArray(data.questionData.testCases) ? data.questionData.testCases : [],
            constraints: Array.isArray(data.questionData.constraints) ? data.questionData.constraints : [],
            topics: Array.isArray(data.questionData.topics) ? data.questionData.topics : [],
            hints: Array.isArray(data.questionData.hints) ? data.questionData.hints : [],
            accepted_submissions: data.questionData.accepted_submissions || 0,
            total_submissions: data.questionData.total_submissions || 0,
            timeLimit: data.questionData.timeLimit || 1,
            memoryLimit: data.questionData.memoryLimit || 128,
          }
          setQuestion(questionData)
          setSolutionCode(data.questionData.solutionCode || "")
          setSubmissions(submissionsData[questionId] || [])
        } else {
          throw new Error(data.message || "Failed to fetch question")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch question")
        console.error("Error fetching question:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [questionId, token])

  useEffect(() => {
    let interval
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const languageOptions = [
    { value: "cpp", label: "C++" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ]

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    setCode(languageTemplates[newLang])
    setOutput([])
  }

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  const runCode = () => {
    setIsRunning(true)
    setOutput([])

    setTimeout(() => {
      setOutput([
        { type: "log", message: "Running test cases..." },
        { type: "log", message: "Test case 1: Passed ✓" },
        { type: "log", message: "Test case 2: Passed ✓" },
        { type: "log", message: "Runtime: 52 ms" },
        { type: "log", message: "Memory: 16.2 MB" },
      ])
      setIsRunning(false)
    }, 1500)
  }

  const submitCode = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your solution.",
        variant: "destructive",
      })
      return
    }

    // Check if code is empty
    if (!code || code.trim() === "") {
      toast({
        title: "Empty Code",
        description: "Please write some code before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setIsRunning(true)
    setOutput([{ type: "log", message: "Submitting solution..." }])

    try {
      const response = await fetch("http://localhost:5000/code/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code,
          language: language,
          qNumber: questionId,
        }),
      })

      const data = await response.json()

      // Handle successful submission
      if (data.success) {
        const submission = data.submission || {}
        const outputMessages = [
          { type: "success", message: "✓ Submission successful!" },
          { type: "info", message: `Status: ${submission.status?.description || "Accepted"}` },
        ]

        // Add test results if available
        if (submission.stdout) {
          outputMessages.push({
            type: "log",
            message: `Output: ${submission.stdout}`,
          })
        }

        // Add performance metrics
        if (submission.time) {
          outputMessages.push({
            type: "metric",
            message: `⏱️ Runtime: ${submission.time}s`,
          })
        }

        if (submission.memory) {
          outputMessages.push({
            type: "metric",
            message: `💾 Memory: ${(submission.memory / 1024).toFixed(2)} MB`,
          })
        }

        // Add execution details
        if (submission.compile_output) {
          outputMessages.push({
            type: "log",
            message: `Compile: ${submission.compile_output}`,
          })
        }

        // Add wall time if different from cpu time
        if (submission.wall_time && submission.wall_time !== submission.time) {
          outputMessages.push({
            type: "metric",
            message: `Wall Time: ${submission.wall_time}s`,
          })
        }

        // Add language info
        if (submission.language?.name) {
          outputMessages.push({
            type: "info",
            message: `Language: ${submission.language.name}`,
          })
        }

        setOutput(outputMessages)

        toast({
          title: "Success!",
          description: data.message || "Your solution has been submitted successfully.",
        })

        // Optionally refresh submissions list
        // You can add logic here to fetch updated submissions
      } else {
        throw new Error(data.message || "Submission failed")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit code"

      setOutput([
        { type: "error", message: "Submission failed" },
        { type: "error", message: errorMessage },
      ])

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })

      console.error("Error submitting code:", err)
    } finally {
      setIsSubmitting(false)
      setIsRunning(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    })
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600 dark:text-green-400"
      case "Wrong Answer":
        return "text-red-600 dark:text-red-400"
      case "Time Limit Exceeded":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle2 className="h-4 w-4" />
      case "Wrong Answer":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const parseOutput = (out) => {
    const hasError = out.some((o) => o.type === "error")
    const statusText =
      out.find((o) => o.type === "success")?.message ||
      out.find((o) => o.type === "info")?.message ||
      (hasError ? "Submission failed" : "Results")

    const metrics = out.filter((o) => o.type === "metric").map((o) => o.message)
    const stdout = out.find((o) => o.message.startsWith("Output:"))?.message.replace(/^Output:\s*/, "")
    const compile = out.find((o) => o.message.startsWith("Compile:"))?.message.replace(/^Compile:\s*/, "")

    return { hasError, statusText, metrics, stdout, compile }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading question...</h3>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <XCircle size={48} className="mx-auto mb-4 text-destructive" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Error loading question</h3>
          <p className="text-muted-foreground mb-4">{error || "Question not found"}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const acceptanceRate =
    question.total_submissions > 0
      ? ((question.accepted_submissions / question.total_submissions) * 100).toFixed(1)
      : "0.0"

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Left Panel - Problem Description */}
      <div className="w-1/2 border-r border-border flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Problem Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h1 className="text-2xl font-bold text-foreground text-balance">
                  {question.title || "Untitled Problem"}
                </h1>
                {/* Difficulty Chip */}
                {question.difficulty && (
                  <div
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(
                      question.difficulty,
                    )}`}
                    aria-label="Problem difficulty"
                  >
                    {question.difficulty}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {question.topics &&
                  question.topics.length > 0 &&
                  question.topics.map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
              </div>
            </div>
            {/* End: Problem Header */}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="hints"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Hints
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Submissions
                </TabsTrigger>
                <TabsTrigger
                  value="solutions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Solutions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6 space-y-6">
                {/* Description */}
                <div>
                  <p className="text-foreground leading-relaxed whitespace-pre-line text-pretty">
                    {question.description || "No description available"}
                  </p>
                </div>

                {/* Examples */}
                {question.examples && (question.examples.input || question.examples.output) && (
                  <div className="space-y-4">
                    <Card className="p-4 bg-muted/50 border-muted">
                      <p className="font-semibold mb-3 text-foreground">Example:</p>
                      <div className="space-y-2 font-mono text-sm">
                        <div className="bg-background/50 p-3 rounded-md">
                          <span className="font-semibold text-muted-foreground">Input:</span>{" "}
                          <span className="text-foreground">{question.examples.input || "N/A"}</span>
                        </div>
                        <div className="bg-background/50 p-3 rounded-md">
                          <span className="font-semibold text-muted-foreground">Output:</span>{" "}
                          <span className="text-foreground">{question.examples.output || "N/A"}</span>
                        </div>
                        {question.examples.explanation && question.examples.explanation !== "--" && (
                          <div className="bg-background/50 p-3 rounded-md">
                            <span className="font-semibold text-muted-foreground">Explanation:</span>{" "}
                            <span className="text-foreground">{question.examples.explanation}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Constraints */}
                {question.constraints && question.constraints.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Constraints:</h3>
                    <ul className="space-y-2 font-mono text-sm">
                      {question.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          • {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Time and Memory Limits */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
                    <p className="text-lg font-semibold text-foreground">{question.timeLimit} s</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Memory Limit</p>
                    <p className="text-lg font-semibold text-foreground">{question.memoryLimit} MB</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Accepted</p>
                    <p className="text-lg font-semibold text-foreground">
                      {question.accepted_submissions.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Submissions</p>
                    <p className="text-lg font-semibold text-foreground">
                      {question.total_submissions.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{acceptanceRate}%</p>
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hints" className="mt-6">
                <div className="space-y-3">
                  {!question.hints || question.hints.length === 0 ? (
                    <Card className="p-8 text-center border-dashed">
                      <Lightbulb className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No hints available for this problem</p>
                    </Card>
                  ) : (
                    question.hints.map((hint, idx) => (
                      <Collapsible key={idx}>
                        <Card className="overflow-hidden border-muted">
                          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              <span className="font-semibold text-foreground">Hint {idx + 1}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180 text-muted-foreground" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-4 pt-0 border-t bg-muted/30">
                              <p className="text-base text-foreground leading-relaxed">{hint}</p>
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="mt-6">
                <div className="space-y-3">
                  {!submissions || submissions.length === 0 ? (
                    <Card className="p-8 text-center border-dashed">
                      <Terminal className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground mb-1">No submissions yet</p>
                      <p className="text-sm text-muted-foreground">Submit your solution to see it here</p>
                    </Card>
                  ) : (
                    submissions.map((submission) => (
                      <Card
                        key={submission.id}
                        className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-muted"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={getStatusColor(submission.status)}>{getStatusIcon(submission.status)}</div>
                            <div>
                              <p className={`font-semibold ${getStatusColor(submission.status)}`}>
                                {submission.status}
                              </p>
                              <p className="text-sm text-muted-foreground">{submission.timestamp}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground font-medium">{submission.language}</p>
                            {submission.runtime !== "N/A" && (
                              <p className="text-muted-foreground">
                                {submission.runtime} • {submission.memory}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="mt-6">
                {!solutionCode || solutionCode.trim() === "" ? (
                  <Card className="p-8 text-center border-dashed">
                    <Code2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-2">No solution available yet</p>
                    <p className="text-sm text-muted-foreground">
                      Solutions will be available after you solve this problem
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">Official Solution</h3>
                      </div>
                      <Button
                        onClick={() => navigator.clipboard.writeText(solutionCode)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Copy size={14} />
                        Copy
                      </Button>
                    </div>
                    <Card className="overflow-hidden border-muted">
                      <div className="bg-muted/30 px-4 py-2 border-b border-border">
                        <p className="text-sm text-muted-foreground font-medium">Solution Code</p>
                      </div>
                      <div className="h-[500px]">
                        <Editor
                          height="100%"
                          language="cpp"
                          theme={isDark ? "vs-dark" : "light"}
                          value={solutionCode}
                          options={{
                            readOnly: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            lineNumbers: "on",
                            roundedSelection: false,
                            padding: { top: 16, bottom: 16 },
                          }}
                        />
                      </div>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="w-1/2 flex flex-col bg-background">
        <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background text-foreground px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm font-medium text-foreground">{formatTime(time)}</span>
              <Button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
              >
                {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Run button for quick feedback before submit */}
            <Button
              onClick={runCode}
              variant="secondary"
              size="sm"
              className="gap-2"
              title="Run locally against sample tests"
            >
              <Play size={16} />
              <span className="hidden sm:inline">Run</span>
            </Button>

            <Button onClick={copyCode} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Copy size={16} />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm" className="gap-2">
              <SunIcon size={16} />
            </Button>

            <Button
              onClick={submitCode}
              disabled={isSubmitting || !isAuthenticated}
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!isAuthenticated ? "Please log in to submit" : "Submit your solution"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme={isDark ? "vs-dark" : "light"}
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              roundedSelection: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        {/* Input/Output Section */}
        <div className="h-64 border-t border-border flex flex-col bg-background">
          <Tabs defaultValue="result" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent px-4">
              <TabsTrigger
                value="result"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Result
              </TabsTrigger>
              <TabsTrigger
                value="log"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Execution Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="result" className="flex-1 p-4 overflow-auto">
              {!output || output.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Terminal size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">Run or Submit code to see results</p>
                </div>
              ) : (
                (() => {
                  const parsed = parseOutput(output)
                  return (
                    <div className="space-y-4">
                      {/* Status card */}
                      <Card
                        className={`p-4 border ${
                          parsed.hasError
                            ? "border-destructive/40 bg-destructive/5"
                            : "border-green-600/30 dark:border-green-400/30 bg-green-50/40 dark:bg-green-950/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {parsed.hasError ? (
                            <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-semibold ${parsed.hasError ? "text-destructive" : "text-foreground"}`}>
                              {parsed.statusText}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {parsed.hasError
                                ? "Fix the issues shown below and try again."
                                : "Great! Review performance and output below."}
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Metrics grid */}
                      {parsed.metrics.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {parsed.metrics.map((m, i) => (
                            <div
                              key={i}
                              className="bg-muted/30 p-3 rounded-md border border-border text-sm font-medium"
                            >
                              {m}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Output */}
                      {parsed.stdout && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Program Output</p>
                          <Card className="p-0 overflow-hidden border-muted">
                            <div className="bg-muted/30 px-3 py-2 border-b border-border text-xs text-muted-foreground">
                              stdout
                            </div>
                            <pre className="p-3 text-foreground font-mono text-sm overflow-auto">{parsed.stdout}</pre>
                          </Card>
                        </div>
                      )}

                      {/* Compile messages */}
                      {parsed.compile && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Compiler Output</p>
                          <Card className="p-0 overflow-hidden border-muted">
                            <div className="bg-muted/30 px-3 py-2 border-b border-border text-xs text-muted-foreground">
                              compilation
                            </div>
                            <pre className="p-3 text-foreground font-mono text-sm overflow-auto">{parsed.compile}</pre>
                          </Card>
                        </div>
                      )}
                    </div>
                  )
                })()
              )}
            </TabsContent>

            <TabsContent value="log" className="flex-1 p-4 overflow-auto font-mono text-sm">
              {!output || output.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Terminal size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No logs yet. Run or Submit to generate logs.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {output.map((entry, index) => {
                    const base = "p-2 rounded-md border bg-background text-foreground flex items-start gap-2"
                    let tone = "border-border"
                    let Icon = Terminal

                    if (entry.type === "error") {
                      tone = "border-destructive/50 bg-destructive/10 text-destructive"
                      Icon = XCircle
                    } else if (entry.type === "success") {
                      tone = "border-green-600/40 dark:border-green-400/30 bg-green-50/40 dark:bg-green-950/20"
                      Icon = CheckCircle2
                    } else if (entry.type === "metric") {
                      tone = "border-blue-600/30 dark:border-blue-400/30 bg-blue-50/40 dark:bg-blue-950/20"
                      Icon = Clock
                    }

                    return (
                      <div key={index} className={`${base} ${tone}`}>
                        <Icon className="h-4 w-4 mt-0.5" />
                        <span className="whitespace-pre-wrap">{entry.message}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

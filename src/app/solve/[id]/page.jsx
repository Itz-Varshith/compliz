"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
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
  RotateCcw,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { AIChat } from "@/components/ai-chat";

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
};

export default function SolvePage({ params }) {
  const resolvedParams = params;
  const questionId = resolvedParams.id;

  const [question, setQuestion] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("description");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(languageTemplates.cpp);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [solutionCode, setSolutionCode] = useState("");
  const editorRef = useRef(null);

  // Use global theme
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [submissionsMeta, setSubmissionsMeta] = useState(null);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);

  // Resizable panel states
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [consoleHeight, setConsoleHeight] = useState(35);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);

  // AI Chat states
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatWidth, setAiChatWidth] = useState(30);

  const supabase = createClient();
  const { toast } = useToast();

  // Resize handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingVertical) {
        const container = document.getElementById("main-container");
        if (container) {
          const rect = container.getBoundingClientRect();
          const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
          setLeftPanelWidth(Math.min(Math.max(newWidth, 25), 75));
        }
      }

      if (isDraggingHorizontal) {
        const rightPanel = document.getElementById("right-panel");
        if (rightPanel) {
          const rect = rightPanel.getBoundingClientRect();
          const newHeight = ((rect.bottom - e.clientY) / rect.height) * 100;
          setConsoleHeight(Math.min(Math.max(newHeight, 20), 60));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingVertical(false);
      setIsDraggingHorizontal(false);
    };

    if (isDraggingVertical || isDraggingHorizontal) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isDraggingVertical
        ? "col-resize"
        : "row-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isDraggingVertical, isDraggingHorizontal]);

  useEffect(() => {
    const getToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setToken(session.access_token);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    getToken();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/question/one/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.questionData) {
          const questionData = {
            ...data.questionData,
            examples: data.questionData.examples || { input: "", output: "" },
            testCases: Array.isArray(data.questionData.testCases)
              ? data.questionData.testCases
              : [],
            constraints: Array.isArray(data.questionData.constraints)
              ? data.questionData.constraints
              : [],
            topics: Array.isArray(data.questionData.topics)
              ? data.questionData.topics
              : [],
            hints: Array.isArray(data.questionData.hints)
              ? data.questionData.hints
              : [],
            accepted_submissions: data.questionData.accepted_submissions || 0,
            total_submissions: data.questionData.total_submissions || 0,
            timeLimit: data.questionData.timeLimit || 1,
            memoryLimit: data.questionData.memoryLimit || 128,
          };
          setQuestion(questionData);
          setSolutionCode(data.questionData.solutionCode || "");
          setSubmissions([]);
        } else {
          throw new Error(data.message || "Failed to fetch question");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch question"
        );
        console.error("Error fetching question:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, token]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Track mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const languageOptions = [
    { value: "cpp", label: "C++" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
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

    setTimeout(() => {
      setOutput([
        { type: "log", message: "Running test cases..." },
        { type: "log", message: "Test case 1: Passed ✓" },
        { type: "log", message: "Test case 2: Passed ✓" },
        { type: "log", message: "Runtime: 52 ms" },
        { type: "log", message: "Memory: 16.2 MB" },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const submitCode = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your solution.",
        variant: "destructive",
      });
      return;
    }

    if (!code || code.trim() === "") {
      toast({
        title: "Empty Code",
        description: "Please write some code before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setIsRunning(true);
    setOutput([{ type: "log", message: "Submitting solution..." }]);

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
      });

      const data = await response.json();

      if (data.success) {
        const submission = data.submission || {};
        const statusDescription =
          submission.status?.description ||
          submission.status?.name ||
          "Unknown";
        let displayStatus = statusDescription;
        if (statusDescription === "Wrong Answer") {
          displayStatus = "Test cases failed";
        }
        const isAccepted = statusDescription === "Accepted";

        const outputMessages = [
          { type: "success", message: "Submission successful!" },
          {
            type: "status",
            message: displayStatus,
            isAccepted: isAccepted,
          },
        ];

        const logMessages = [
          { type: "success", message: "✓ Submission successful!" },
          { type: "info", message: `Status: ${statusDescription}` },
        ];

        if (submission.stdout) {
          logMessages.push({
            type: "output",
            message: submission.stdout,
          });
        }

        if (submission.stderr) {
          logMessages.push({
            type: "error",
            message: submission.stderr,
          });
        }

        if (submission.time) {
          outputMessages.push({
            type: "metric",
            label: "Runtime",
            value: `${submission.time}s`,
          });
          logMessages.push({
            type: "metric",
            message: `⏱️ Runtime: ${submission.time}s`,
          });
        }

        if (submission.memory) {
          outputMessages.push({
            type: "metric",
            label: "Memory",
            value: `${(submission.memory / 1024).toFixed(2)} MB`,
          });
          logMessages.push({
            type: "metric",
            message: `💾 Memory: ${(submission.memory / 1024).toFixed(2)} MB`,
          });
        }

        if (submission.wall_time) {
          outputMessages.push({
            type: "metric",
            label: "Wall Time",
            value: `${submission.wall_time}s`,
          });
          logMessages.push({
            type: "metric",
            message: `🕐 Wall Time: ${submission.wall_time}s`,
          });
        }

        if (submission.compile_output) {
          logMessages.push({
            type: "log",
            message: `Compile: ${submission.compile_output}`,
          });
        }

        if (submission.language?.name) {
          logMessages.push({
            type: "info",
            message: `Language: ${submission.language.name}`,
          });
        }

        outputMessages.push({ type: "log_data", data: logMessages });
        setOutput(outputMessages);

        setShowSubmissionSuccess(true);
        setTimeout(() => setShowSubmissionSuccess(false), 3000);

        toast({
          title: "Success!",
          description:
            data.message || "Your solution has been submitted successfully.",
        });

        fetchSubmissions();
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit code";

      setOutput([
        { type: "error", message: "Submission failed" },
        { type: "error", message: errorMessage },
      ]);

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });

      console.error("Error submitting code:", err);
    } finally {
      setIsSubmitting(false);
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    });
  };

  const fetchSubmissions = async () => {
    if (!questionId) return;
    try {
      setIsSubmissionsLoading(true);
      setSubmissionsError(null);
      setSubmissionsMeta(null);
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        `http://localhost:5000/submission/one/${questionId}`,
        { headers }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();
      setSubmissionsMeta({
        success: typeof raw?.success === "boolean" ? raw.success : undefined,
        message: typeof raw?.message === "string" ? raw.message : undefined,
      });

      const list = Array.isArray(raw)
        ? raw
        : raw?.allSubmissions || raw?.data || [];

      const normalized = (list || []).map((s, idx) => {
        const runtimeMs =
          typeof s.time_ms === "number"
            ? `${s.time_ms} ms`
            : typeof s.timeUsed === "number"
            ? `${s.timeUsed} ms`
            : typeof s.time === "number"
            ? `${Math.round(s.time * 1000)} ms`
            : s.runtime || "N/A";
        const memoryText =
          typeof s.memory_kb === "number"
            ? `${s.memory_kb} KB`
            : typeof s.memoryUsed === "number"
            ? `${s.memoryUsed} KB`
            : typeof s.memory === "number"
            ? `${(s.memory / 1024).toFixed(1)} MB`
            : s.memory_text || s.memory || "N/A";

        let displayStatus = s.verdict || s.status || "Unknown";
        if (displayStatus === "Wrong Answer") {
          displayStatus = "Test cases failed";
        }

        return {
          id: s.id || s._id || s.submissionId || `${idx}`,
          timestamp:
            s.timestamp ||
            s.createdAt ||
            s.created_at ||
            s.time ||
            new Date().toISOString(),
          status: displayStatus,
          runtime: runtimeMs,
          memory: memoryText,
          language:
            s.language?.name || s.langId || s.lang || s.language || "Unknown",
        };
      });

      setSubmissions(normalized);
    } catch (e) {
      setSubmissionsError(e?.message || "Failed to load submissions");
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "submissions") {
      fetchSubmissions();
    }
  }, [activeTab, questionId, token]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800";
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800";
    }
  };

  const getStatusColor = (status) => {
    if (status === "Accepted" || status?.toLowerCase().includes("accepted")) {
      return "text-green-600 dark:text-green-400";
    }

    switch (status) {
      case "Wrong Answer":
      case "Test cases failed":
        return "text-red-600 dark:text-red-400";
      case "Time Limit Exceeded":
        return "text-yellow-600 dark:text-yellow-400";
      case "Compilation Error":
      case "Runtime Error":
      case "Runtime Error (NZEC)":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Accepted" || status?.toLowerCase().includes("accepted")) {
      return <CheckCircle2 className="h-4 w-4" />;
    }

    switch (status) {
      case "Wrong Answer":
      case "Test cases failed":
      case "Compilation Error":
      case "Runtime Error":
      case "Runtime Error (NZEC)":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const parseOutput = (out) => {
    const hasError = out.some((o) => o.type === "error");
    const statusEntry = out.find((o) => o.type === "status");
    const statusText = statusEntry?.message || "Results";
    const isAccepted = statusEntry?.isAccepted || false;

    const metrics = out.filter((o) => o.type === "metric");
    const logData = out.find((o) => o.type === "log_data")?.data || out;

    return { hasError, statusText, isAccepted, metrics, logData };
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2
            size={48}
            className="mx-auto mb-4 text-primary animate-spin"
          />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Loading question...
          </h3>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <XCircle size={48} className="mx-auto mb-4 text-destructive" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Error loading question
          </h3>
          <p className="text-muted-foreground mb-4">
            {error || "Question not found"}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const acceptanceRate =
    question.total_submissions > 0
      ? (
          (question.accepted_submissions / question.total_submissions) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div
      id="main-container"
      className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden relative"
    >
      {/* Left Panel - Problem Description */}
      <div
        className="border-r border-border flex flex-col overflow-hidden"
        style={{ width: `${leftPanelWidth}%` }}
      >
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Problem Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h1 className="text-2xl font-bold text-foreground text-balance">
                  {question.title || "Untitled Problem"}
                </h1>
                {question.difficulty && (
                  <div
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(
                      question.difficulty
                    )}`}
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

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
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
                <div>
                  <p className="text-foreground leading-relaxed whitespace-pre-line text-pretty">
                    {question.description || "No description available"}
                  </p>
                </div>

                {question.examples &&
                  (question.examples.input || question.examples.output) && (
                    <div className="space-y-4">
                      <Card className="p-4 bg-muted/50 border-muted">
                        <p className="font-semibold mb-3 text-foreground">
                          Example:
                        </p>
                        <div className="space-y-2 font-mono text-sm">
                          <div className="bg-background/50 p-3 rounded-md flex flex-col gap-1">
                            <span className="font-semibold text-muted-foreground">
                              Input:
                            </span>
                            <span className="text-foreground whitespace-pre-line">
                              {question.examples.input || "N/A"}
                            </span>
                          </div>
                          <div className="bg-background/50 p-3 rounded-md flex flex-col gap-1">
                            <span className="font-semibold text-muted-foreground">
                              Output:
                            </span>
                            <span className="text-foreground whitespace-pre-line">
                              {question.examples.output || "N/A"}
                            </span>
                          </div>
                          {question.examples.explanation &&
                            question.examples.explanation !== "--" && (
                              <div className="bg-background/50 p-3 rounded-md">
                                <span className="font-semibold text-muted-foreground">
                                  Explanation:
                                </span>{" "}
                                <span className="text-foreground">
                                  {question.examples.explanation}
                                </span>
                              </div>
                            )}
                        </div>
                      </Card>
                    </div>
                  )}

                {question.constraints && question.constraints.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">
                      Constraints:
                    </h3>
                    <ul className="space-y-2 font-mono text-sm">
                      {question.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          • {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Time Limit
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {question.timeLimit} s
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Memory Limit
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {question.memoryLimit} MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Accepted
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {question.accepted_submissions.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Submissions
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {question.total_submissions.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Acceptance Rate
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">
                        {acceptanceRate}%
                      </p>
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
                      <p className="text-muted-foreground">
                        No hints available for this problem
                      </p>
                    </Card>
                  ) : (
                    question.hints.map((hint, idx) => (
                      <Collapsible key={idx}>
                        <Card className="overflow-hidden border-muted">
                          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              <span className="font-semibold text-foreground">
                                Hint {idx + 1}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180 text-muted-foreground" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-4 pt-0 border-t bg-muted/30">
                              <p className="text-base text-foreground leading-relaxed">
                                {hint}
                              </p>
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">
                    Your Submissions
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={fetchSubmissions}
                    disabled={isSubmissionsLoading}
                    className="gap-2bg-transparent"
                    title="Refresh submissions"
                  >
                    <RotateCcw
                      className={`h-4 w-4 ${
                        isSubmissionsLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </div>

                {isSubmissionsLoading ? (
                  <div className="space-y-3">
                    <Card className="p-4 border-muted animate-pulse" />
                    <Card className="p-4 border-muted animate-pulse" />
                    <Card className="p-4 border-muted animate-pulse" />
                  </div>
                ) : submissionsError ? (
                  <Card className="p-4 border-destructive/40 bg-destructive/5">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">
                          Failed to load submissions
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {submissionsError}
                        </p>
                        <div className="mt-3">
                          <Button size="sm" onClick={fetchSubmissions}>
                            Retry
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : !submissions || submissions.length === 0 ? (
                  <Card className="p-8 text-center border-dashed">
                    <Terminal className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-1">
                      No submissions yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submit your solution to see it here
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {[...submissions]
                      .sort(
                        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                      )
                      .map((submission) => {
                        // ... the rest of your mapping logic remains the same
                        const formattedDate = new Date(
                          submission.timestamp
                        ).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });

                        return (
                          <Card
                            key={submission.id}
                            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-muted"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={getStatusColor(submission.status)}
                                >
                                  {getStatusIcon(submission.status)}
                                </div>
                                <div>
                                  <p
                                    className={`font-semibold ${getStatusColor(
                                      submission.status
                                    )}`}
                                  >
                                    {submission.status}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formattedDate}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <p className="text-muted-foreground font-medium">
                                  {submission.language}
                                </p>
                                {submission.runtime !== "N/A" && (
                                  <p className="text-muted-foreground">
                                    {submission.runtime} • {submission.memory}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="solutions" className="mt-6">
                {!solutionCode || solutionCode.trim() === "" ? (
                  <Card className="p-8 text-center border-dashed">
                    <Code2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-2">
                      No solution available yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Solutions will be available after you solve this problem
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">
                          Official Solution
                        </h3>
                      </div>
                      <Button
                        onClick={() =>
                          navigator.clipboard.writeText(solutionCode)
                        }
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
                        <p className="text-sm text-muted-foreground font-medium">
                          Solution Code
                        </p>
                      </div>
                      <div className="h-[500px]">
                        <Editor
                          height="100%"
                          language="cpp"
                          theme={
                            mounted && resolvedTheme === "dark"
                              ? "vs-dark"
                              : "light"
                          }
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

      {/* Vertical Resize Handle */}
      <div
        className="w-1 bg-border hover:bg-primary hover:w-1.5 cursor-col-resize transition-all duration-150 relative group flex-shrink-0"
        onMouseDown={() => setIsDraggingVertical(true)}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10" />
      </div>

      {/* Right Panel - Code Editor */}
      <div
        id="right-panel"
        className="flex bg-background overflow-hidden"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {/* Code Editor Section */}
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: showAIChat ? `${100 - aiChatWidth}%` : "100%" }}
        >
          {/* Top Bar */}
          <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border shrink-0">
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
                <span className="font-mono text-sm font-medium text-foreground">
                  {formatTime(time)}
                </span>
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1"
                  title={isTimerRunning ? "Pause timer" : "Start timer"}
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                </Button>
                <Button
                  onClick={() => {
                    setTime(0);
                    setIsTimerRunning(false);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="Reset timer"
                >
                  <RotateCcw size={14} />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 relative">
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

              <Button
                onClick={copyCode}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Copy size={16} />
                <span className="hidden sm:inline">Copy</span>
              </Button>

              {/* AI Chat Toggle */}
              <Button
                onClick={() => setShowAIChat(!showAIChat)}
                variant={showAIChat ? "default" : "outline"}
                size="sm"
                className="gap-2 bg-transparent"
                title="Toggle AI Assistant"
              >
                <Sparkles
                  size={16}
                  className={showAIChat ? "text-yellow-400" : ""}
                />
                <span className="hidden sm:inline">AI</span>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              <Button
                onClick={submitCode}
                disabled={isSubmitting || !isAuthenticated}
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isAuthenticated
                    ? "Please log in to submit"
                    : "Submit your solution"
                }
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

              {showSubmissionSuccess && (
                <div className="absolute -bottom-12 right-0 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Submission Successful!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Monaco Editor */}
          <div
            className="overflow-hidden relative"
            style={{ height: `${100 - consoleHeight}%` }}
          >
            <Editor
              height="100%"
              language={language}
              theme={mounted && resolvedTheme === "dark" ? "vs-dark" : "light"}
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

          {/* Horizontal Resize Handle */}
          <div
            className="h-1 bg-border hover:bg-primary hover:h-1.5 cursor-row-resize transition-all duration-150 relative group flex-shrink-0"
            onMouseDown={() => setIsDraggingHorizontal(true)}
          >
            <div className="absolute inset-x-0 -top-1 -bottom-1 group-hover:bg-primary/10" />
          </div>

          {/* Console/Output Section */}
          <div
            className="border-t border-border flex flex-col bg-background shrink-0 overflow-hidden"
            style={{ height: `${consoleHeight}%` }}
          >
            <Tabs
              defaultValue="result"
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-muted/30 px-4 shrink-0">
                <TabsTrigger
                  value="result"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Result
                </TabsTrigger>
                <TabsTrigger
                  value="log"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Execution Log
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="result"
                className="flex-1 p-4 overflow-auto min-h-0"
              >
                {isSubmitting ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2
                      size={48}
                      className="mb-3 opacity-50 animate-spin"
                    />
                    <p className="text-sm font-medium">
                      Evaluating your submission...
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Please wait
                    </p>
                  </div>
                ) : !output || output.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Terminal size={48} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No results yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Run or Submit code to see results
                    </p>
                  </div>
                ) : (
                  (() => {
                    const parsed = parseOutput(output);
                    const getResultStyle = (status, hasError, isAccepted) => {
                      if (hasError) {
                        return {
                          bg: "bg-red-100 dark:bg-red-950/30",
                          text: "text-red-600 dark:text-red-400",
                          icon: XCircle,
                        };
                      }
                      if (isAccepted) {
                        return {
                          bg: "bg-green-100 dark:bg-green-950/30",
                          text: "text-green-600 dark:text-green-400",
                          icon: CheckCircle2,
                        };
                      }
                      if (status === "Time Limit Exceeded") {
                        return {
                          bg: "bg-yellow-100 dark:bg-yellow-950/30",
                          text: "text-yellow-600 dark:text-yellow-400",
                          icon: Clock,
                        };
                      } else {
                        return {
                          bg: "bg-red-100 dark:bg-red-950/30",
                          text: "text-red-600 dark:text-red-400",
                          icon: XCircle,
                        };
                      }
                    };
                    const style = getResultStyle(
                      parsed.statusText,
                      parsed.hasError,
                      parsed.isAccepted
                    );
                    let subText = parsed.hasError
                      ? "Check execution log for details"
                      : parsed.isAccepted
                      ? "All test cases passed"
                      : parsed.statusText === "Time Limit Exceeded"
                      ? "Execution took too long - optimize your code"
                      : parsed.statusText.includes("Error")
                      ? "Fix the errors in your code"
                      : "Some test cases failed - check log for details";

                    return (
                      <div className="space-y-4 h-full">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-full ${style.bg} flex items-center justify-center`}
                            >
                              <style.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className={`text-lg font-bold ${style.text}`}>
                                {parsed.statusText}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {subText}
                              </p>
                            </div>
                          </div>
                        </div>

                        {parsed.metrics.length > 0 && (
                          <div className="grid grid-cols-3 gap-3">
                            {parsed.metrics.map((m, i) => (
                              <div
                                key={i}
                                className="bg-gradient-to-br from-muted/50 to-muted/30 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                              >
                                <p className="text-xs text-muted-foreground mb-1 font-medium">
                                  {m.label}
                                </p>
                                <p className="text-lg font-bold text-foreground">
                                  {m.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </TabsContent>

              <TabsContent
                value="log"
                className="flex-1 p-4 overflow-auto font-mono text-sm min-h-0"
              >
                {!output || output.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Terminal size={48} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No logs yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Run or Submit to generate execution logs
                    </p>
                  </div>
                ) : (
                  (() => {
                    const parsed = parseOutput(output);
                    const logs = parsed.logData;

                    return (
                      <div className="space-y-2">
                        {logs.map((entry, index) => {
                          if (entry.type === "output") {
                            return (
                              <div key={index} className="space-y-2">
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                                  Program Output
                                </p>
                                <div className="bg-background border border-border rounded-md p-3">
                                  <pre className="text-foreground whitespace-pre-wrap text-sm">
                                    {entry.message}
                                  </pre>
                                </div>
                              </div>
                            );
                          }

                          const base =
                            "p-3 rounded-md border flex items-start gap-2.5";
                          let tone = "border-border/50 bg-muted/30";
                          let Icon = Terminal;

                          if (entry.type === "error") {
                            tone =
                              "border-red-500/30 bg-red-50/50 dark:bg-red-950/20";
                            Icon = XCircle;
                          } else if (entry.type === "success") {
                            tone =
                              "border-green-500/30 bg-green-50/50 dark:bg-green-950/20";
                            Icon = CheckCircle2;
                          } else if (entry.type === "metric") {
                            tone =
                              "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20";
                            Icon = Clock;
                          } else if (entry.type === "info") {
                            tone =
                              "border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20";
                            Icon = Terminal;
                          }

                          return (
                            <div key={index} className={`${base} ${tone}`}>
                              <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                              <span className="whitespace-pre-wrap flex-1">
                                {entry.message}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* AI Chat Panel */}
        {showAIChat && (
          <>
            {/* Resize Handle for AI Chat */}
            <div
              className="w-1 bg-border hover:bg-primary hover:w-1.5 cursor-col-resize transition-all duration-150 relative group flex-shrink-0"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = aiChatWidth;

                const handleMouseMove = (e) => {
                  const rightPanel = document.getElementById("right-panel");
                  if (rightPanel) {
                    const rect = rightPanel.getBoundingClientRect();
                    const newWidth =
                      ((rect.right - e.clientX) / rect.width) * 100;
                    setAiChatWidth(Math.min(Math.max(newWidth, 20), 50));
                  }
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                  document.body.style.cursor = "default";
                  document.body.style.userSelect = "auto";
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
                document.body.style.cursor = "col-resize";
                document.body.style.userSelect = "none";
              }}
            >
              <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10" />
            </div>

            {/* AI Chat Component */}
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{ width: `${aiChatWidth}%` }}
            >
              <AIChat
                code={code}
                language={language}
                questionTitle={question?.title}
                onClose={() => setShowAIChat(false)}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile Responsive Overlay */}
      <div className="lg:hidden absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <Card className="p-6 max-w-md text-center">
          <Terminal className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Desktop Required</h3>
          <p className="text-muted-foreground text-sm">
            This code editor works best on larger screens. Please use a desktop
            or tablet device for the optimal experience.
          </p>
        </Card>
      </div>
    </div>
  );
}

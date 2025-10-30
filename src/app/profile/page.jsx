"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import {
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Copy,
  TrendingUp,
  Award,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Search,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { copyToClipboard } from "@/components/copyToClipboard"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Helper function to format date
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A"
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return "N/A"
  
  const day = String(date.getDate()).padStart(2, '0')
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

// Helper function to calculate stats
const calculateStats = (submissions) => {
  const total = submissions.length
  const accepted = submissions.filter(s => 
    s.verdict === "Accepted" || s.verdict === "AC" || s.verdict === "ACCEPTED"
  ).length
  const rate = total > 0 ? Math.round((accepted / total) * 100) : 0
  
  return { total, accepted, rate }
}

// Helper function to get last 7 days progress - ONLY ACCEPTED SOLUTIONS
const getLast7DaysProgress = (submissions) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    last7Days.push({
      date: date,
      dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      solved: 0
    })
  }
  
  submissions.forEach(sub => {
    const subDate = new Date(sub.timestamp)
    if (isNaN(subDate.getTime())) return
    
    subDate.setHours(0, 0, 0, 0)
    
    const dayData = last7Days.find(d => d.date.getTime() === subDate.getTime())
    // Only count accepted solutions
    if (dayData && (sub.verdict === "Accepted" || sub.verdict === "AC" || sub.verdict === "ACCEPTED")) {
      dayData.solved++
    }
  })
  
  return last7Days.map(d => ({ date: d.dateStr, solved: d.solved }))
}

// Helper function to get topic distribution from accepted submissions
const getTopicDistribution = (submissions) => {
  const topicCounts = {}
  
  submissions.forEach(sub => {
    // Only count accepted submissions
    if (sub.verdict === "Accepted" || sub.verdict === "AC" || sub.verdict === "ACCEPTED") {
      if (Array.isArray(sub.topics) && sub.topics.length > 0) {
        sub.topics.forEach(topic => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1
        })
      }
    }
  })
  
  // Convert to array and sort by count
  const topicArray = Object.entries(topicCounts).map(([topic, count]) => ({
    topic,
    solved: count
  }))
  
  topicArray.sort((a, b) => b.solved - a.solved)
  
  // Assign colors
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))"
  ]
  
  return topicArray.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length]
  }))
}

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [activeNav, setActiveNav] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSubmission, setExpandedSubmission] = useState(null)
  const [expandedCode, setExpandedCode] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  }

  const API_BASE = "http://localhost:5000"

  const fetchJson = async (url, token) => {
    const res = await fetch(url, {
      method: "GET",
      headers: token
        ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
        : { Accept: "application/json" },
      credentials: "include",
    })
    if (!res.ok) {
      let message = res.statusText
      try {
        message = await res.text()
      } catch {}
      throw new Error(message || "Failed to fetch")
    }
    return res.json()
  }

  const toSubmission = (s, idx) => ({
    id: s?.id ?? idx,
    title: s?.title ?? s?.problemTitle ?? "Untitled",
    verdict: s?.verdict ?? s?.status ?? "Unknown",
    runtime: s?.runtime ?? s?.execTime ?? "N/A",
    memory: s?.memory ?? s?.mem ?? "N/A",
    language: s?.language ?? s?.lang ?? "Unknown",
    topics: Array.isArray(s?.topics) ? s.topics : [],
    timestamp: s?.timestamp ?? s?.createdAt ?? s?.created_at ?? "",
    code: s?.code ?? s?.source ?? "",
  })

  const toCodeSnippet = (c, idx) => ({
    id: c?.id ?? idx,
    title: c?.title ?? c?.name ?? "Untitled",
    language: c?.language ?? c?.lang ?? "Unknown",
    lastModified: c?.updatedAt ?? c?.updated_at ?? c?.createdAt ?? c?.created_at ?? "",
    code: c?.code ?? c?.content ?? "",
  })

  const {
    data: submissionsRaw,
    error: submissionsError,
    isLoading: submissionsLoading,
  } = useSWR(user ? [`${API_BASE}/submission/all`, accessToken] : null, ([url, token]) => fetchJson(url, token), {
    revalidateOnFocus: false,
  })
  const {
    data: codesRaw,
    error: codesError,
    isLoading: codesLoading,
  } = useSWR(user ? [`${API_BASE}/code/saved`, accessToken] : null, ([url, token]) => fetchJson(url, token), {
    revalidateOnFocus: false,
  })
  
  const submissionsList = (() => {
    let list = []
    if (Array.isArray(submissionsRaw)) {
      list = submissionsRaw.map(toSubmission)
    } else if (submissionsRaw && Array.isArray(submissionsRaw.submissions)) {
      const subs = submissionsRaw.submissions
      const questions = Array.isArray(submissionsRaw.questions) ? submissionsRaw.questions : []
      const qMap = new Map()
      for (const q of questions) {
        if (q && q._id) qMap.set(q._id, q)
      }
      list = subs.map((s, idx) => {
        const qId = s?.questionID?.questionUUID
        const qTitle = (qId && qMap.get(qId)?.title) || "Unknown Question"
        const qTopics = (qId && qMap.get(qId)?.topics) || []
        return {
          id: s?.id ?? idx,
          title: qTitle,
          verdict: s?.verdict ?? "Unknown",
          runtime: typeof s?.timeUsed === "number" ? `${s.timeUsed} ms` : "N/A",
          memory: typeof s?.memoryUsed === "number" ? `${s.memoryUsed} KB` : "N/A",
          language: s?.langId ?? "Unknown",
          topics: Array.isArray(qTopics) ? qTopics : [],
          timestamp: s?.createdAt ?? "",
          code: s?.code ?? "",
        }
      })
    }
    
    list.sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)
      if (isNaN(dateA.getTime())) return 1
      if (isNaN(dateB.getTime())) return -1
      return dateB - dateA
    })
    
    return list
  })()

  const savedCodesList = (() => {
    let raw;
    if(codesRaw){
      raw = codesRaw.allCodes
    }
    const arr = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.codes)
        ? raw.codes
        : Array.isArray(raw?.data)
          ? raw.data
          : []
    const list = arr.map(toCodeSnippet)
    
    list.sort((a, b) => {
      const dateA = new Date(a.lastModified)
      const dateB = new Date(b.lastModified)
      if (isNaN(dateA.getTime())) return 1
      if (isNaN(dateB.getTime())) return -1
      return dateB - dateA
    })
    
    return list
  })()

  const { data, error } = useSWR("user", fetchUser)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setAccessToken(data.session?.access_token ?? null)
    }
    getSession()
  }, [supabase])

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "User"
  const userEmail = user?.email || "user@example.com"
  const userInitial = userName?.charAt(0).toUpperCase() || "U"

  const stats = calculateStats(submissionsList)
  const dailyProgress = getLast7DaysProgress(submissionsList)
  const topicProgress = getTopicDistribution(submissionsList)
  
  const statsData = [
    { label: "Total Submissions", value: stats.total, icon: Code2, color: "text-blue-600" },
    { label: "Accepted Questions", value: stats.accepted, icon: CheckCircle2, color: "text-green-600" },
    { label: "Acceptance Rate", value: `${stats.rate}%`, icon: Target, color: "text-orange-600" },
  ]

  const filteredSubmissions = submissionsList.filter(
    (sub) =>
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const copyCode = (code) => {
    copyToClipboard(code)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-muted/20 backdrop-blur-md flex flex-col">
          <nav className="flex-1 p-4 space-y-2 lg:block grid grid-cols-2 sm:grid-cols-3 gap-2 lg:space-y-2">
            <Button
              variant={activeNav === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("overview")}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </Button>
            <Button
              variant={activeNav === "history" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("history")}
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Practice History</span>
            </Button>
            <Button
              variant={activeNav === "progress" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("progress")}
            >
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </Button>
            <Button
              variant={activeNav === "saved" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("saved")}
            >
              <Code2 className="h-4 w-4" />
              <span className="hidden sm:inline">Saved Codes</span>
            </Button>
            <Button
              variant={activeNav === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("settings")}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </nav>

          <div className="p-4 border-t border-border space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/50">
                <AvatarFallback className="text-primary font-bold text-lg">{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            {user ? (
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="sm"
                className="w-full gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => router.push("/login")} variant="default" size="sm" className="w-full gap-2">
                Sign In
              </Button>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
            <Tabs value={activeNav} onValueChange={setActiveNav} className="space-y-6">
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-2">Welcome back, {userName.split(" ")[0]} 👋</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">Here's your coding journey at a glance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statsData.map((stat, index) => (
                    <Card key={index} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                          <div className="text-2xl sm:text-3xl font-bold sm:mr-5">{stat.value}</div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your last 7 days of accepted solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-primary">
                      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                        <LineChart data={dailyProgress}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="date" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line type="monotone" dataKey="solved" strokeWidth={2} dot={{ fill: "currentColor" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Practice History</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Review your past submissions and solutions</p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by problem name, language, or topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {submissionsLoading && <p className="text-sm text-muted-foreground">Loading submissions...</p>}
                {submissionsError && <p className="text-sm text-destructive">Failed to load submissions</p>}

                <div className="space-y-4">
                  {filteredSubmissions.length === 0 && !submissionsLoading && !submissionsError ? (
                    <Card className="border-border/50">
                      <CardContent className="py-10 text-center text-muted-foreground">
                        No submissions found.
                      </CardContent>
                    </Card>
                  ) : null}

                  {filteredSubmissions.map((submission) => (
                    <Card key={submission.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <Collapsible
                        open={expandedSubmission === submission.id}
                        onOpenChange={() =>
                          setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)
                        }
                      >
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                            <div className="flex-1 w-full">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <CardTitle className="text-base sm:text-lg break-words">{submission.title}</CardTitle>
                                <Badge
                                  variant={submission.verdict === "Accepted" || submission.verdict === "AC" || submission.verdict === "ACCEPTED" ? "default" : "destructive"}
                                  className="gap-1 w-fit"
                                >
                                  {submission.verdict === "Accepted" || submission.verdict === "AC" || submission.verdict === "ACCEPTED" ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <XCircle className="h-3 w-3" />
                                  )}
                                  {submission.verdict}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(submission.timestamp)}
                                </span>
                                <span>•</span>
                                <span>{submission.language}</span>
                                {submission.runtime !== "N/A" && (
                                  <>
                                    <span>•</span>
                                    <span>{submission.runtime}</span>
                                    <span>•</span>
                                    <span>{submission.memory}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {submission.topics.map((topic, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="ml-2">
                                {expandedSubmission === submission.id ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </CardHeader>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="bg-muted/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Submitted Code</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyCode(submission.code)}
                                  className="gap-2"
                                >
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </Button>
                              </div>
                              <pre className="text-xs font-mono overflow-x-auto bg-background p-4 rounded border border-border">
                                {submission.code}
                              </pre>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Progress Analytics</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Track your improvement over time</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle>Accepted Solutions per Day</CardTitle>
                      <CardDescription>Last 7 days activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-[hsl(var(--chart-1))]">
                        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                          <LineChart data={dailyProgress}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Line type="monotone" dataKey="solved" strokeWidth={2} dot={{ fill: "currentColor" }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle>Questions by Topic</CardTitle>
                      <CardDescription>Distribution of accepted submissions across topics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topicProgress.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                          <BarChart data={topicProgress}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="topic" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="solved" radius={[8, 8, 0, 0]}>
                              {topicProgress.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          No topic data available yet
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Topic Distribution</CardTitle>
                    <CardDescription>Pie chart view of your accepted submissions by topic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topicProgress.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                        <PieChart>
                          <Pie
                            data={topicProgress}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ topic, solved }) => `${topic}: ${solved}`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="solved"
                          >
                            {topicProgress.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        No topic data available yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved" className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Saved Code Snippets</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Your personal code template library</p>
                </div>

                {codesLoading && <p className="text-sm text-muted-foreground">Loading saved codes...</p>}
                {codesError && <p className="text-sm text-destructive">Failed to load saved codes</p>}

                <div className="space-y-4">
                  {savedCodesList.length === 0 && !codesLoading && !codesError ? (
                    <Card className="border-border/50">
                      <CardContent className="py-10 text-center text-muted-foreground">No saved codes yet.</CardContent>
                    </Card>
                  ) : null}

                  {savedCodesList.map((codeSnippet) => (
                    <Card key={codeSnippet.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <Collapsible
                        open={expandedCode === codeSnippet.id}
                        onOpenChange={() => setExpandedCode(expandedCode === codeSnippet.id ? null : codeSnippet.id)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-lg">{codeSnippet.title}</CardTitle>
                                <Badge variant="secondary">{codeSnippet.language}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Last modified: {formatDate(codeSnippet.lastModified)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyCode(codeSnippet.code)}
                                className="gap-2"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>

                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  {expandedCode === codeSnippet.id ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>
                        </CardHeader>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="bg-muted/50 rounded-lg p-4 border border-border">
                              <pre className="text-xs font-mono overflow-x-auto bg-background p-4 rounded border border-border">
                                {codeSnippet.code}
                              </pre>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Settings</h2>
                  <p className="text-muted-foreground">Manage your profile and preferences</p>
                </div>

                <Card className="border-border/50 shadow-lg">
                  <CardContent className="flex items-center justify-center py-24">
                    <div className="text-center space-y-2">
                      <User className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="text-muted-foreground">Profile and theme settings coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

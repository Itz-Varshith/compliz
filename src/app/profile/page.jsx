"use client"

import { useState, useEffect } from "react"
// import { Header } from "@/components/ui/header"
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
  Trash2,
  TrendingUp,
  Award,
  Target,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Search,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
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

// Dummy data
const dummyUser = {
  name: "Harshith",
  email: "harshith@compliz.dev",
  initial: "H",
}

const statsData = [
  { label: "Total Submissions", value: 127, icon: Code2, color: "text-blue-600" },
  { label: "Accepted Questions", value: 89, icon: CheckCircle2, color: "text-green-600" },
  { label: "Acceptance Rate", value: "70%", icon: Target, color: "text-orange-600" },
]

const submissionsData = [
  {
    id: 1,
    title: "Two Sum",
    verdict: "Accepted",
    runtime: "45 ms",
    memory: "12.4 MB",
    language: "C++",
    topics: ["Arrays", "HashMap"],
    timestamp: "2025-09-20 14:32:00",
    code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    verdict: "Wrong Answer",
    runtime: "N/A",
    memory: "N/A",
    language: "Python",
    topics: ["Strings", "Sliding Window"],
    timestamp: "2025-09-19 10:10:00",
    code: `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
  },
  {
    id: 3,
    title: "Binary Search",
    verdict: "Accepted",
    runtime: "32 ms",
    memory: "8.2 MB",
    language: "C++",
    topics: ["Binary Search", "Arrays"],
    timestamp: "2025-09-18 16:45:00",
    code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
]

const dailyProgress = [
  { date: "Sep 20", solved: 3 },
  { date: "Sep 21", solved: 5 },
  { date: "Sep 22", solved: 2 },
  { date: "Sep 23", solved: 4 },
  { date: "Sep 24", solved: 6 },
  { date: "Sep 25", solved: 3 },
  { date: "Sep 26", solved: 7 },
]

const topicProgress = [
  { topic: "Arrays", solved: 25, fill: "hsl(var(--chart-1))" },
  { topic: "DP", solved: 12, fill: "hsl(var(--chart-2))" },
  { topic: "Graphs", solved: 18, fill: "hsl(var(--chart-3))" },
  { topic: "Strings", solved: 15, fill: "hsl(var(--chart-4))" },
  { topic: "Trees", solved: 19, fill: "hsl(var(--chart-5))" },
]

const savedCodesData = [
  {
    id: 1,
    title: "Binary Search Template",
    language: "C++",
    lastModified: "2025-09-29 19:15",
    code: `// Binary Search Template
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    id: 2,
    title: "DFS Template",
    language: "Python",
    lastModified: "2025-09-27 12:40",
    code: `# DFS Template
def dfs(node, visited, graph):
    if node in visited:
        return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(neighbor, visited, graph)`,
  },
  {
    id: 3,
    title: "Sliding Window Template",
    language: "C++",
    lastModified: "2025-09-25 08:30",
    code: `// Sliding Window Template
int slidingWindow(vector<int>& arr, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
  },
]

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [activeNav, setActiveNav] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSubmission, setExpandedSubmission] = useState(null)
  const [expandedCode, setExpandedCode] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  const userName = user?.user_metadata?.full_name || user?.email || dummyUser.name
  const userEmail = user?.email || dummyUser.email
  const userInitial = userName?.charAt(0).toUpperCase() || dummyUser.initial

  const filteredSubmissions = submissionsData.filter(
    (sub) =>
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
      {/* <Header /> */}

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-border bg-muted/20 backdrop-blur-md flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant={activeNav === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("overview")}
            >
              <TrendingUp className="h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeNav === "history" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("history")}
            >
              <Clock className="h-4 w-4" />
              Practice History
            </Button>
            <Button
              variant={activeNav === "progress" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("progress")}
            >
              <Award className="h-4 w-4" />
              Progress
            </Button>
            <Button
              variant={activeNav === "saved" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("saved")}
            >
              <Code2 className="h-4 w-4" />
              Saved Codes
            </Button>
            <Button
              variant={activeNav === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveNav("settings")}
            >
              <User className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          {/* User Info at Bottom */}
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
              <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full gap-2 bg-transparent">
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            <Tabs value={activeNav} onValueChange={setActiveNav} className="space-y-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-balance mb-2">Welcome back, {userName.split(" ")[0]} 👋</h1>
                  <p className="text-muted-foreground">Here's your coding journey at a glance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                  {statsData.map((stat, index) => (
                    <Card key={index} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className={`h-8 w-8 ${stat.color}`} />
                          <div className="text-3xl font-bold mr-5">{stat.value}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                    <CardDescription>Your last 7 days of problem solving</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <div className="text-primary">
                    <ResponsiveContainer width="100%" height={300}>
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
                        <Line
                          type="monotone"
                          dataKey="solved"
                          strokeWidth={2}
                          dot={{ fill: "currentColor" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                </Card>
              </TabsContent>

              {/* Practice History Tab */}
              <TabsContent value="history" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Practice History</h2>
                  <p className="text-muted-foreground">Review your past submissions and solutions</p>
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

                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <Card key={submission.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <Collapsible
                        open={expandedSubmission === submission.id}
                        onOpenChange={() =>
                          setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)
                        }
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-lg">{submission.title}</CardTitle>
                                <Badge
                                  variant={submission.verdict === "Accepted" ? "default" : "destructive"}
                                  className="gap-1"
                                >
                                  {submission.verdict === "Accepted" ? (
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
                                  {submission.timestamp}
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

              {/* Progress Tab */}
              <TabsContent value="progress" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Progress Analytics</h2>
                  <p className="text-muted-foreground">Track your improvement over time</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle>Questions Solved per Day</CardTitle>
                      <CardDescription>Last 7 days activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="text-[hsl(var(--chart-1))]">
                      <ResponsiveContainer width="100%" height={300}>
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
                          <Line
                            type="monotone"
                            dataKey="solved"
                            strokeWidth={2}
                            dot={{ fill: "currentColor" }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle>Questions by Topic</CardTitle>
                      <CardDescription>Distribution across different topics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
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
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Topic Distribution</CardTitle>
                    <CardDescription>Pie chart view of your problem-solving focus</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Saved Codes Tab */}
              <TabsContent value="saved" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Saved Code Snippets</h2>
                  <p className="text-muted-foreground">Your personal code template library</p>
                </div>

                <div className="space-y-4">
                  {savedCodesData.map((codeSnippet) => (
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
                              <p className="text-sm text-muted-foreground">Last modified: {codeSnippet.lastModified}</p>
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
"use client"
import { useState } from "react"
import { Search, Filter, Code2, Tag, ChevronDown } from "lucide-react"
import Link from "next/link"
// Dummy API response data
const apiResponse = {
  success: true,
  message: "Questions fetched successfully",
  questions: [
    {
      title: "Depth of a Tree",
      topics: ["DFS"],
      questionNumber: 1,
    },
    {
      title: "Least Common Ancestor between 2 Nodes",
      topics: ["BFS", "DFS"],
      questionNumber: 2,
    },
    {
      title: "Two Sum Problem",
      topics: ["Array", "Hash Tables"],
      questionNumber: 3,
    },
    {
      title: "Reverse Linked List",
      topics: ["Linked List", "Recursion"],
      questionNumber: 4,
    },
    {
      title: "Valid Parentheses",
      topics: ["Stack", "String"],
      questionNumber: 5,
    },
    {
      title: "Binary Tree Traversal",
      topics: ["Tree", "DFS", "BFS"],
      questionNumber: 6,
    },
    {
      title: "Merge Sort Implementation",
      topics: ["Sorting", "Divide and Conquer"],
      questionNumber: 7,
    },
    {
      title: "Longest Substring Without Repeating",
      topics: ["String", "Sliding Window"],
      questionNumber: 8,
    },
  ],
}

function App() {
  const [questions] = useState(apiResponse.questions)
  const [filteredQuestions, setFilteredQuestions] = useState(apiResponse.questions)
  const [selectedTopic, setSelectedTopic] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Get all unique topics
  const allTopics = ["All", ...new Set(questions.flatMap((q) => q.topics))]

  // Filter questions based on topic and search
  const handleTopicFilter = (topic) => {
    setSelectedTopic(topic)
    filterQuestions(topic, searchQuery)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    filterQuestions(selectedTopic, query)
  }

  const filterQuestions = (topic, query) => {
    let filtered = questions

    // Filter by topic
    if (topic !== "All") {
      filtered = filtered.filter((q) => q.topics.includes(topic))
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(query.toLowerCase()) ||
          q.topics.some((t) => t.toLowerCase().includes(query.toLowerCase())),
      )
    }

    setFilteredQuestions(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Practice Problems</h2>
          <p className="text-gray-600">Solve Problems with our inbuilt code editor</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title or topic..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Topic</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-600" />
                    <span className="text-gray-800 font-medium">
                      {selectedTopic === "All" ? "All Topics" : selectedTopic}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {allTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          handleTopicFilter(topic)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center justify-between ${
                          selectedTopic === topic ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700"
                        }`}
                      >
                        <span>{topic}</span>
                        {selectedTopic === topic && <span className="text-orange-600">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredQuestions.length}</span>{" "}
          {filteredQuestions.length === 1 ? "question" : "questions"}
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Code2 size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No questions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.questionNumber}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        #{question.questionNumber}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition">
                        {question.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {question.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300"
                        >
                          <Tag size={14} />
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/solve/${question.questionNumber}`}
                    className="ml-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                  >
                    Solve
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QuestionSubmissionPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [examples, setExamples] = useState([{ input: "", output: "", explanation: "" }])
  const [invisibleTestCases, setInvisibleTestCases] = useState([{ input: "", output: "" }])
  const [hints, setHints] = useState([""])
  const [topics, setTopics] = useState([""])
  const [constraints, setConstraints] = useState([""])
  const [timeLimit, setTimeLimit] = useState(1)
  const [memoryLimit, setMemoryLimit] = useState(256)

  // Dynamic field handlers
  const addExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }])
  }

  const removeExample = (index) => {
    if (examples.length > 1) {
      setExamples(examples.filter((_, i) => i !== index))
    }
  }

  const updateExample = (index, field, value) => {
    const updated = [...examples]
    updated[index][field] = value
    setExamples(updated)
  }

  const addInvisibleTestCase = () => {
    setInvisibleTestCases([...invisibleTestCases, { input: "", output: "" }])
  }

  const removeInvisibleTestCase = (index) => {
    if (invisibleTestCases.length > 1) {
      setInvisibleTestCases(invisibleTestCases.filter((_, i) => i !== index))
    }
  }

  const updateInvisibleTestCase = (index, field, value) => {
    const updated = [...invisibleTestCases]
    updated[index][field] = value
    setInvisibleTestCases(updated)
  }

  const addHint = () => setHints([...hints, ""])
  const removeHint = (index) => {
    if (hints.length > 1) setHints(hints.filter((_, i) => i !== index))
  }
  const updateHint = (index, value) => {
    const updated = [...hints]
    updated[index] = value
    setHints(updated)
  }

  const addTopic = () => setTopics([...topics, ""])
  const removeTopic = (index) => {
    if (topics.length > 1) setTopics(topics.filter((_, i) => i !== index))
  }
  const updateTopic = (index, value) => {
    const updated = [...topics]
    updated[index] = value
    setTopics(updated)
  }

  const addConstraint = () => setConstraints([...constraints, ""])
  const removeConstraint = (index) => {
    if (constraints.length > 1) setConstraints(constraints.filter((_, i) => i !== index))
  }
  const updateConstraint = (index, value) => {
    const updated = [...constraints]
    updated[index] = value
    setConstraints(updated)
  }

  // Validation
  const validateForm = () => {
    if (!title.trim()) {
      toast({ title: "Validation Error", description: "Title is required", variant: "destructive" })
      return false
    }
    if (!description.trim()) {
      toast({ title: "Validation Error", description: "Description is required", variant: "destructive" })
      return false
    }
    const validExamples = examples.filter((ex) => ex.input.trim() && ex.output.trim() && ex.explanation.trim())
    if (validExamples.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one complete example is required",
        variant: "destructive",
      })
      return false
    }
    if (timeLimit <= 0) {
      toast({ title: "Validation Error", description: "Time limit must be greater than 0", variant: "destructive" })
      return false
    }
    if (memoryLimit <= 0) {
      toast({ title: "Validation Error", description: "Memory limit must be greater than 0", variant: "destructive" })
      return false
    }
    return true
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    const validExamples = examples.filter((ex) => ex.input.trim() && ex.output.trim() && ex.explanation.trim())
    const validInvisibleTestCases = invisibleTestCases.filter((tc) => tc.input.trim() && tc.output.trim())
    const validHints = hints.filter((h) => h.trim())
    const validTopics = topics.filter((t) => t.trim())
    const validConstraints = constraints.filter((c) => c.trim())

    const payload = {
      title: title.trim(),
      description: description.trim(),
      examples: validExamples,
      invisibleTestCases: validInvisibleTestCases,
      hints: validHints,
      topics: validTopics,
      constraints: validConstraints,
      timeLimit: Number.parseInt(String(timeLimit)),
      memoryLimit: Number.parseInt(String(memoryLimit)),
      testCases:invisibleTestCases
    }

    try {
      const response = await fetch("http://localhost:5000/question/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit question")
      }

      toast({ title: "Success", description: "Question submitted successfully!" })

      // Reset form
      setTitle("")
      setDescription("")
      setExamples([{ input: "", output: "", explanation: "" }])
      setInvisibleTestCases([{ input: "", output: "" }])
      setHints([""])
      setTopics([""])
      setConstraints([""])
      setTimeLimit(1)
      setMemoryLimit(256)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit question",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-8 pb-12">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-3xl font-bold text-balance">Submit Programming Question</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill out the form below to submit a new programming question
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-foreground">
                  Title <span className="text-primary">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Two Sum Problem"
                  className="text-base bg-input border-border focus:border-primary focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold text-foreground">
                  Description <span className="text-primary">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of the problem..."
                  rows={6}
                  className="text-base resize-none bg-input border-border focus:border-primary focus:ring-primary/20"
                />
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">
                    Examples <span className="text-primary">*</span>
                  </Label>
                  <Button
                    type="button"
                    onClick={addExample}
                    size="sm"
                    variant="outline"
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Example
                  </Button>
                </div>
                {examples.map((example, index) => (
                  <Card key={index} className="border-border/50 bg-card/50">
                    <CardContent className=" space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary">Example {index + 1}</span>
                        {examples.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeExample(index)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`example-input-${index}`} className="text-sm text-foreground">
                          Input
                        </Label>
                        <Textarea
                          id={`example-input-${index}`}
                          value={example.input}
                          onChange={(e) => updateExample(index, "input", e.target.value)}
                          placeholder="Input for this example"
                          rows={2}
                          className="font-mono text-sm resize-none bg-input border-border focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`example-output-${index}`} className="text-sm text-foreground">
                          Output
                        </Label>
                        <Textarea
                          id={`example-output-${index}`}
                          value={example.output}
                          onChange={(e) => updateExample(index, "output", e.target.value)}
                          placeholder="Expected output"
                          rows={2}
                          className="font-mono text-sm resize-none bg-input border-border focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`example-explanation-${index}`} className="text-sm text-foreground">
                          Explanation
                        </Label>
                        <Textarea
                          id={`example-explanation-${index}`}
                          value={example.explanation}
                          onChange={(e) => updateExample(index, "explanation", e.target.value)}
                          placeholder="Explain this example"
                          rows={2}
                          className="text-sm resize-none bg-input border-border focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold text-foreground">Invisible Test Cases</Label>
                    <p className="text-sm text-muted-foreground">
                      Hidden test cases for validation (not visible to users)
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={addInvisibleTestCase}
                    size="sm"
                    variant="outline"
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Test Case
                  </Button>
                </div>
                {invisibleTestCases.map((testCase, index) => (
                  <Card key={index} className="border-border/50 bg-card/50">
                    <CardContent className=" space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary">Test Case {index + 1}</span>
                        {invisibleTestCases.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeInvisibleTestCase(index)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`testcase-input-${index}`} className="text-sm text-foreground">
                          Input
                        </Label>
                        <Textarea
                          id={`testcase-input-${index}`}
                          value={testCase.input}
                          onChange={(e) => updateInvisibleTestCase(index, "input", e.target.value)}
                          placeholder="Input for this test case"
                          rows={2}
                          className="font-mono text-sm resize-none bg-input border-border focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`testcase-output-${index}`} className="text-sm text-foreground">
                          Expected Output
                        </Label>
                        <Textarea
                          id={`testcase-output-${index}`}
                          value={testCase.output}
                          onChange={(e) => updateInvisibleTestCase(index, "output", e.target.value)}
                          placeholder="Expected output for this test case"
                          rows={2}
                          className="font-mono text-sm resize-none bg-input border-border focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hints */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">Hints</Label>
                  <Button
                    type="button"
                    onClick={addHint}
                    size="sm"
                    variant="outline"
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Hint
                  </Button>
                </div>
                {hints.map((hint, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      placeholder={`Hint ${index + 1}`}
                      className="flex-1 bg-input border-border focus:border-primary focus:ring-primary/20"
                    />
                    {hints.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeHint(index)}
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Topics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">Topics</Label>
                  <Button
                    type="button"
                    onClick={addTopic}
                    size="sm"
                    variant="outline"
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Topic
                  </Button>
                </div>
                {topics.map((topic, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={topic}
                      onChange={(e) => updateTopic(index, e.target.value)}
                      placeholder={"e.g., Arrays"}
                      className="flex-1 bg-input border-border focus:border-primary focus:ring-primary/20"
                    />
                    {topics.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTopic(index)}
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">Constraints</Label>
                  <Button
                    type="button"
                    onClick={addConstraint}
                    size="sm"
                    variant="outline"
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Constraint
                  </Button>
                </div>
                {constraints.map((constraint, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={constraint}
                      onChange={(e) => updateConstraint(index, e.target.value)}
                      placeholder={`e.g., 1 <= n <= 10^5`}
                      className="flex-1 font-mono bg-input border-border focus:border-primary focus:ring-primary/20"
                    />
                    {constraints.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeConstraint(index)}
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Time and Memory Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-base font-semibold text-foreground">
                    Time Limit (seconds) <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number.parseInt(e.target.value) || 1)}
                    className="text-base bg-input border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memoryLimit" className="text-base font-semibold text-foreground">
                    Memory Limit (MB) <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="memoryLimit"
                    type="number"
                    min="1"
                    value={memoryLimit}
                    onChange={(e) => setMemoryLimit(Number.parseInt(e.target.value) || 1)}
                    className="text-base bg-input border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Submit Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

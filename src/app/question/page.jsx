"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export default function QuestionSubmissionPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [example, setExample] = useState({ input: "", output: "" });
  const [invisibleTestCase, setInvisibleTestCase] = useState({
    input: "",
    output: "",
  });
  const [hints, setHints] = useState([""]);
  const [topics, setTopics] = useState([""]);
  const [constraints, setConstraints] = useState([""]);
  const [timeLimit, setTimeLimit] = useState(1);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [solutionCode, setSolutionCode] = useState("");
  const [boilerPlateCodes, setBoilerPlateCodes] = useState([
    { language: "", code: "" },
  ]);

  const addHint = () => setHints([...hints, ""]);
  const removeHint = (index) => {
    if (hints.length > 1) setHints(hints.filter((_, i) => i !== index));
  };
  const updateHint = (index, value) => {
    const updated = [...hints];
    updated[index] = value;
    setHints(updated);
  };

  const addTopic = () => setTopics([...topics, ""]);
  const removeTopic = (index) => {
    if (topics.length > 1) setTopics(topics.filter((_, i) => i !== index));
  };
  const updateTopic = (index, value) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const addConstraint = () => setConstraints([...constraints, ""]);
  const removeConstraint = (index) => {
    if (constraints.length > 1)
      setConstraints(constraints.filter((_, i) => i !== index));
  };
  const updateConstraint = (index, value) => {
    const updated = [...constraints];
    updated[index] = value;
    setConstraints(updated);
  };

  const addBoilerPlate = () =>
    setBoilerPlateCodes([...boilerPlateCodes, { language: "", code: "" }]);
  const removeBoilerPlate = (index) => {
    if (boilerPlateCodes.length > 1)
      setBoilerPlateCodes(boilerPlateCodes.filter((_, i) => i !== index));
  };
  const updateBoilerPlateLanguage = (index, value) => {
    const updated = [...boilerPlateCodes];
    updated[index] = { ...updated[index], language: value };
    setBoilerPlateCodes(updated);
  };
  const updateBoilerPlateCode = (index, value) => {
    const updated = [...boilerPlateCodes];
    updated[index] = { ...updated[index], code: value };
    setBoilerPlateCodes(updated);
  };

  // Validation
  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return false;
    }
    if (!example.input.trim() || !example.output.trim()) {
      toast({
        title: "Validation Error",
        description: "Example input and output are required",
        variant: "destructive",
      });
      return false;
    }
    if (timeLimit <= 0) {
      toast({
        title: "Validation Error",
        description: "Time limit must be greater than 0",
        variant: "destructive",
      });
      return false;
    }
    if (memoryLimit <= 0) {
      toast({
        title: "Validation Error",
        description: "Memory limit must be greater than 0",
        variant: "destructive",
      });
      return false;
    }
    if (!solutionCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Solution code is required",
        variant: "destructive",
      });
      return false;
    }

    // Validate boilerplate codes
    const validBoilerPlates = boilerPlateCodes.filter(
      (bp) => bp.language.trim() && bp.code.trim()
    );
    if (validBoilerPlates.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one boilerplate code is required",
        variant: "destructive",
      });
      return false;
    }

    // Check for duplicate languages
    const languages = validBoilerPlates.map((bp) =>
      bp.language.trim().toLowerCase()
    );
    const uniqueLanguages = [...new Set(languages)];
    if (languages.length !== uniqueLanguages.length) {
      toast({
        title: "Validation Error",
        description: "Duplicate programming languages are not allowed",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const validHints = hints.filter((h) => h.trim());
    const validTopics = topics.filter((t) => t.trim());
    const validConstraints = constraints.filter((c) => c.trim());
    const validBoilerPlates = boilerPlateCodes.filter(
      (bp) => bp.language.trim() && bp.code.trim()
    );

    const payload = {
      title: title.trim(),
      description: description.trim(),
      examples: {
        input: example.input.trim(),
        output: example.output.trim(),
      },
      testCases: {
        input: invisibleTestCase.input.trim(),
        output: invisibleTestCase.output.trim(),
      },
      hints: validHints,
      topics: validTopics,
      constraints: validConstraints,
      timeLimit: Number.parseInt(String(timeLimit)),
      memoryLimit: Number.parseInt(String(memoryLimit)),
      solutionCode: solutionCode.trim(),
      boilerPlateCodes: validBoilerPlates,
    };

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      console.log(token);
      const response = await fetch("http://localhost:5000/question/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit question");
      }

      toast({
        title: "Success",
        description: "Question submitted successfully!",
      });

      setTitle("");
      setDescription("");
      setExample({ input: "", output: "" });
      setInvisibleTestCase({ input: "", output: "" });
      setHints([""]);
      setTopics([""]);
      setConstraints([""]);
      setTimeLimit(1);
      setMemoryLimit(256);
      setSolutionCode("");
      setBoilerPlateCodes([{ language: "", code: "" }]);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-4 pt-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-balance mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Submit Programming Question
          </h1>
          <p className="text-muted-foreground text-lg">
            Create a new coding challenge for the community
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Problem Details */}
            <div className="space-y-6">
              {/* Title */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-8 w-1 bg-primary rounded-full" />
                    Title
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Two Sum Problem"
                    className="text-base bg-background border-border focus:border-primary focus:ring-primary/20"
                    required
                  />
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-8 w-1 bg-primary rounded-full" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of the problem..."
                    rows={8}
                    className="text-base resize-y bg-background border-border focus:border-primary focus:ring-primary/20 max-h-[400px] overflow-y-auto"
                    required
                  />
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-8 w-1 bg-primary rounded-full" />
                    Example
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Card className="border-primary/20 bg-muted/30">
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="example-input"
                          className="text-sm font-medium"
                        >
                          Input
                        </Label>
                        <Textarea
                          id="example-input"
                          value={example.input}
                          onChange={(e) =>
                            setExample({ ...example, input: e.target.value })
                          }
                          placeholder="Input for this example"
                          rows={2}
                          className="font-mono text-sm resize-y bg-background border-border focus:border-primary focus:ring-primary/20 max-h-[200px] overflow-y-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="example-output"
                          className="text-sm font-medium"
                        >
                          Output
                        </Label>
                        <Textarea
                          id="example-output"
                          value={example.output}
                          onChange={(e) =>
                            setExample({ ...example, output: e.target.value })
                          }
                          placeholder="Expected output"
                          rows={2}
                          className="font-mono text-sm resize-y bg-background border-border focus:border-primary focus:ring-primary/20 max-h-[200px] overflow-y-auto"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Time and Memory Limits */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-8 w-1 bg-primary rounded-full" />
                    Execution Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit" className="text-sm font-medium">
                      Time Limit (seconds)
                    </Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="1"
                      value={timeLimit}
                      onChange={(e) =>
                        setTimeLimit(Number.parseInt(e.target.value) || 1)
                      }
                      className="text-base bg-background border-border focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="memoryLimit"
                      className="text-sm font-medium"
                    >
                      Memory Limit (MB)
                    </Label>
                    <Input
                      id="memoryLimit"
                      type="number"
                      min="1"
                      value={memoryLimit}
                      onChange={(e) =>
                        setMemoryLimit(Number.parseInt(e.target.value) || 1)
                      }
                      className="text-base bg-background border-border focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Topics */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="h-8 w-1 bg-primary rounded-full" />
                      Topics
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={addTopic}
                      size="sm"
                      variant="outline"
                      className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <CardDescription>
                    Tag this question with relevant topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                  {topics.map((topic, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={topic}
                        onChange={(e) => updateTopic(index, e.target.value)}
                        placeholder="e.g., Arrays, Dynamic Programming"
                        className="flex-1 bg-background border-border focus:border-primary focus:ring-primary/20"
                      />
                      {topics.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTopic(index)}
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Solution Code */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-8 w-1 bg-primary rounded-full" />
                    Solution Code
                  </CardTitle>
                  <CardDescription>
                    Reference solution for the problem
                  </CardDescription>
                </CardHeader>
                <CardContent className={"h-full "}>
                  <Textarea
                    id="solutionCode"
                    value={solutionCode}
                    onChange={(e) => setSolutionCode(e.target.value)}
                    placeholder="// Write your solution code here..."
                    rows={50}
                    className="font-mono text-sm resize-y bg-background border-border focus:border-primary focus:ring-primary/20 h-[30vh] lg:h-full lg:max-h-[300px] overflow-y-auto "
                  />
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN - Testing & Validation */}
            <div className="space-y-6 flex flex-col h-full">
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="h-8 w-1 bg-primary rounded-full" />
                      Hidden Test Case
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Private test case for validation (not visible to users)
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Card className="border-primary/20 bg-muted/30">
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="testcase-input"
                          className="text-sm font-medium"
                        >
                          Input
                        </Label>
                        <Textarea
                          id="testcase-input"
                          value={invisibleTestCase.input}
                          onChange={(e) =>
                            setInvisibleTestCase({
                              ...invisibleTestCase,
                              input: e.target.value,
                            })
                          }
                          placeholder="Input for this test case"
                          rows={2}
                          className="font-mono text-sm resize-y bg-background border-border focus:border-primary focus:ring-primary/20 max-h-[200px] overflow-y-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="testcase-output"
                          className="text-sm font-medium"
                        >
                          Expected Output
                        </Label>
                        <Textarea
                          id="testcase-output"
                          value={invisibleTestCase.output}
                          onChange={(e) =>
                            setInvisibleTestCase({
                              ...invisibleTestCase,
                              output: e.target.value,
                            })
                          }
                          placeholder="Expected output for this test case"
                          rows={2}
                          className="font-mono text-sm resize-y bg-background border-border focus:border-primary focus:ring-primary/20 max-h-[200px] overflow-y-auto"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Hints */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="h-8 w-1 bg-primary rounded-full" />
                        Hints
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Optional hints to help users solve the problem
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      onClick={addHint}
                      size="sm"
                      variant="outline"
                      className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                  {hints.map((hint, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={hint}
                        onChange={(e) => updateHint(index, e.target.value)}
                        placeholder={`Hint ${index + 1}`}
                        className="flex-1 bg-background border-border focus:border-primary focus:ring-primary/20"
                      />
                      {hints.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeHint(index)}
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Constraints */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="h-8 w-1 bg-primary rounded-full" />
                        Constraints
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Define input constraints and boundaries
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      onClick={addConstraint}
                      size="sm"
                      variant="outline"
                      className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                  {constraints.map((constraint, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={constraint}
                        onChange={(e) =>
                          updateConstraint(index, e.target.value)
                        }
                        placeholder="e.g., 1 <= n <= 10^5"
                        className="flex-1 font-mono bg-background border-border focus:border-primary focus:ring-primary/20"
                      />
                      {constraints.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeConstraint(index)}
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Boilerplate Codes */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="h-10 w-1 bg-primary rounded-full" />
                    Boilerplate Codes
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Provide starter code templates for different programming
                    languages. Users will see these templates when they start
                    solving the problem.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {boilerPlateCodes.map((boilerPlate, index) => (
                    <div
                      key={index}
                      className="space-y-4 p-6 border border-border/40 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <Label className="text-lg font-semibold">
                            Programming Language
                          </Label>
                        </div>
                        {boilerPlateCodes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBoilerPlate(index)}
                            className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Language Name
                          </Label>
                          <Input
                            value={boilerPlate.language}
                            onChange={(e) =>
                              updateBoilerPlateLanguage(index, e.target.value)
                            }
                            placeholder="e.g., JavaScript, Python, Java, C++, Go, Rust"
                            className="text-base h-12 bg-background border-border focus:border-primary focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Starter Code Template
                          </Label>
                          <Textarea
                            value={boilerPlate.code}
                            onChange={(e) =>
                              updateBoilerPlateCode(index, e.target.value)
                            }
                            placeholder={`// Write boilerplate code for ${
                              boilerPlate.language || "this language"
                            }...\n\n// Example:\nfunction solution() {\n  // Your code here\n  return result;\n}`}
                            rows={12}
                            className="font-mono text-sm resize-y bg-background border-border focus:border-primary focus:ring-primary/20 min-h-[200px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addBoilerPlate}
                      className="w-full h-12 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-base font-medium"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add Another Programming Language
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[300px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createVideoAndQA } from "@/lib/api";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function UploadVideoPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chapter, setChapter] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login?role=admin");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/login?role=admin");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: any = createVideoAndQA(
        title,
        chapter,
        description,
        questions,
        videoFile
      );
      if (response.status === 201) {
        setLoading(false);
        setSuccess(true);
      } else {
        setLoading(false);
        setTitle("");
        setDescription("");
        setChapter("");
        setVideoFile(null);
        setQuestions([
          {
            id: "1",
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
          },
        ]);
        setSuccess(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/admin"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Upload New Video
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Video uploaded successfully! Students can now access this content.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Details */}
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
              <CardDescription>
                Basic information about your video lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter">Chapter</Label>
                  <Input
                    id="title"
                    placeholder="Enter Chanpter Name"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-500"
                    >
                      Click to upload
                    </label>
                    <span> or drag and drop</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM up to 500MB
                  </p>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    required
                  />
                  {videoFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {videoFile.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quiz Questions</CardTitle>
                  <CardDescription>
                    Create questions to test student understanding
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Question {questionIndex + 1}
                    </h4>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(question.id, "question", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    <RadioGroup
                      value={question.correctAnswer.toString()}
                      onValueChange={(value) =>
                        updateQuestion(
                          question.id,
                          "correctAnswer",
                          Number.parseInt(value)
                        )
                      }
                    >
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem
                            value={optionIndex.toString()}
                            id={`${question.id}-${optionIndex}`}
                          />
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                optionIndex,
                                e.target.value
                              )
                            }
                            className="flex-1"
                            required
                          />
                          <Label
                            htmlFor={`${question.id}-${optionIndex}`}
                            className="text-sm text-gray-500"
                          >
                            {optionIndex === question.correctAnswer
                              ? "Correct"
                              : ""}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Video & Quiz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

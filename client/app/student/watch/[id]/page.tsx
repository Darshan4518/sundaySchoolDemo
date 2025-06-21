"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { fetchQA, fetchVideo } from "@/lib/api"

export default function WatchVideoPage() {
  const [user, setUser] = useState<any>(null)
  const [video, setVideo] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<"video" | "quiz" | "results">("video")
  const [qa, setQa] = useState([])
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [quizResults, setQuizResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const videoId = params.id as string

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login?role=student")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "student") {
      router.push("/login?role=student")
      return
    }

    setUser(parsedUser)

    const getVideos = async () => {
      const videos: any = await fetchVideo()
      const foundVideo = videos.find((v: any) => v?._id === videoId)
      if (!foundVideo) {
        router.push("/student")
        return
      }
      setVideo(foundVideo)
    }
    const getQuiz = async () => {
      const quiz: any = await fetchQA()
      const foundQuiz = quiz.filter((q: any) => q?.video?._id === videoId)

      // Transform the quiz data to match expected structure
      const transformedQuiz = foundQuiz.map((q: any) => ({
        ...q,
        id: q.question_id || q._id,
        question: q.question_text,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: q.correct_answer,
      }))

      setQa(transformedQuiz)
    }
    getQuiz()
    getVideos()
  }, [router, videoId])

  const handleVideoComplete = () => {
    setCurrentStep("quiz")
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleQuizSubmit = () => {
    setLoading(true)

    // Calculate results
    let correctAnswers = 0
    const results = qa.map((question: any) => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correctAnswers++

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        options: question.options,
        isCorrect,
      }
    })

    const score = Math.round((correctAnswers / qa.length) * 100)

    setQuizResults({
      score,
      correctAnswers,
      totalQuestions: qa.length,
      results,
    })

    // Save progress
    const progressKey = `progress_${user.email}`
    const currentProgress = JSON.parse(localStorage.getItem(progressKey) || "{}")
    currentProgress[videoId] = {
      completed: true,
      quizScore: score,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem(progressKey, JSON.stringify(currentProgress))

    setLoading(false)
    setCurrentStep("results")
  }

  if (!user || !video) return null

  const videoSrc =
    video.video_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/student" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">{video.title}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {currentStep === "video" ? "Watching Video" : currentStep === "quiz" ? "Taking Quiz" : "Results"}
            </span>
          </div>
          <Progress value={currentStep === "video" ? 33 : currentStep === "quiz" ? 66 : 100} className="h-2" />
        </div>

        {/* Video Section */}
        {currentStep === "video" && (
          <>
            {/* Video Player */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  <video controls className="w-full h-full object-contain" src={videoSrc}>
                    <source src={videoSrc} type="video/mp4" />
                    {"Your browser does not support the video tag."}
                  </video>
                </div>

                <div className="text-center">
                  <Button onClick={handleVideoComplete} size="lg">
                    {"I've Finished Watching"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Quiz Section */}
        {currentStep === "quiz" && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Time!</CardTitle>
              <CardDescription>Test your understanding of the video content ({qa.length} questions)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {qa.map((question: any, index: number) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">
                    {index + 1}. {question.question}
                  </h4>
                  <RadioGroup
                    value={answers[question.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
                  >
                    {question.options.map((option: string, optionIndex: number) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                        <Label htmlFor={`${question.id}-${optionIndex}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <div className="text-center pt-4">
                <Button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(answers).length !== qa.length || loading}
                  size="lg"
                >
                  {loading ? "Submitting..." : "Submit Quiz"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {currentStep === "results" && quizResults && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Quiz Complete!</CardTitle>
                <CardDescription>
                  You scored {quizResults.score}% ({quizResults.correctAnswers} out of {quizResults.totalQuestions}{" "}
                  correct)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">{quizResults.score}%</div>
                  <Progress value={quizResults.score} className="h-3 max-w-xs mx-auto" />
                </div>

                {quizResults.score >= 70 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Great job! You've successfully completed this lesson.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-orange-200 bg-orange-50">
                    <X className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      You might want to review the video and try again to improve your score.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Review Your Answers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizResults.results.map((result: any, index: number) => (
                  <div key={result.questionId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium flex-1">
                        {index + 1}. {result.question}
                      </h4>
                      {result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div
                        className={`p-2 rounded ${
                          result.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <span className="font-medium">Your answer: </span>
                        {result.options[result.userAnswer]}
                      </div>

                      {!result.isCorrect && (
                        <div className="p-2 rounded bg-green-50 border border-green-200">
                          <span className="font-medium">Correct answer: </span>
                          {result.options[result.correctAnswer]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="text-center">
              <Button asChild size="lg">
                <Link href="/student">Continue Learning</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

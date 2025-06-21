"use client";

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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, CheckCircle, LogOut, BookOpen } from "lucide-react";
import Link from "next/link";
import { fetchVideo } from "@/lib/api";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login?role=student");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "student") {
      router.push("/login?role=student");
      return;
    }

    setUser(parsedUser);

    const studentProgress = JSON.parse(
      localStorage.getItem(`progress_${parsedUser.email}`) || "{}"
    );

    const fetchVideos = async () => {
      const videos: any = await fetchVideo();
      setVideos(videos);
    };
    fetchVideos();
    setProgress(studentProgress);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  // Calculate overall progress
  const totalVideos = videos?.length;
  const completedVideos = Object.keys(progress).filter(
    (videoId) => progress[videoId]?.completed
  ).length;
  const overallProgress =
    totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  // Group videos by chapter
  const videosByChapter = videos.reduce((acc, video) => {
    const chapter = video.chapter || "Uncategorized";
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(video);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Student Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">
                  {completedVideos} of {totalVideos} videos completed
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalVideos}
                  </div>
                  <div className="text-sm text-gray-600">Total Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedVideos}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(overallProgress)}%
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        {Object.keys(videosByChapter).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Content Available
              </h3>
              <p className="text-gray-600">
                Your instructor hasn't uploaded any videos yet. Check back
                later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(videosByChapter).map(
              ([chapterName, chapterVideos]: [string, any]) => (
                <Card key={chapterName}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      {chapterName}
                    </CardTitle>
                    <CardDescription>
                      {(chapterVideos as any[]).length} video
                      {(chapterVideos as any[]).length !== 1 ? "s" : ""} in this
                      chapter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(chapterVideos as any[]).map((video, index) => {
                        const videoProgress = progress[video?._id];
                        const isCompleted = videoProgress?.completed;
                        const quizScore = videoProgress?.quizScore;

                        return (
                          <div
                            key={video?._id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle className="h-8 w-8 text-green-500" />
                                ) : (
                                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Play className="h-4 w-4 text-gray-600" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {video.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {video.description}
                                </p>
                                <div className="flex items-center mt-1 space-x-4">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Video + Quiz
                                  </div>
                                  {isCompleted && quizScore !== undefined && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Quiz Score: {quizScore}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Link href={`/student/watch/${video?._id}`}>
                              <Button
                                variant={isCompleted ? "outline" : "default"}
                              >
                                {isCompleted ? "Review" : "Start"}
                              </Button>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
import { Video, Plus, Users, BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { fetchVideo } from "@/lib/api";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const router = useRouter();

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

    const getVideos = async () => {
      const videos: any = await fetchVideo();
      setRecentVideos(videos);
    };
    getVideos();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/upload">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-center flex-col text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload New Video
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add a new video lesson with quiz questions
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-center flex-col text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Students
                </h3>
                <p className="text-sm text-gray-600">
                  View student progress and performance
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-center flex-col text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Course Structure
                </h3>
                <p className="text-sm text-gray-600">
                  Organize chapters and lesson order
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
            <CardDescription>Your latest uploaded content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVideos?.map((video: any) => (
                <div
                  key={video?._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Video className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Title: {video.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Chapter: {video.chapter}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

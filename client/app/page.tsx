import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { GraduationCap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learning Management System
          </h1>
          <p className="text-xl text-gray-600">
            Choose your role to access the platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>
                Upload videos, create quizzes, and manage content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login?role=admin">
                <Button className="w-full" size="lg">
                  Login as Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription>
                Watch videos, take quizzes, and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login?role=student">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 w-full"
                >
                  Login as Student
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, GraduationCap, ArrowLeft } from "lucide-react";

import Link from "next/link";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res: any = await login(email, password);
      if (res.status === 200) {
        const user = res.data.user;
        localStorage.setItem(
          "user",
          JSON.stringify({ email: user.email, role: user.role })
        );
        router.push(user.role === "admin" ? "/admin" : "/student");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {role === "admin" ? (
                <Shield className="w-8 h-8 text-blue-600" />
              ) : (
                <GraduationCap className="w-8 h-8 text-green-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {role === "admin" ? "Admin Login" : "Student Login"}
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the {role} portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Admin:</strong> admin@demo.com / admin123
                </p>
                <p>
                  <strong>Student:</strong> student@demo.com / student123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

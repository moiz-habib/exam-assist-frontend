
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<"teacher" | "student">("teacher");
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Set the email based on the selected role for the demo
    const loginEmail = activeRole === "teacher" ? "teacher@example.com" : "student@example.com";
    
    try {
      const success = await login(loginEmail, password || "password");
      if (success) {
        navigate(activeRole === "teacher" ? "/teacher" : "/student");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    setActiveRole(role as "teacher" | "student");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            <span className="font-extrabold">Pro</span>Assist
          </h1>
          <p className="text-gray-600">Intelligent Exam Grading System</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Log in to access your account</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="teacher" className="mb-6" onValueChange={handleRoleSelect}>
              <TabsList className="w-full">
                <TabsTrigger value="teacher" className="w-1/2">Teacher</TabsTrigger>
                <TabsTrigger value="student" className="w-1/2">Student</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={activeRole === "teacher" ? "teacher@example.com" : "student@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Demo: Use {activeRole === "teacher" ? "teacher@example.com" : "student@example.com"}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">Demo: Use any password</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : "Login"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              For demo purposes, any password will work with the demo emails.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;


import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ExamResult } from "@/types";
import { studentApi } from "@/services/api";
import { useState as useTabState } from "@/hooks/use-toast";
import { FileText } from "lucide-react";
import StudentExamFeedback from "./StudentExamFeedback";

const StudentDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated or not a student
  if (!isAuthenticated || user?.role !== "student") {
    return <Navigate to="/login" />;
  }

  // Fetch results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const response = await studentApi.getResults(user.id);
        if (response.success && response.data) {
          setResults(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [user?.id]);

  const handleViewFeedback = (result: ExamResult) => {
    setSelectedResult(result);
    setActiveTab("feedback");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-gray-600">View your exam results and feedback</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Results Overview</TabsTrigger>
            {selectedResult && (
              <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Exam Results</CardTitle>
              <CardDescription>View all your graded exams and access detailed feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No exam results available yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((result) => (
                    <Card key={result.id} className="overflow-hidden border">
                      <div className="bg-primary/10 px-6 py-4">
                        <h3 className="font-semibold">Exam #{result.examId}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Graded: {new Date(result.gradedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Score</p>
                            <p className="text-2xl font-bold">
                              {result.totalScore} / {result.maxPossibleScore}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {Math.round((result.totalScore / result.maxPossibleScore) * 100)}%
                          </Badge>
                        </div>
                        <Button
                          className="w-full mt-2"
                          onClick={() => handleViewFeedback(result)}
                        >
                          <FileText size={16} className="mr-2" />
                          View Feedback
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4">
          {selectedResult && <StudentExamFeedback result={selectedResult} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;


import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ExamResult, Rubric } from "@/types";
import { studentApi } from "@/services/api";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";

interface StudentExamFeedbackProps {
  result: ExamResult;
}

const StudentExamFeedback = ({ result }: StudentExamFeedbackProps) => {
  const [isRubricDialogOpen, setIsRubricDialogOpen] = useState(false);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [rubricLoading, setRubricLoading] = useState(false);

  const fetchRubric = async () => {
    setRubricLoading(true);
    try {
      const response = await studentApi.getRubric(result.examId);
      if (response.success && response.data) {
        setRubric(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch rubric:", error);
    } finally {
      setRubricLoading(false);
    }
  };

  const handleViewRubric = () => {
    fetchRubric();
    setIsRubricDialogOpen(true);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Exam Feedback</h2>
          <p className="text-gray-500 text-sm">Graded: {new Date(result.gradedDate).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleViewRubric}>
            <BookOpen size={16} className="mr-2" />
            View Rubric
          </Button>
          <Button variant="outline" asChild>
            <a href={result.answerSheetUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} className="mr-2" />
              View Answer Sheet
            </a>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Overall Results</CardTitle>
            <div className="text-2xl font-bold">
              {result.totalScore} / {result.maxPossibleScore}
              <span className="ml-2 text-sm">
                ({Math.round((result.totalScore / result.maxPossibleScore) * 100)}%)
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <h3 className="text-lg font-semibold mb-4">Question-by-Question Feedback</h3>
      <div className="space-y-6">
        {result.feedbackItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="border-l-4 border-primary px-6 py-4 bg-secondary">
              <div className="flex justify-between">
                <h3 className="font-medium">Question {item.questionNumber}</h3>
                <div className={`font-semibold ${getScoreColor(item.score, item.maxScore)}`}>
                  {item.score} / {item.maxScore} points
                </div>
              </div>
            </div>
            <CardContent className="pt-5">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback:</h4>
                <p className="text-gray-600">{item.feedback}</p>
              </div>
              
              {item.sourceReferences && item.sourceReferences.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">References:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {item.sourceReferences.map((reference, index) => (
                      <li key={index}>{reference}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rubric Dialog */}
      <Dialog open={isRubricDialogOpen} onOpenChange={setIsRubricDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exam Rubric</DialogTitle>
            <DialogDescription>
              Evaluation criteria for this exam
            </DialogDescription>
          </DialogHeader>

          {rubricLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {rubric?.items.map((item) => (
                <div key={item.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-medium">
                      Question {item.questionNumber}
                    </h3>
                    <Badge>{item.maxScore} points</Badge>
                  </div>
                  <p className="text-sm font-medium mt-2 text-gray-700">Criteria:</p>
                  <p className="text-sm mt-1 mb-3">{item.criteria}</p>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm font-medium mb-1 text-gray-700">Expected Answer:</p>
                    <p className="text-sm text-gray-600">{item.expectedAnswer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentExamFeedback;

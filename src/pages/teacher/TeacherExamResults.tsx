
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { teacherApi } from "@/services/api";
import { StudentResult, Rubric } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Edit, FileText } from "lucide-react";

interface TeacherExamResultsProps {
  examId: string;
}

const TeacherExamResults = ({ examId }: TeacherExamResultsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRubricDialogOpen, setIsRubricDialogOpen] = useState(false);
  const [editedScore, setEditedScore] = useState<number | "">("");
  const [editedFeedback, setEditedFeedback] = useState("");
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [rubricLoading, setRubricLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await teacherApi.getExamResults(examId);
        if (response.success && response.data) {
          setStudentResults(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch student results:", error);
        toast({
          title: "Error",
          description: "Failed to load student results",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [examId, toast]);

  const fetchRubric = async () => {
    setRubricLoading(true);
    try {
      const response = await teacherApi.getRubrics(examId);
      if (response.success && response.data) {
        setRubric(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch rubric:", error);
      toast({
        title: "Error",
        description: "Failed to load rubric",
        variant: "destructive",
      });
    } finally {
      setRubricLoading(false);
    }
  };

  const handleOpenEdit = (student: StudentResult) => {
    setSelectedStudent(student);
    setEditedScore(student.score);
    setEditedFeedback(student.feedback);
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedStudent) return;
    setIsSaving(true);
    
    try {
      // API call to save changes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local state
      setStudentResults((prev) =>
        prev.map((item) =>
          item.id === selectedStudent.id
            ? {
                ...item,
                score: typeof editedScore === "number" ? editedScore : item.score,
                feedback: editedFeedback,
                status: "approved",
              }
            : item
        )
      );
      
      setIsDialogOpen(false);
      toast({
        title: "Changes saved",
        description: "The feedback has been updated successfully",
      });
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewRubric = () => {
    fetchRubric();
    setIsRubricDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Exam Results</h2>
        <Button variant="outline" onClick={handleViewRubric}>
          <FileText size={16} className="mr-2" />
          View Rubric
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <CardDescription>Review and approve AI-generated feedback</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : studentResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found for this exam.</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {studentResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{result.studentName}</td>
                      <td className="px-4 py-3 text-sm text-center font-medium">
                        {result.score}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant="outline"
                          className={
                            result.status === "approved"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {result.status === "approved" ? "Approved" : "Awaiting Review"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                          onClick={() => handleOpenEdit(result)}
                        >
                          <Edit size={14} className="mr-1" />
                          {result.status === "approved" ? "Review" : "Edit"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Feedback Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.studentName} - Review Feedback
            </DialogTitle>
            <DialogDescription>
              Review and adjust the AI-generated feedback if needed
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Score</label>
              <Input
                type="number"
                value={editedScore}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditedScore(value === "" ? "" : Number(value));
                }}
                min={0}
                max={100}
                className="w-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Feedback</label>
              <Textarea
                value={editedFeedback}
                onChange={(e) => setEditedFeedback(e.target.value)}
                className="h-40"
                placeholder="Enter feedback..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rubric Dialog */}
      <Dialog open={isRubricDialogOpen} onOpenChange={setIsRubricDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exam Rubric</DialogTitle>
            <DialogDescription>
              Evaluation criteria used by the AI system
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

export default TeacherExamResults;

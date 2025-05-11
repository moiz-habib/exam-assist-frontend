
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FileUpload from "@/components/shared/FileUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Exam } from "@/types";
import { teacherApi } from "@/services/api";
import { Upload, BookOpen, FileText } from "lucide-react";
import TeacherExamResults from "./TeacherExamResults";

const TeacherDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isMaterialsDialogOpen, setIsMaterialsDialogOpen] = useState(false);
  const [isExamsDialogOpen, setIsExamsDialogOpen] = useState(false);
  const [uploadingMaterials, setUploadingMaterials] = useState(false);
  const [uploadingExams, setUploadingExams] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated or not a teacher
  if (!isAuthenticated || user?.role !== "teacher") {
    return <Navigate to="/login" />;
  }

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const response = await teacherApi.getExams();
        if (response.success && response.data) {
          setExams(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleMaterialsUpload = async (files: File[]) => {
    setUploadingMaterials(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsMaterialsDialogOpen(false);
      // Toast success message
    } catch (error) {
      console.error("Material upload failed:", error);
      // Toast error message
    } finally {
      setUploadingMaterials(false);
    }
  };

  const handleExamsUpload = async (files: File[]) => {
    setUploadingExams(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsExamsDialogOpen(false);
      // Toast success message
    } catch (error) {
      console.error("Exam upload failed:", error);
      // Toast error message
    } finally {
      setUploadingExams(false);
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Manage your exams and review AI-generated feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upload Materials</CardTitle>
            <CardDescription>Add course resources</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-500 mb-4">
              Add lecture notes, textbooks, or other reference materials
            </p>
          </CardContent>
          <CardFooter>
            <Dialog open={isMaterialsDialogOpen} onOpenChange={setIsMaterialsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Upload size={16} className="mr-2" />
                  Upload Materials
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Course Materials</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <FileUpload
                    label="Upload Course Materials"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    multiple={true}
                    maxFiles={5}
                    onFilesSelected={handleMaterialsUpload}
                  />
                  {uploadingMaterials && (
                    <div className="mt-4 flex items-center justify-center">
                      <LoadingSpinner /> 
                      <span className="ml-2 text-sm text-gray-500">Uploading...</span>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upload Exams</CardTitle>
            <CardDescription>Scan and upload student exams</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-500 mb-4">
              Upload scanned student answer sheets for AI evaluation
            </p>
          </CardContent>
          <CardFooter>
            <Dialog open={isExamsDialogOpen} onOpenChange={setIsExamsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <FileText size={16} className="mr-2" />
                  Upload Exams
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Student Exams</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <FileUpload
                    label="Upload Exam Scans"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple={true}
                    maxFiles={10}
                    onFilesSelected={handleExamsUpload}
                  />
                  {uploadingExams && (
                    <div className="mt-4 flex items-center justify-center">
                      <LoadingSpinner />
                      <span className="ml-2 text-sm text-gray-500">Uploading...</span>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Create Rubrics</CardTitle>
            <CardDescription>Define evaluation criteria</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-500 mb-4">
              Create detailed grading rubrics for AI evaluation
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <BookOpen size={16} className="mr-2" />
              Manage Rubrics
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Exams Overview</TabsTrigger>
            {selectedExamId && (
              <TabsTrigger value="results">Results</TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exams</CardTitle>
              <CardDescription>List of uploaded exams and their processing status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : exams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No exams found. Upload some exams to get started.</p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Exam Title</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {exams.map((exam) => (
                        <tr key={exam.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{exam.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(exam.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className={getStatusColor(exam.status)}>
                              {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <Button
                              variant="link"
                              className="text-primary"
                              onClick={() => {
                                setSelectedExamId(exam.id);
                                setActiveTab("results");
                              }}
                              disabled={exam.status === "processing"}
                            >
                              {exam.status === "processing" ? "Processing..." : "View Results"}
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
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          {selectedExamId && <TeacherExamResults examId={selectedExamId} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;

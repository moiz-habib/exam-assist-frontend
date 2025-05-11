
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      navigate(user.role === "teacher" ? "/teacher" : "/student");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-primary">Pro</span>Assist
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Intelligent exam grading and feedback automation system
          </p>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            ProAssist uses advanced AI to automate grading of handwritten exams,
            providing detailed feedback and saving teachers valuable time.
          </p>

          <Button size="lg" onClick={handleGetStarted} className="px-8 py-6 text-base md:text-lg">
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="mt-16 md:mt-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-gray-600 text-sm">
                Easily upload course materials and scanned student exams for processing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Evaluation</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI evaluates handwritten answers using RAG technology for accurate assessment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Feedback</h3>
              <p className="text-gray-600 text-sm">
                Receive comprehensive feedback and scores that can be reviewed and adjusted.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24 border-t pt-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              How ProAssist Works
            </h2>
            <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6 text-left">
              <div className="flex-1 border rounded-lg p-6 bg-white">
                <h3 className="font-semibold mb-2 text-primary">For Teachers</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Upload course materials for context</li>
                  <li>• Submit scanned student exams</li>
                  <li>• Review AI-generated grades and feedback</li>
                  <li>• Adjust scores if necessary</li>
                  <li>• Approve and release to students</li>
                </ul>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => navigate("/login")}
                >
                  Teacher Login
                </Button>
              </div>
              <div className="flex-1 border rounded-lg p-6 bg-white">
                <h3 className="font-semibold mb-2 text-primary">For Students</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Login with student credentials</li>
                  <li>• View graded exams and scores</li>
                  <li>• Access detailed feedback</li>
                  <li>• Review source references</li>
                  <li>• Understand areas for improvement</li>
                </ul>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => navigate("/login")}
                >
                  Student Login
                </Button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 border-t pt-8 text-center text-gray-500 text-sm">
          <p>© 2024 ProAssist. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

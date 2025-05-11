
import axios from "axios";
import { ApiResponse, CourseMaterial, Exam, ExamResult, Rubric, StudentResult } from "@/types";

const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      // NOTE: This is mocked for now. In a real app, you'd call the actual API
      // const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>("/auth/login", { email, password });
      // return response.data;
      
      // Mock implementation
      if (email === "teacher@example.com" && password === "password") {
        return {
          success: true,
          data: {
            token: "mock-token-teacher",
            user: {
              id: "t1",
              name: "John Teacher",
              email: "teacher@example.com",
              role: "teacher" as const,
            },
          },
        };
      } else if (email === "student@example.com" && password === "password") {
        return {
          success: true,
          data: {
            token: "mock-token-student",
            user: {
              id: "s1",
              name: "Jane Student",
              email: "student@example.com",
              role: "student" as const,
            },
          },
        };
      } else {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Authentication failed",
      };
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Teacher API
export const teacherApi = {
  // Upload course materials
  uploadMaterials: async (formData: FormData): Promise<ApiResponse<CourseMaterial>> => {
    try {
      const response = await apiClient.post<ApiResponse<CourseMaterial>>("/upload/materials", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload materials failed:", error);
      return {
        success: false,
        error: "Failed to upload course materials",
      };
    }
  },

  // Upload exams
  uploadExams: async (formData: FormData): Promise<ApiResponse<Exam>> => {
    try {
      const response = await apiClient.post<ApiResponse<Exam>>("/upload/exams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload exams failed:", error);
      return {
        success: false,
        error: "Failed to upload exams",
      };
    }
  },

  // Get exams
  getExams: async (): Promise<ApiResponse<Exam[]>> => {
    try {
      // For now, return mock data
      return {
        success: true,
        data: [
          {
            id: "exam1",
            title: "Midterm Exam - CS101",
            courseId: "cs101",
            uploadDate: "2023-04-15",
            status: "graded",
          },
          {
            id: "exam2",
            title: "Final Exam - CS101",
            courseId: "cs101",
            uploadDate: "2023-05-20",
            status: "processing",
          },
          {
            id: "exam3",
            title: "Quiz 3 - Math202",
            courseId: "math202",
            uploadDate: "2023-05-10",
            status: "graded",
          },
        ],
      };
    } catch (error) {
      console.error("Get exams failed:", error);
      return {
        success: false,
        error: "Failed to fetch exams",
      };
    }
  },

  // Get exam results for teacher
  getExamResults: async (examId: string): Promise<ApiResponse<StudentResult[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<StudentResult[]>>(`/results/teacher/${examId}`);
      return response.data;
    } catch (error) {
      console.error("Get exam results failed:", error);
      // Mock data for now
      return {
        success: true,
        data: [
          {
            id: "result1",
            studentId: "s1",
            studentName: "Jane Student",
            examId: examId,
            score: 85,
            feedback: "Good understanding of core concepts. Could improve on application.",
            status: "graded",
            answerSheetUrl: "/mock-data/answer1.pdf",
          },
          {
            id: "result2",
            studentId: "s2",
            studentName: "Bob Smith",
            examId: examId,
            score: 92,
            feedback: "Excellent work overall. Very thorough answers.",
            status: "approved",
            answerSheetUrl: "/mock-data/answer2.pdf",
          },
          {
            id: "result3",
            studentId: "s3",
            studentName: "Alice Johnson",
            examId: examId,
            score: 78,
            feedback: "Understanding of basic concepts but lacking depth in analysis.",
            status: "graded",
            answerSheetUrl: "/mock-data/answer3.pdf",
          },
        ],
      };
    }
  },

  // Adjust grade/feedback
  adjustFeedback: async (
    resultId: string,
    updates: { score?: number; feedback?: string }
  ): Promise<ApiResponse<StudentResult>> => {
    try {
      const response = await apiClient.post<ApiResponse<StudentResult>>("/adjust/grade", {
        resultId,
        ...updates,
      });
      return response.data;
    } catch (error) {
      console.error("Adjust feedback failed:", error);
      return {
        success: false,
        error: "Failed to adjust feedback",
      };
    }
  },

  // Get rubrics
  getRubrics: async (examId: string): Promise<ApiResponse<Rubric>> => {
    try {
      const response = await apiClient.get<ApiResponse<Rubric>>(`/rubrics/${examId}`);
      return response.data;
    } catch (error) {
      console.error("Get rubrics failed:", error);
      // Mock data
      return {
        success: true,
        data: {
          id: "rubric1",
          examId: examId,
          items: [
            {
              id: "r1",
              questionNumber: 1,
              criteria: "Define and explain the concept of computational complexity",
              maxScore: 10,
              expectedAnswer: "Computational complexity refers to the amount of resources required to solve a problem...",
            },
            {
              id: "r2",
              questionNumber: 2,
              criteria: "Compare and contrast O(n) and O(n²) algorithms",
              maxScore: 15,
              expectedAnswer: "O(n) algorithms demonstrate linear time complexity where the time to execute is directly proportional...",
            },
            {
              id: "r3",
              questionNumber: 3,
              criteria: "Implement a sorting algorithm and analyze its efficiency",
              maxScore: 25,
              expectedAnswer: "A valid implementation of any standard sorting algorithm (e.g., quicksort, mergesort)...",
            },
          ],
        },
      };
    }
  },
};

// Student API
export const studentApi = {
  // Get student's exam results
  getResults: async (studentId: string): Promise<ApiResponse<ExamResult[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<ExamResult[]>>(`/results/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Get student results failed:", error);
      // Mock data
      return {
        success: true,
        data: [
          {
            id: "er1",
            examId: "exam1",
            studentId: studentId,
            studentName: "Jane Student",
            totalScore: 85,
            maxPossibleScore: 100,
            gradedDate: "2023-04-20",
            status: "approved",
            answerSheetUrl: "/mock-data/answer1.pdf",
            feedbackItems: [
              {
                id: "fi1",
                questionNumber: 1,
                score: 9,
                maxScore: 10,
                feedback: "Good definition but could have expanded more on time vs. space complexity trade-offs.",
                sourceReferences: ["Textbook pg. 42", "Lecture notes week 3"],
              },
              {
                id: "fi2",
                questionNumber: 2,
                score: 13,
                maxScore: 15,
                feedback: "Excellent comparison of time complexities with good examples.",
                sourceReferences: ["Textbook pg. 67-68", "Practice problem set 2"],
              },
              {
                id: "fi3",
                questionNumber: 3,
                score: 20,
                maxScore: 25,
                feedback: "Implementation works but efficiency analysis could be more thorough.",
                sourceReferences: ["Textbook pg. 103-107", "Lecture notes week 5"],
              },
            ],
          },
          {
            id: "er2",
            examId: "exam3",
            studentId: studentId,
            studentName: "Jane Student",
            totalScore: 42,
            maxPossibleScore: 50,
            gradedDate: "2023-05-15",
            status: "approved",
            answerSheetUrl: "/mock-data/answer4.pdf",
            feedbackItems: [
              {
                id: "fi4",
                questionNumber: 1,
                score: 9,
                maxScore: 10,
                feedback: "Correct application of the formula with clear steps.",
                sourceReferences: ["Textbook pg. 128", "Practice problem 7.2"],
              },
              {
                id: "fi5",
                questionNumber: 2,
                score: 18,
                maxScore: 20,
                feedback: "Excellent proof. Very well structured and logically sound.",
                sourceReferences: ["Lecture notes week 7", "Supplementary reading 3"],
              },
              {
                id: "fi6",
                questionNumber: 3,
                score: 15,
                maxScore: 20,
                feedback: "Good approach but missed a key step in the integration.",
                sourceReferences: ["Textbook pg. 156", "Example 8.4"],
              },
            ],
          },
        ],
      };
    }
  },

  // Get specific exam result
  getExamResult: async (studentId: string, examId: string): Promise<ApiResponse<ExamResult>> => {
    try {
      const results = await studentApi.getResults(studentId);
      if (!results.success || !results.data) {
        return {
          success: false,
          error: "Failed to fetch exam results",
        };
      }
      
      const examResult = results.data.find(r => r.examId === examId);
      if (!examResult) {
        return {
          success: false,
          error: "Exam result not found",
        };
      }
      
      return {
        success: true,
        data: examResult,
      };
    } catch (error) {
      console.error("Get exam result failed:", error);
      return {
        success: false,
        error: "Failed to fetch exam result",
      };
    }
  },

  // Get rubric for a specific exam
  getRubric: async (examId: string): Promise<ApiResponse<Rubric>> => {
    return teacherApi.getRubrics(examId);
  },
};

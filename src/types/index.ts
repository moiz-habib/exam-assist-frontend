
// Define role types
export type UserRole = "teacher" | "student";

// Authentication types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Course material types
export interface CourseMaterial {
  id: string;
  title: string;
  type: "pdf" | "ppt" | "textbook" | "other";
  uploadDate: string;
  fileUrl: string;
}

// Exam types
export interface Exam {
  id: string;
  title: string;
  courseId: string;
  uploadDate: string;
  status: "processing" | "graded" | "approved";
}

// Student results
export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  score: number;
  feedback: string;
  status: "graded" | "approved";
  answerSheetUrl: string;
}

// Feedback item
export interface FeedbackItem {
  id: string;
  questionNumber: number;
  score: number;
  maxScore: number;
  feedback: string;
  sourceReferences: string[];
}

// Detailed exam result
export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  totalScore: number;
  maxPossibleScore: number;
  gradedDate: string;
  status: "graded" | "approved";
  feedbackItems: FeedbackItem[];
  answerSheetUrl: string;
}

// Rubric
export interface RubricItem {
  id: string;
  questionNumber: number;
  criteria: string;
  maxScore: number;
  expectedAnswer: string;
}

export interface Rubric {
  id: string;
  examId: string;
  items: RubricItem[];
}

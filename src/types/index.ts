export interface User {
  _id?: string;
  id: string;
  fullName: string;
  fullname?: string;
  email: string;
  role?: string;
  joinedAt?: string;
  lastActive?: string;
  totalQuizzes: number;
  totalPoints: number;
  streak: number;
  longestStreak: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type AdminRole = "super_admin" | "admin";

export interface Admin extends User {
  password?: string;
  role: AdminRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number | string;
  category: string | { _id?: string; name?: string };
  author?: {
    id?: string;
    fullName?: string;
    email?: string;
    role?: string;
  };
  timer: number;
  score: number;
  difficulty?: "easy" | "medium" | "hard";
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  timesAnswered?: number;
  correctRate?: number;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  icon: string;
  color: string;
  questionsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalReviews: number;
  totalQuestions: number;
  totalAttempts: number;
  userGrowth: Array<{ date: string; count: number }>;
  popularCategories: Array<{ name: string; plays: number }>;
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: string;
  }>;
  categoryStats: Record<string, { totalAttempts: number; totalQuestions: number }>;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

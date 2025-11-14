export interface User {
  id: string;
  fullName: string;
  email: string;
  joinedAt: string;
  lastActive: string;
  stats: {
    quizzesCompleted: number;
    totalPoints: number;
    streak: number;
  };
}

export type AdminRole = "super_admin" | "admin";

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  timer: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  timesAnswered: number;
  correctRate: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  questions: number;
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
}

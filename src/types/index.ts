export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  joinedAt: string;
  lastActive: string;
  stats: {
    quizzesCompleted: number;
    totalPoints: number;
    streak: number;
  };
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  timer: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  quizzesCount: number;
  totalPlays: number;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalQuizzes: number;
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

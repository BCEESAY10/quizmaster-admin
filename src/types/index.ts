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

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  timer: number;
  createdAt: string;
  updatedAt: string;
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
  activeUsers: number;
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

import { AnalyticsData } from "../types";

export const mockAnalytics: AnalyticsData = {
  totalUsers: 12450,
  totalReviews: 8320,
  totalQuestions: 345,
  totalAttempts: 45670,
  userGrowth: [
    { date: "2024-11-05", count: 11200 },
    { date: "2024-11-06", count: 11350 },
    { date: "2024-11-07", count: 11500 },
    { date: "2024-11-08", count: 11680 },
    { date: "2024-11-09", count: 11850 },
    { date: "2024-11-10", count: 12050 },
    { date: "2024-11-11", count: 12250 },
    { date: "2024-11-12", count: 12450 },
  ],
  popularCategories: [
    { name: "Sports", plays: 15230 },
    { name: "Science", plays: 12450 },
    { name: "Geography", plays: 9870 },
    { name: "Math", plays: 8650 },
  ],
  recentActivity: [
    {
      id: "1",
      user: "Sarah Kanteh",
      action: 'Completed "Science Quiz"',
      timestamp: "2024-11-12T16:45:00Z",
    },
    {
      id: "2",
      user: "John Mendy",
      action: 'Created new quiz "Sports History Challenge"',
      timestamp: "2024-11-12T15:30:00Z",
    },
    {
      id: "3",
      user: "Babu Jobe",
      action: 'Updated "Geography"',
      timestamp: "2024-11-12T14:20:00Z",
    },
  ],
};

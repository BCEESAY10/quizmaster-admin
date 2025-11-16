import { Review } from "../types";

export const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user-1",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    rating: 5,
    feedback:
      "Amazing app! I love how interactive the quizzes are. The timer feature really keeps me engaged.",
    createdAt: "2024-11-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user-2",
    userName: "Mike Chen",
    userEmail: "mike.chen@example.com",
    rating: 4,
    feedback:
      "Really helpful for studying. The questions are well-written and challenging.",
    createdAt: "2024-11-14T16:45:00Z",
  },
];

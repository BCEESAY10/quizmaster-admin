import { User } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "johndoe@example.com",
    role: "user",
    joinedAt: "2024-01-15T10:30:00Z",
    lastActive: "2024-11-12T14:22:00Z",
    stats: {
      quizzesCompleted: 45,
      totalPoints: 3250,
      streak: 7,
    },
  },
  {
    id: "2",
    fullName: "Sarah Wilson",
    email: "sarahwilson@example.com",
    role: "user",
    joinedAt: "2024-02-20T09:15:00Z",
    lastActive: "2024-11-12T16:45:00Z",
    stats: {
      quizzesCompleted: 78,
      totalPoints: 5890,
      streak: 12,
    },
  },
  {
    id: "3",
    fullName: "Mike Johnson",
    email: "mikej@example.com",
    role: "admin",
    joinedAt: "2023-12-01T08:00:00Z",
    lastActive: "2024-11-12T17:10:00Z",
    stats: {
      quizzesCompleted: 120,
      totalPoints: 8750,
      streak: 25,
    },
  },
  {
    id: "4",
    fullName: "Emma Davis",
    email: "emmadavis@example.com",
    role: "user",
    joinedAt: "2024-03-10T11:20:00Z",
    lastActive: "2024-10-15T09:30:00Z",
    stats: {
      quizzesCompleted: 23,
      totalPoints: 1450,
      streak: 0,
    },
  },
];

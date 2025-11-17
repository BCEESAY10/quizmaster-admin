"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@/src/components/ui/Avatar";
import { Card } from "@/src/components/ui/Card";
import { formatDate } from "@/src/utils/formatters";
import { Trophy, Flame, CheckCircle } from "lucide-react";
import { User } from "@/src/types";

interface UserDetailsViewProps {
  user: User;
}

export default function UserDetailsPageView({ user }: UserDetailsViewProps) {
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">User not found</p>
          <p className="text-gray-600 mb-4">
            The user you're looking for doesn't exist
          </p>
          <button
            onClick={() => router.push("/users")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Users
        </button>

        {/* Header Card */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar fullName={user.fullName} size="lg" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {user.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {user.email}
                </p>
              </div>
            </div>
          </Card>

          {/* Activity Information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {formatDate(user.joinedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Active</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {formatDate(user.lastActive)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Card */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quizzes Completed */}
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.stats.quizzesCompleted}
                </p>
              </div>
            </div>

            {/* Total Points */}
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.stats.totalPoints.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Current Streak */}
            <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
              <div className="p-3 bg-orange-100 rounded-full">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.stats.streak} days
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

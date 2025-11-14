"use client";

import React from "react";
import { Users, BookOpen, TrendingUp, Activity } from "lucide-react";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { useAnalytics } from "@/src/hooks/useAnalytics";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { formatNumber, formatDateTime } from "@/src/utils/formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={formatNumber(analytics.totalUsers)}
          change={{ value: 12.5, isPositive: true }}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active Users"
          value={formatNumber(analytics.activeUsers)}
          change={{ value: 8.2, isPositive: true }}
          icon={Activity}
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Total Quizzes"
          value={formatNumber(analytics.totalQuestions)}
          change={{ value: 5.1, isPositive: true }}
          icon={BookOpen}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Quiz Attempts"
          value={formatNumber(analytics.totalAttempts)}
          change={{ value: 15.3, isPositive: true }}
          icon={TrendingUp}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card title="User Growth" subtitle="Last 7 days">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                  formatter={(value: number) => [formatNumber(value), "Users"]}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#5b48e8"
                  strokeWidth={2}
                  dot={{ fill: "#5b48e8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Popular Categories Chart */}
        <Card title="Popular Categories" subtitle="By total plays">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.popularCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [formatNumber(value), "Plays"]}
                />
                <Bar dataKey="plays" fill="#5b48e8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" subtitle="Latest user actions">
        <div className="space-y-4">
          {analytics.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-500 font-medium text-sm">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {formatDateTime(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/src/components/ui/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor = "bg-primary-100",
  iconColor = "text-primary-500",
}: StatsCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="mt-2 text-sm">
              <span
                className={
                  change.isPositive ? "text-green-600" : "text-red-600"
                }>
                {change.isPositive ? "+" : "-"}
                {Math.abs(change.value)}%
              </span>
              <span className="text-gray-500 ml-1">vs last week</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}

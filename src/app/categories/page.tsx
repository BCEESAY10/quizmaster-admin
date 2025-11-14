"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useCategories } from "@/src/hooks/useCategories";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Badge } from "@/src/components/ui/Badge";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { formatNumber } from "@/src/utils/formatters";
import { Category } from "@/src/types";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const CategoryCard = ({ category }: { category: Category }) => (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="h-16 w-16 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: category.color + "20" }}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {category.name}
            </h3>

            <div className="flex items-center gap-4 mt-2">
              <Badge variant="default">
                {formatNumber(category.questions)} questions
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => console.log("Edit", category.id)}>
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick={() => console.log("Delete", category.id)}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {category.questions}
            </p>
            <p className="text-xs text-gray-500 mt-1">Questions</p>
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">
            Organize questions by topics and subjects
          </p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {categories?.length || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Categories</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(
                categories?.reduce((sum, cat) => sum + cat.questionsCount, 0) ||
                  0
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Questions</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(
                categories?.reduce((sum, cat) => sum + cat.totalAttempts, 0) ||
                  0
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Attempts</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {categories && categories.length > 0
                ? Math.round(
                    categories.reduce(
                      (sum, cat) => sum + cat.questionsCount,
                      0
                    ) / categories.length
                  )
                : 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg Questions</p>
          </div>
        </Card>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {categories?.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
            <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Category
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

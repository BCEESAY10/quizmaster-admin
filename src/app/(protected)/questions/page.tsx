"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { useQuestions, useDeleteQuestion } from "@/src/hooks/useQuestions";
import { useCategories } from "@/src/hooks/useCategories";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Badge } from "@/src/components/ui/Badge";
import { DataTable } from "@/src/components/shared/DataTable";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { formatDate, getStatusColor } from "@/src/utils/formatters";
import { Question } from "@/src/types";
import { useRouter } from "next/navigation";

export default function QuestionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTimer, setSelectedTimer] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");

  const { data: questions, isLoading } = useQuestions();
  const { data: categories } = useCategories();
  const deleteQuestion = useDeleteQuestion();

  const allQuestions = Object.values(questions || {}).flat();

  const filteredQuestions = allQuestions.filter((question: Question) =>
    question.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "question",
      header: "Question",
      render: (q: Question) => (
        <div className="max-w-md">
          <p className="text-sm font-medium text-gray-900 truncate">
            {q.question}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {q.options.length} options • {q.timer}s timer
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (q: Question) => <Badge variant="default">{q.category}</Badge>,
    },

    {
      key: "timer",
      header: "Timer",
      render: (q: Question) => (
        <div className="text-sm">
          <p className="text-gray-900">{q.timer} secs</p>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (q: Question) => (
        <span className="text-sm text-gray-500">{formatDate(q.updatedAt)}</span>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-500 mt-1">Manage your question bank</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() => console.log("Bulk import")}>
            Import
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => console.log("Export")}>
            Export
          </Button>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => router.push("/questions/create")}>
            Add Question
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Authors</option>
            <option value="Awa Ceesay">Awa Ceesay</option>
            <option value="Binta Jawneh">Binta Jawneh</option>
            <option value="Omar Keita">Omar Keita</option>
          </select>
          <select
            value={selectedTimer}
            onChange={(e) => setSelectedTimer(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">Timer</option>
            <option value="10">10 secs</option>
            <option value="15">15 secs</option>
            <option value="20">20 secs</option>
          </select>
        </div>
      </Card>

      {/* Questions table */}
      <Card>
        <DataTable
          data={filteredQuestions || []}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(question) => router.push(`/questions/${question.id}`)}
          emptyMessage="No questions found"
        />
      </Card>

      {/* Stats footer */}
      {questions && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing {filteredQuestions?.length} of {questions.length} questions
          </p>
        </div>
      )}
    </div>
  );
}

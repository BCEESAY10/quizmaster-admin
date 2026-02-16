"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchQuestions } from "@/src/hooks/useSearchQuestions";
import { useAllQuestions } from "@/src/hooks/useAllQuestions";
import { useDeleteQuestion } from "@/src/hooks/useQuestions";
import { useCategories } from "@/src/hooks/useCategories";
import { useAdmins } from "@/src/hooks/useAdmins";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Badge } from "@/src/components/ui/Badge";
import { DataTable } from "@/src/components/shared/DataTable";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { formatDate } from "@/src/utils/formatters";
import { Admin, Category, Question } from "@/src/types";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/src/components/ui/ConfirmDialogue";

export default function QuestionsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTimer, setSelectedTimer] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [limit] = useState(10);

  const { data: categories } = useCategories();
  const { data: admins } = useAdmins();
  const deleteQuestion = useDeleteQuestion();

  // State for search with debounce
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Load all questions initially
  const { data: allQuestionsData, isLoading: allQuestionsLoading } =
    useAllQuestions({
      page: currentPage,
      limit,
    });

  // Determine if user is actively searching or filtering
  const isSearching =
    searchQuery.trim().length > 0 ||
    !!selectedCategory ||
    !!selectedAuthor ||
    !!selectedTimer;

  // Search questions with filters
  const { data: searchResults, isLoading: searchLoading } = useSearchQuestions({
    search: searchQuery,
    category: selectedCategory || undefined,
    author: selectedAuthor || undefined,
    timer: selectedTimer ? Number(selectedTimer) : undefined,
    page: currentPage,
    limit,
    enabled: isSearching,
  });

  // Use search results if actively searching, otherwise use all questions
  const questions = isSearching
    ? (searchResults?.data ?? [])
    : (allQuestionsData?.data ?? []);
  const pagination = isSearching
    ? searchResults?.pagination
    : allQuestionsData?.pagination;
  const isLoading = isSearching ? searchLoading : allQuestionsLoading;

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteQuestion.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

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
            {q.options.length} options • {q.timer}s timer • {q.score ?? 0} point
            • {q.difficulty ?? "medium"}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (q: Question) => {
        const categoryLabel =
          typeof q.category === "string"
            ? q.category
            : (q.category as { name?: string })?.name;

        return (
          <Badge variant="default">{categoryLabel ?? "Uncategorized"}</Badge>
        );
      },
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
    {
      key: "actions",
      header: "Actions",
      render: (q: Question) => (
        <div className="flex gap-2">
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              router.push(`/questions/${q.id}`);
            }}
            className="text-primary-600 hover:text-primary-900 text-sm">
            Edit
          </button>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleDelete(e, q.id)
            }
            className="text-red-600 hover:text-red-900 text-sm">
            Delete
          </button>
        </div>
      ),
    },
  ];

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
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Categories</option>
            {categories?.map((cat: Category, index: number) => (
              <option
                key={cat._id ?? cat.id ?? `${cat.name}-${index}`}
                value={cat._id ?? cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedAuthor}
            onChange={(e) => {
              setSelectedAuthor(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Authors</option>
            {Array.isArray(admins) &&
              admins.map((admin: Admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.fullName || admin.email}
                </option>
              ))}
          </select>
          <select
            value={selectedTimer}
            onChange={(e) => {
              setSelectedTimer(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">Timer</option>
            <option value="10">10 secs</option>
            <option value="15">15 secs</option>
            <option value="20">20 secs</option>
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchInput("");
              setSearchQuery("");
              setSelectedCategory("");
              setSelectedAuthor("");
              setSelectedTimer("");
              setCurrentPage(1);
            }}>
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Questions table - Show loading or content */}
      {isLoading ? (
        <Card>
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      ) : (
        <Card>
          <DataTable
            data={questions}
            columns={columns}
            isLoading={false}
            onRowClick={(question) => router.push(`/questions/${question.id}`)}
            emptyMessage="No questions found"
          />
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} (Total:{" "}
            {pagination.total} questions)
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
              }
              disabled={currentPage === pagination.totalPages || isLoading}
              rightIcon={<ChevronRight className="h-4 w-4" />}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Stats footer */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing {questions.length} of {pagination.total} questions
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteQuestion.isPending}
      />
    </div>
  );
}

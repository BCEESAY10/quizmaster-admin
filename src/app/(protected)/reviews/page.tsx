"use client";

import { useState } from "react";
import { useReviews, useDeleteReview } from "@/src/hooks/useReviews";
import ReviewCard from "@/src/components/ui/ReviewCard";
import ConfirmDialog from "@/src/components/ui/ConfirmDialogue";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>();
  const [dateFilter, setDateFilter] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const limit = 9;
  const { data, isLoading, error } = useReviews({
    page,
    limit,
    rating: ratingFilter,
    dateFilter,
  });

  const deleteMutation = useDeleteReview();

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setRatingFilter(undefined);
    setDateFilter(undefined);
    setPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading reviews</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasActiveFilters =
    ratingFilter !== undefined || dateFilter !== undefined;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h1>
          <p className="text-gray-500">
            {data?.total ?? 0} total review{data?.total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter size={20} />
              <span>Filters</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Rating Filter */}
              <select
                value={ratingFilter ?? ""}
                onChange={(e) => {
                  setRatingFilter(
                    e.target.value ? Number(e.target.value) : undefined
                  );
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter ?? ""}
                onChange={(e) => {
                  setDateFilter(e.target.value || undefined);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="last7days">Last 7 Days</option>
              </select>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data?.reviews.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              {hasActiveFilters
                ? "Try adjusting your filters to see more results"
                : "There are no reviews yet"}
            </p>
          </div>
        )}

        {/* Reviews Grid */}
        {!isLoading && data && data.reviews.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          pageNum === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}>
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

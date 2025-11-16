import { Review } from "@/src/types";
import { formatDate } from "@/src/utils/formatters";
import { Star, Trash2 } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  onDelete: (id: string) => void;
}

export default function ReviewCard({ review, onDelete }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {review.userName}
          </h3>
          <p className="text-sm text-gray-600">{review.userEmail}</p>
        </div>
        <button
          onClick={() => onDelete(review.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete review">
          <Trash2 size={20} />
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={
              star <= review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {review.rating}.0
        </span>
      </div>

      {/* Feedback */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.feedback}</p>

      {/* Date */}
      <div className="text-sm text-gray-500">
        {formatDate(review.createdAt)}
      </div>
    </div>
  );
}

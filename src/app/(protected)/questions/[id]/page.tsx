"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Clock, CheckCircle } from "lucide-react";
import { useQuestion, useDeleteQuestion } from "@/src/hooks/useQuestions";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { formatDateTime } from "@/src/utils/formatters";

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: question, isLoading } = useQuestion(params.id as string);
  const deleteQuestion = useDeleteQuestion();

  console.log("Question:", question);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion.mutateAsync(params.id as string);
      router.push("/questions");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-96">
        Question not found
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <Button
        variant="ghost"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => router.back()}>
        Back to Questions
      </Button>

      {/* Question header */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="info">{question.category}</Badge>
              <Badge variant="default">Point: {question.point}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {question.question}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {question.timer}s
              </span>
              <span>•</span>
              <span>{formatDateTime(question.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => router.push(`/questions/${question.id}/edit`)}>
              Edit
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={handleDelete}
              isLoading={deleteQuestion.isPending}>
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Answer Options */}
      <Card title="Answer Options">
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => {
            const isCorrect = index === question.correctAnswer;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                  isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                <p className="flex-1 text-gray-900">{option}</p>
                {isCorrect && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Correct Answer</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Statistics */}
      <Card title="Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-blue-600">
                {question.timesAnswered}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Times Answered</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-green-600">
                {question.correctRate}%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Correct Rate</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-purple-600">
                {Math.round(
                  ((100 - question.correctRate) * question.timesAnswered) / 100
                )}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Wrong Answers</p>
          </div>
        </div>
      </Card>

      {/* Metadata */}
      <Card title="Metadata">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Created At</p>
            <p className="text-gray-900 font-medium">
              {formatDateTime(question.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Last Updated</p>
            <p className="text-gray-900 font-medium">
              {formatDateTime(question.updatedAt)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Created By</p>
            <p className="text-gray-900 font-medium">{question.createdBy}</p>
          </div>
          <div>
            <p className="text-gray-500">Question ID</p>
            <p className="text-gray-900 font-medium font-mono">{question.id}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

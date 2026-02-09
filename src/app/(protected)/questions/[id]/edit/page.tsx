"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useQuestion, useUpdateQuestion } from "@/src/hooks/useQuestions";
import { useCategories } from "@/src/hooks/useCategories";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { Category } from "@/src/types";

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: existingQuestion, isLoading: questionLoading } = useQuestion(
    params.id as string,
  );
  const updateQuestion = useUpdateQuestion();

  const initialFormData = useMemo(
    () =>
      existingQuestion
        ? {
            question: existingQuestion.question,
            options: existingQuestion.options,
            correctAnswer:
              typeof existingQuestion.correctAnswer === "number"
                ? existingQuestion.correctAnswer
                : existingQuestion.options.findIndex(
                      (opt: string) => opt === existingQuestion.correctAnswer,
                    ) >= 0
                  ? existingQuestion.options.findIndex(
                      (opt: string) => opt === existingQuestion.correctAnswer,
                    )
                  : 0,
            category:
              typeof existingQuestion.category === "string"
                ? existingQuestion.category
                : existingQuestion.category?.name || "",
            timer: existingQuestion.timer,
            score: existingQuestion.score ?? 1,
            difficulty: existingQuestion.difficulty ?? "medium",
          }
        : {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            category: "",
            timer: 10,
            score: 1,
            difficulty: "medium",
          },
    [existingQuestion],
  );

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      alert("A question must have at least 2 options");
      return;
    }
    const newOptions = formData.options.filter(
      (_: string, i: number) => i !== index,
    );
    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer:
        formData.correctAnswer >= newOptions.length
          ? 0
          : formData.correctAnswer,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    const filledOptions = formData.options.filter((opt: string) => opt.trim());
    if (filledOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    formData.options.forEach((opt: string, index: number) => {
      if (!opt.trim()) {
        newErrors[`option-${index}`] = "Option cannot be empty";
      }
    });

    if (formData.timer < 10 || formData.timer > 30) {
      newErrors.timer = "Timer must be between 10 and 30 seconds";
    }

    if (!formData.difficulty) {
      newErrors.difficulty = "Difficulty is required";
    }

    if (!formData.score || formData.score < 1) {
      newErrors.score = "Score must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateQuestion.mutateAsync({
        id: params.id as string,
        data: formData,
      });

      alert("Question updated successfully!");
      router.push("/questions");
    } catch (error) {
      console.error("Update question failed:", error);
      alert("Failed to update question. Please try again.");
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (questionLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
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

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Question</h1>
        <p className="text-gray-500 mt-1">
          Update the details for this question
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Question Details */}
        <Card title="Question Details">
          <div className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="Enter your question..."
                rows={3}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600">{errors.question}</p>
              )}
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select a category</option>
                  {categories?.map((cat: Category, index: number) => (
                    <option
                      key={cat._id || cat.id || `${cat.name}-${index}`}
                      value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as "easy" | "medium" | "hard",
                    })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.difficulty}
                  </p>
                )}
              </div>
            </div>

            {/* Timer and Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.score}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      score: parseInt(e.target.value),
                    })
                  }
                  min={1}
                  max={20}
                  error={errors.score}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Points awarded for a correct answer
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timer (seconds) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.timer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timer: parseInt(e.target.value),
                    })
                  }
                  min={10}
                  max={30}
                  error={errors.timer}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Between 10 and 30 seconds
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Answer Options */}
        <Card title="Answer Options" className="mt-6">
          <div className="space-y-4">
            {formData.options.map((option: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex items-center h-10">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() =>
                      setFormData({ ...formData, correctAnswer: index })
                    }
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    error={errors[`option-${index}`]}
                  />
                </div>
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}

            {errors.options && (
              <p className="text-sm text-red-600">{errors.options}</p>
            )}

            <Button
              type="button"
              variant="secondary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleAddOption}
              disabled={formData.options.length >= 6}>
              Add Option
            </Button>

            <p className="text-sm text-gray-500">
              Select the radio button next to the correct answer
            </p>
          </div>
        </Card>

        {/* Submit buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateQuestion.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

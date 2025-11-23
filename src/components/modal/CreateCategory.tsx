import { Category } from "@/src/types";
import { ChangeEvent, FormEvent, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { FormSelect } from "../forms/FormSelect";
import { IconRegistry } from "../ui/icons/icon-registry";

interface CreateCategoryModalProps {
  showModal: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
}

const CreateCategoryModal = ({
  showModal,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) => {
  const [form, setForm] = useState<Category>({
    name: "",
    icon: "",
    color: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Category, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PreviewIcon =
    form.icon && IconRegistry[form.icon as keyof typeof IconRegistry];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof Category]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Category, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (!form.icon.trim()) {
      newErrors.icon = "Icon is required";
    }

    if (!form.color) {
      newErrors.color = "Color is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const categoryData: Category = {
        name: form.name.trim(),
        icon: form.icon.trim(),
        color: form.color,
      };

      console.log("Create category:", categoryData);

      onSuccess(categoryData);
      handleClose();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      icon: "",
      color: "",
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Drawer
      open={showModal}
      onClose={handleClose}
      direction="right"
      size={500}
      className="w-full sm:w-[500px]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Category
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Science, Sports, Geography"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 mb-2">
                Icon <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                {PreviewIcon && (
                  <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                    <PreviewIcon width={32} height={32} fill="#333" />
                  </div>
                )}

                <select
                  id="icon"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.icon
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary-500"
                  }`}>
                  <option value="">Select an icon</option>
                  <option value="science">Science</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts</option>
                  <option value="maths">Maths</option>
                  <option value="geography">Geography</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                  <option value="literature">Literature</option>
                  <option value="computer">Computer</option>
                </select>
              </div>
              {errors.icon && (
                <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select a name for an icon to represent this category
              </p>
            </div>

            {/* Color */}
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                      setForm((prev) => ({ ...prev, color: value }));
                    }
                  }}
                  placeholder="#4CAF50"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  disabled={isSubmitting}
                  maxLength={7}
                />
              </div>
              {errors.color && (
                <p className="mt-1 text-sm text-red-600">{errors.color}</p>
              )}
            </div>

            {/* Preview */}
            {(form.name || form.icon || form.color) && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Preview:
                </p>

                <div
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{ backgroundColor: form.color + "20" }}>
                  {/* SVG ICON PREVIEW */}
                  {PreviewIcon && (
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-lg"
                      style={{ backgroundColor: form.color + "40" }}>
                      <PreviewIcon width={32} height={32} fill="#333" />
                    </div>
                  )}

                  {/* TEXT */}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {form.name || "Category Name"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit as any}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default CreateCategoryModal;

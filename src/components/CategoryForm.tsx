import React, { useState, useEffect } from "react";
import { Category } from "../types";

interface CategoryFormProps {
  editingCategoryId: number | null;
  initialData: Partial<Category>;
  onSubmit: (categoryData: Omit<Category, "id">) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategoryId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [categoryData, setCategoryData] = useState<Omit<Category, "id">>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (editingCategoryId && initialData) {
      setCategoryData({
        title: initialData.title || "",
        description: initialData.description || "",
      });
    } else {
      setCategoryData({
        title: "",
        description: "",
      });
    }
  }, [editingCategoryId, initialData]);

  const handleChange = (field: keyof Omit<Category, "id">, value: string) => {
    setCategoryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(categoryData);
    setCategoryData({ title: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingCategoryId ? "Edit Category" : "Add New Category"}</h3>
      <input
        placeholder="Category Title"
        value={categoryData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        required
      />
      <textarea
        placeholder="Category Description"
        value={categoryData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        required
      />
      <button type="submit">
        {editingCategoryId ? "Update Category" : "Add Category"}
      </button>
      {editingCategoryId && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default CategoryForm;

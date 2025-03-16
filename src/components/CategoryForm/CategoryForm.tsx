import React, { useState, useEffect } from "react";
import { Category } from "../../types";
import styles from "./CategoryForm.module.scss";

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
    <form className={styles["category-form"]} onSubmit={handleSubmit}>
      <div className={styles["form-control"]}>
        <h3>{editingCategoryId ? "Edit Category" : "Add New Category"}</h3>
        <input
          className={styles["category-input"]}
          placeholder="Category Title"
          value={categoryData.title}
          onChange={(event) => handleChange("title", event.target.value)}
          required
        />
        <textarea
          className={styles["category-textarea"]}
          placeholder="Category Description"
          value={categoryData.description}
          onChange={(event) => handleChange("description", event.target.value)}
          required
          rows={5}
        />
        <div className={styles["form-actions"]}>
          <button className={styles["category-button"]} type="submit">
            {editingCategoryId ? "Update Category" : "Add Category"}
          </button>
          {editingCategoryId && (
            <button
              className={`${styles["category-button"]} ${styles["cancel-button"]}`}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;

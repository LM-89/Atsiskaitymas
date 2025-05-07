import React, { useState, useEffect } from "react";
import { Genre } from "../../types";
import styles from "./GenreForm.module.scss";

interface GenreFormProps {
  editingGenreId: string | null; // Changed from number to string to match MongoDB ObjectId
  initialData: Partial<Genre>;
  onSubmit: (genreData: Omit<Genre, "_id">) => void; // Changed "id" to "_id"
  onCancel: () => void;
}

const GenreForm: React.FC<GenreFormProps> = ({
  editingGenreId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [genreData, setGenreData] = useState<Omit<Genre, "_id">>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (editingGenreId && initialData) {
      setGenreData({
        title: initialData.title || "",
        description: initialData.description || "",
      });
    } else {
      setGenreData({
        title: "",
        description: "",
      });
    }
  }, [editingGenreId, initialData]);

  const handleChange = (field: keyof Omit<Genre, "_id">, value: string) => {
    setGenreData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(genreData);
    setGenreData({ title: "", description: "" });
  };

  return (
    <form className={styles["genre-form"]} onSubmit={handleSubmit}>
      <div className={styles["form-control"]}>
        <h3>{editingGenreId ? "Edit Genre" : "Add New Genre"}</h3>
        <input
          className={styles["genre-input"]}
          placeholder="Genre Title"
          value={genreData.title}
          onChange={(event) => handleChange("title", event.target.value)}
          required
        />
        <textarea
          className={styles["genre-textarea"]}
          placeholder="Genre Description"
          value={genreData.description}
          onChange={(event) => handleChange("description", event.target.value)}
          required
          rows={5}
        />
        <div className={styles["form-actions"]}>
          <button className={styles["genre-button"]} type="submit">
            {editingGenreId ? "Update Genre" : "Add Genre"}
          </button>
          {editingGenreId && (
            <button
              className={`${styles["genre-button"]} ${styles["cancel-button"]}`}
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

export default GenreForm;

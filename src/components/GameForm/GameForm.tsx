import React, { useState, useEffect } from "react";
import { Game, Category } from "../../types";
import styles from "./GameForm.module.scss";

interface GameFormProps {
  editingGameId: number | null;
  initialData: Partial<Game>;
  onSubmit: (gameData: Omit<Game, "id">) => void;
  onCancel: () => void;
  categories: Category[];
}

const GameForm: React.FC<GameFormProps> = ({
  editingGameId,
  initialData,
  onSubmit,
  onCancel,
  categories,
}) => {
  const [gameData, setGameData] = useState<Omit<Game, "id">>({
    title: "",
    categoryId: undefined,
    description: "",
    developer: "",
    price: undefined,
    cover: "",
    release: undefined,
    iframe: "",
  });

  useEffect(() => {
    if (editingGameId && initialData) {
      setGameData({
        title: initialData.title || "",
        categoryId: initialData.categoryId,
        description: initialData.description || "",
        developer: initialData.developer || "",
        price: initialData.price,
        cover: initialData.cover || "",
        release: initialData.release,
        iframe: initialData.iframe || "",
      });
    } else {
      setGameData({
        title: "",
        categoryId: undefined,
        description: "",
        developer: "",
        price: undefined,
        cover: "",
        release: undefined,
        iframe: "",
      });
    }
  }, [editingGameId, initialData]);

  const handleChange = (field: keyof Omit<Game, "id">, value: string) => {
    setGameData((prev) => ({
      ...prev,
      [field]:
        field === "categoryId" || field === "price" || field === "release"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(gameData);
    setGameData({
      title: "",
      categoryId: undefined,
      description: "",
      developer: "",
      price: undefined,
      cover: "",
      release: undefined,
      iframe: "",
    });
  };

  const sortedCategories = categories.sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <form className={styles["game-form"]} onSubmit={handleSubmit}>
      <h3>{editingGameId ? "Edit Game" : "Add New Game"}</h3>
      <div className={styles["form-control"]}>
        <input
          className={styles["game-input"]}
          placeholder="Game Title"
          value={gameData.title}
          onChange={(event) => handleChange("title", event.target.value)}
          required
        />
      </div>
      <div className={styles["form-control"]}>
        <select
          className={styles["game-select"]}
          value={gameData.categoryId !== undefined ? gameData.categoryId : ""}
          onChange={(event) => handleChange("categoryId", event.target.value)}
          required
        >
          <option value="">Select Category</option>
          {sortedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["form-control"]}>
        <textarea
          className={styles["game-textarea"]}
          placeholder="Description"
          value={gameData.description}
          onChange={(event) => handleChange("description", event.target.value)}
          required
          rows={5}
        />
      </div>
      <div className={styles["form-control"]}>
        <input
          className={styles["game-input"]}
          placeholder="Developer"
          value={gameData.developer}
          onChange={(event) => handleChange("developer", event.target.value)}
          required
        />
      </div>
      <div className={styles["form-control"]}>
        <input
          className={styles["game-input"]}
          placeholder="Price"
          type="number"
          value={gameData.price !== undefined ? gameData.price : ""}
          onChange={(event) => handleChange("price", event.target.value)}
          required
        />
      </div>
      <div className={styles["form-control"]}>
        <input
          className={styles["game-input"]}
          placeholder="Cover URL"
          value={gameData.cover}
          onChange={(event) => handleChange("cover", event.target.value)}
          required
        />
      </div>
      <div className={styles["form-control"]}>
        <input
          className={styles["game-input"]}
          placeholder="iFrame URL"
          value={gameData.iframe}
          onChange={(event) => handleChange("iframe", event.target.value)}
          required
        />
      </div>
      <div className={styles["form-control"]}>
        <input
          className={styles["game-input"]}
          placeholder="Release Year"
          type="number"
          value={gameData.release !== undefined ? gameData.release : ""}
          onChange={(event) => handleChange("release", event.target.value)}
          required
        />
      </div>
      <div className={styles["form-actions"]}>
        <button className={styles["game-button"]} type="submit">
          {editingGameId ? "Update Game" : "Add Game"}
        </button>
        {editingGameId && (
          <button
            className={`${styles["game-button"]} ${styles["cancel-button"]}`}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default GameForm;

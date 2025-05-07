import React, { useState, useEffect } from "react";
import { Game, Genre } from "../../types";
import styles from "./GameForm.module.scss";

interface GameFormProps {
  editingGameId: string | null; // Changed from number to string to match MongoDB ObjectId
  initialData: Partial<Game>;
  onSubmit: (gameData: Omit<Game, "_id">) => void; // Changed "id" to "_id"
  onCancel: () => void;
  genres: Genre[];
}

const GameForm: React.FC<GameFormProps> = ({
  editingGameId,
  initialData,
  onSubmit,
  onCancel,
  genres,
}) => {
  const [gameData, setGameData] = useState<Omit<Game, "_id">>({
    title: "",
    genreId: "",
    description: "",
    developer: "",
    price: null,
    cover: "",
    release: null,
    video: "",
  });

  useEffect(() => {
    if (editingGameId && initialData) {
      setGameData({
        title: initialData.title || "",
        genreId: initialData.genreId || "",
        description: initialData.description || "",
        developer: initialData.developer || "",
        price: initialData.price || null,
        cover: initialData.cover || "",
        release: initialData.release || null,
        video: initialData.video || "",
      });
    } else {
      setGameData({
        title: "",
        genreId: "",
        description: "",
        developer: "",
        price: null,
        cover: "",
        release: null,
        video: "",
      });
    }
  }, [editingGameId, initialData]);

  const handleChange = (field: keyof Omit<Game, "_id">, value: string) => {
    setGameData((prev) => ({
      ...prev,
      [field]:
        field === "price" || field === "release"
          ? value === "" ? null : Number(value)
          : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(gameData);
    setGameData({
      title: "",
      genreId: "",
      description: "",
      developer: "",
      price: null,
      cover: "",
      release: null,
      iframe: "",
    });
  };

  const sortedGenres = genres.sort((a, b) => a.title.localeCompare(b.title));

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
          value={gameData.genreId}
          onChange={(event) => handleChange("genreId", event.target.value)}
          required
        >
          <option value="">Select Genre</option>
          {sortedGenres.map((genre) => (
            <option key={genre._id} value={genre._id}>
              {genre.title}
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
          value={gameData.price !== null ? gameData.price : ""}
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
          placeholder="video URL"
          value={gameData.video}
          onChange={(event) => handleChange("video", event.target.value)}
          required
        />
      </div>
      <div className={styles["form-control"]}>
        <input
          className={styles["game-input"]}
          placeholder="Release Year"
          type="number"
          value={gameData.release !== null ? gameData.release : ""}
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

import { useEffect, useRef, useState, useMemo } from "react";
import {
  getGames,
  getGenres,
  getUsers,
  addGame,
  updateGame,
  deleteGame,
  addGenre, 
  updateGenre,
  deleteGenre,
  updateUserRole,
  deleteUser,
} from "../../api/api";
import { useData } from "../../context/DataContext";
import { Game, Genre } from "../../types";
import GameForm from "../../components/GameForm/GameForm";
import GenreForm from "../../components/GenreForm/GenreForm";
import styles from "./AdminPanel.module.scss";
import "../../App.scss";

const AdminPanel = () => {
  const { state, dispatch } = useData();
  const { auth, games, genres, users } = state;
  const { user, token } = auth;

  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [editingGenreId, setEditingGenreId] = useState<number | null>(null);

  const gameFormRef = useRef<HTMLDivElement>(null);
  const genreFormRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      try {
        const gamesData = await getGames();
        dispatch({ type: "SET_GAMES", payload: gamesData });

        const genresData = await getGenres();
        dispatch({ type: "SET_GENRES", payload: genresData });
        const usersData = await getUsers(token);
        dispatch({ type: "SET_USERS", payload: usersData });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [dispatch, token]);

  const handleAddOrUpdateGame = async (gameData: Omit<Game, "_id">) => {
    if (!user || !token) return;
    if (editingGameId) {
      try {
        await updateGame(editingGameId, gameData, token);
        dispatch({
          type: "UPDATE_GAME",
          payload: { _id: editingGameId, ...gameData } as Game,
        });
        setEditingGameId(null);
      } catch (error) {
        console.error("Error updating game:", error);
      }
    } else {
      try {
        const addedGame = await addGame(gameData, token);
        dispatch({ type: "ADD_GAME", payload: addedGame });
      } catch (error) {
        console.error("Error adding game:", error);
      }
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!user || !token) return;
    try {
      await deleteGame(gameId, token);
      dispatch({ type: "DELETE_GAME", payload: gameId });
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  const handleAddOrUpdateGenre = async (genreData: Omit<Genre, "id">) => {
    if (!user || !token) return;
    if (editingGenreId) {
      try {
        await updateGenre(editingGenreId, genreData, token); 
        dispatch({
          type: "UPDATE_GENRE",
          payload: { id: editingGenreId, ...genreData } as Genre,
        });
        setEditingGenreId(null);
      } catch (error) {
        console.error("Error updating genre:", error);
      }
    } else {
      try {
        const addedGenre = await addGenre(genreData, token); 
        dispatch({ type: "ADD_GENRE", payload: addedGenre }); 
      } catch (error) {
        console.error("Error adding genre:", error);
      }
    }
  };

  const handleDeleteGenre = async (genreId: number) => {
    if (!user || !token) return;
    try {
      await deleteGenre(genreId, token);
      dispatch({ type: "DELETE_GENRE", payload: genreId });
    } catch (error) {
      console.error("Error deleting genre:", error);
    }
  };

  const handleChangeUserRole = async (userId: number, newRole: "admin" | "user") => {
    if (!user || !token) return;
    try {
      const updatedUser = await updateUserRole(userId, newRole, token);
      const updatedUsers = users.map((u) => (u.id === userId ? updatedUser : u));
      dispatch({ type: "SET_USERS", payload: updatedUsers });
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      dispatch({ type: "DELETE_USER", payload: userId });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const sortedGenres = useMemo(() => [...genres].sort((a, b) => a.title.localeCompare(b.title)), [genres]);
  const sortedGames = useMemo(() => [...games].sort((a, b) => a.title.localeCompare(b.title)), [games]);
  const sortedUsers = useMemo(() => [...users].sort((a, b) => (a.name || "").localeCompare(b.name || "")), [users]);

  if (!user || user.role !== "ADMIN") {
    return <p>Access denied. You do not have permission to view this page.</p>;
  }

  return (
    <div className={`${styles["admin-panel"]} content-container`}>
      <h2 className={styles["heading"]}>Admin Panel</h2>

      <div className={styles["forms-container"]}>
        <div ref={gameFormRef} className={styles["game-form-container"]}>
          <GameForm
            key={editingGameId ?? "new"}
            editingGameId={editingGameId}
            initialData={
              editingGameId
                ? games.find((game) => game.id === editingGameId) || {}
                : {}
            }
            onSubmit={handleAddOrUpdateGame}
            onCancel={() => setEditingGameId(null)}
            genres={genres} 
          />
        </div>

        <div ref={genreFormRef} className={styles["genre-form-container"]}>
          <GenreForm
            key={editingGenreId ?? "new"} 
            editingGenreId={editingGenreId} 
            initialData={
              editingGenreId
                ? genres.find((genre) => genre.id === editingGenreId) || {} 
                : {}
            }
            onSubmit={handleAddOrUpdateGenre} 
            onCancel={() => setEditingGenreId(null)} 
          />
        </div>
      </div>

      <div className={styles["genres-section"]}> 
        <h3 className={styles["lower-headings"]}>Genres</h3>
        {sortedGenres.map((genre) => ( 
          <div key={genre.id} className={styles["genre-item"]}> 
            <span>
              {genre.title}. {genre.description} 
            </span>
            <div className={styles["action-control"]}>
              <button className={styles["edit-button"]} onClick={() => setEditingGenreId(genre.id)}> 
                Edit
              </button>
              <button
                className={`${styles["delete-btn"]} delete-button`}
                onClick={() => handleDeleteGenre(genre.id)} 
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles["users-games"]}>
        <div className={styles["games-section"]}>
          <h3 className={styles["lower-headings"]}>Games</h3>
          {sortedGames.map((game) => (
            <div key={game.id} className={styles["game-item"]}>
              <span>{game.title}</span>
              <div className={styles["action-control"]}>
                <button className={styles["edit-button"]} onClick={() => setEditingGameId(game.id)}>
                  Edit
                </button>
                <button
                  className={`${styles["delete-btn"]} delete-button`}
                  onClick={() => handleDeleteGame(game.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles["users-section"]}>
          <h3 className={styles["lower-headings"]}>Users</h3>
          {sortedUsers.map((u) => (
            <div key={u.id} className={styles["user-item"]}>
              <span>
                {u.name} {u.surname} ({u.email} - {u.role})
              </span>
              <div className={styles["action-control"]}>
                <button
                  className={styles["change-role-button"]}
                  onClick={() => handleChangeUserRole(u.id, u.role === "admin" ? "user" : "admin")}
                >
                  Change Role
                </button>
                <button
                  className={`${styles["delete-btn"]} delete-button`}
                  onClick={() => handleDeleteUser(u.id)}
                >
                  Delete User
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

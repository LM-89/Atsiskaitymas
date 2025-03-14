import { useEffect, useRef, useState, useMemo } from "react";
import {
  getGames,
  getCategories,
  getUsers,
  addGame,
  updateGame,
  deleteGame,
  addCategory,
  updateCategory,
  deleteCategory,
  updateUserRole,
  deleteUser,
} from "../api/api";
import { useData } from "../context/DataContext";
import { Game, Category } from "../types";
import GameForm from "../components/GameForm";
import CategoryForm from "../components/CategoryForm";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
  const { state, dispatch } = useData();
  const { auth, games, categories, users } = state;
  const { user, token } = auth;

  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const gameFormRef = useRef<HTMLDivElement>(null);
  const categoryFormRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const loadData = async () => {
      try {
        const gamesData = await getGames();
        dispatch({ type: "SET_GAMES", payload: gamesData });

        const categoriesData = await getCategories();
        dispatch({ type: "SET_CATEGORIES", payload: categoriesData });

        const usersData = await getUsers();
        dispatch({ type: "SET_USERS", payload: usersData });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [dispatch]);

 
  const handleAddOrUpdateGame = async (gameData: Omit<Game, "id">) => {
    if (!user || !token) return;
    if (editingGameId) {
      try {
        await updateGame(editingGameId, gameData, token);
        dispatch({
          type: "UPDATE_GAME",
          payload: { id: editingGameId, ...gameData } as Game,
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


  const handleDeleteGame = async (gameId: number) => {
    if (!user || !token) return;
    try {
      await deleteGame(gameId, token);
      dispatch({ type: "DELETE_GAME", payload: gameId });
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };


  const handleEditGame = (game: Game) => {
    setEditingGameId(game.id);
    gameFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const cancelGameEdit = () => {
    setEditingGameId(null);
  };

 
  const handleAddOrUpdateCategory = async (categoryData: Omit<Category, "id">) => {
    if (!user || !token) return;
    if (editingCategoryId) {
      try {
        await updateCategory(editingCategoryId, categoryData, token);
        dispatch({
          type: "UPDATE_CATEGORY",
          payload: { id: editingCategoryId, ...categoryData },
        });
        setEditingCategoryId(null);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    } else {
      try {
        const addedCategory = await addCategory(categoryData, token);
        dispatch({ type: "ADD_CATEGORY", payload: addedCategory });
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };


  const handleDeleteCategory = async (categoryId: number) => {
    if (!user || !token) return;
    try {
      await deleteCategory(categoryId, token);
      dispatch({ type: "DELETE_CATEGORY", payload: categoryId });
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };


  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    categoryFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const cancelCategoryEdit = () => {
    setEditingCategoryId(null);
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


  const handleDeleteUser = async (userId: number) => {
    if (!user || !token) return;
    if (user.id === userId) {
      alert("You cannot delete your own account.");
      return;
    }
    try {
      await deleteUser(userId, token);
      dispatch({ type: "SET_USERS", payload: users.filter((u) => u.id !== userId) });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  
  const sortedCategories = useMemo(() => [...categories].sort((a, b) => a.title.localeCompare(b.title)), [categories]);
  const sortedGames = useMemo(() => [...games].sort((a, b) => a.title.localeCompare(b.title)), [games]);
  const sortedUsers = useMemo(() => [...users].sort((a, b) => (a.name || "").localeCompare(b.name || "")), [users]);


  if (!user || user.role !== "admin") {
    return <p>Access denied.</p>;
  }

  return (
    <div className={styles["admin-panel"]}>
      <div className={styles["admin-panel-inner-part"]}>
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
              onCancel={cancelGameEdit}
              categories={categories}
            />
          </div>

          <div ref={categoryFormRef} className={styles["category-form-container"]}>
            <CategoryForm
              key={editingCategoryId ?? "new"}
              editingCategoryId={editingCategoryId}
              initialData={
                editingCategoryId
                  ? categories.find((category) => category.id === editingCategoryId) || {}
                  : {}
              }
              onSubmit={handleAddOrUpdateCategory}
              onCancel={cancelCategoryEdit}
            />
          </div>
        </div>

        <div className={styles["categories-section"]}>
          <h3 className={styles["lower-headings"]}>Categories</h3>
          {sortedCategories.map((category) => (
            <div key={category.id} className={styles["category-item"]}>
              <span>
                {category.title}. {category.description}
              </span>
              <div className={styles["action-control"]}>
                <button className={styles["edit-button"]} onClick={() => handleEditCategory(category)}>
                  Edit
                </button>
                <button className={styles["delete-button"]} onClick={() => handleDeleteCategory(category.id)}>
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
                  <button className={styles["edit-button"]} onClick={() => handleEditGame(game)}>
                    Edit
                  </button>
                  <button className={styles["delete-button"]} onClick={() => handleDeleteGame(game.id)}>
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
                  <button className={styles["delete-button"]} onClick={() => handleDeleteUser(u.id)}>
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

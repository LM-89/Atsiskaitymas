import { useState, useEffect } from "react";
import {
  getGames,
  addGame,
  updateGame,
  deleteGame,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  updateUserRole,
  deleteUser,
} from "../api/api";
import { useData } from "../context/DataContext";
import { Game, Category } from "../types";
import GameForm from "../components/GameForm";
import CategoryForm from "../components/CategoryForm";

const AdminPanel = () => {
  const { state, dispatch } = useData();
  const { auth, games, categories, users } = state;
  const { user, token } = auth;

  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

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
        dispatch({ type: "UPDATE_GAME", payload: { id: editingGameId, ...gameData } as Game });
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
  };

  const cancelCategoryEdit = () => {
    setEditingCategoryId(null);
  };

  const handleChangeUserRole = async (userId: number, newRole: "admin" | "user") => {
    if (!user || !token) return;
    try {
      const updatedUser = await updateUserRole(userId, newRole, token);
      dispatch({
        type: "SET_USERS",
        payload: users.map((u) => (u.id === userId ? updatedUser : u)),
      });
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!user || !token) return;
    try {
      if (user.id === userId) {
        alert("You cannot delete your own account.");
        return;
      }
      await deleteUser(userId, token);
      dispatch({
        type: "SET_USERS",
        payload: users.filter((u) => u.id !== userId),
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!user || user.role !== "admin") {
    return <p>Access denied.</p>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>

      <GameForm
        key={editingGameId ?? "new"}
        editingGameId={editingGameId}
        initialData={editingGameId ? games.find((g) => g.id === editingGameId) || {} : {}}
        onSubmit={handleAddOrUpdateGame}
        onCancel={cancelGameEdit}
        categories={categories}
      />

      <CategoryForm
        key={editingCategoryId ?? "new"}
        editingCategoryId={editingCategoryId}
        initialData={
          editingCategoryId ? categories.find((cat) => cat.id === editingCategoryId) || {} : {}
        }
        onSubmit={handleAddOrUpdateCategory}
        onCancel={cancelCategoryEdit}
      />

      <div>
        <h3>Categories</h3>
        {categories.map((category) => (
          <div key={category.id}>
            <span>
              {category.title}. {category.description}
            </span>
            <button onClick={() => handleEditCategory(category)}>Edit</button>
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Games</h3>
        {games.map((game) => (
          <div key={game.id}>
            <span>{game.title}</span>
            <button onClick={() => handleEditGame(game)}>Edit</button>
            <button onClick={() => handleDeleteGame(game.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Users</h3>
        {users.map((usr) => (
          <div key={usr.id}>
            <span>
              {usr.name} {usr.surname} ({usr.email} - {usr.role})
            </span>
            <button
              onClick={() =>
                handleChangeUserRole(usr.id, usr.role === "admin" ? "user" : "admin")
              }
            >
              Change Role
            </button>
            <button onClick={() => handleDeleteUser(usr.id)}>Delete User</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

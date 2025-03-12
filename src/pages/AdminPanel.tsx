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
} from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Game, Category, User } from "../types";

const AdminPanel = () => {
  const { user, token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newGame, setNewGame] = useState<Omit<Game, "id">>({
    title: "",
    categoryId: undefined,
    description: "",
    developer: "",
    price: undefined,
    cover: "",
    release: undefined,
  });
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({
    title: "",
    description: "",
  });

 
  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const gamesData = await getGames();
      setGames(gamesData);

      const categoriesData = await getCategories();
      setCategories(categoriesData);

      const usersData = await getUsers();
      setUsers(usersData);
    };

    loadData();
  }, []);

  const handleAddGame = async () => {
    if (!user || !token) return;
    if (
      !newGame.title ||
      !newGame.categoryId ||
      !newGame.description ||
      !newGame.developer ||
      !newGame.price ||
      !newGame.cover ||
      !newGame.release
    ) {
      alert("All fields must be filled before adding a game.");
      return;
    }

    const addedGame = await addGame(newGame, token);
    setGames([...games, addedGame]);
    setNewGame({
      title: "",
      categoryId: undefined,
      description: "",
      developer: "",
      price: undefined,
      cover: "",
      release: undefined,
    });
  };

  const handleAddCategory = async () => {
    if (!user || !token) return;
    if (!newCategory.title || !newCategory.description) {
      alert("All fields must be filled before adding a category.");
      return;
    }

    const addedCategory = await addCategory(newCategory, token);
    setCategories([...categories, addedCategory]);
    setNewCategory({
      title: "",
      description: "",
    });
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (user && token) {
      await deleteCategory(categoryId, token);
      setCategories(categories.filter((category) => category.id !== categoryId));
    }
  };

  const handleUpdateGame = async (gameId: number, updatedData: Partial<Game>) => {
    if (user && token) {
      await updateGame(gameId, updatedData, token);
      setGames(
        games.map((game) =>
          game.id === gameId ? { ...game, ...updatedData } : game
        )
      );
      setEditingGameId(null);
      setNewGame({
        title: "",
        categoryId: undefined,
        description: "",
        developer: "",
        price: undefined,
        cover: "",
        release: undefined,
      });
    }
  };

  const handleDeleteGame = async (gameId: number) => {
    if (user && token) {
      await deleteGame(gameId, token);
      setGames(games.filter((game) => game.id !== gameId));
    }
  };

  const handleChangeUserRole = async (
    userId: number,
    newRole: "admin" | "user"
  ) => {
    if (user && token) {
      const updatedUser = await updateUserRole(userId, newRole, token);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGameId(game.id);
    setNewGame({
      title: game.title,
      categoryId: game.categoryId,
      description: game.description,
      developer: game.developer,
      price: game.price,
      cover: game.cover,
      release: game.release,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditGame = () => {
    setEditingGameId(null);
    setNewGame({
      title: "",
      categoryId: undefined,
      description: "",
      developer: "",
      price: undefined,
      cover: "",
      release: undefined,
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setNewCategory({
      title: category.title,
      description: category.description,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setNewCategory({
      title: "",
      description: "",
    });
  };

  const handleUpdateCategory = async () => {
    if (user && token && editingCategoryId !== null) {
      await updateCategory(editingCategoryId, newCategory, token);
      setCategories(
        categories.map((category) =>
          category.id === editingCategoryId ? { ...category, ...newCategory } : category
        )
      );
      
      setEditingCategoryId(null);
      setNewCategory({
        title: "",
        description: "",
      });
    }
  };

  if (!user || user.role !== "admin") {
    return <p>Access denied.</p>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>

      
      <div>
        <h3>{editingGameId ? "Edit Game" : "Add New Game"}</h3>
        <form>
          <input
            placeholder="Game Title"
            value={newGame.title}
            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
            required
          />
          <input
            placeholder="Category ID"
            value={newGame.categoryId ?? ""}
            onChange={(e) =>
              setNewGame({ ...newGame, categoryId: Number(e.target.value) })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={newGame.description}
            onChange={(e) =>
              setNewGame({ ...newGame, description: e.target.value })
            }
            required
          />
          <input
            placeholder="Developer"
            value={newGame.developer}
            onChange={(e) =>
              setNewGame({ ...newGame, developer: e.target.value })
            }
            required
          />
          <input
            placeholder="Price"
            type="number"
            value={newGame.price ?? ""}
            onChange={(e) =>
              setNewGame({ ...newGame, price: Number(e.target.value) })
            }
            required
          />
          <input
            placeholder="Cover URL"
            value={newGame.cover}
            onChange={(e) => setNewGame({ ...newGame, cover: e.target.value })}
            required
          />
          <input
            placeholder="Release Year"
            type="number"
            value={newGame.release ?? ""}
            onChange={(e) =>
              setNewGame({ ...newGame, release: Number(e.target.value) })
            }
            required
          />
          <button
            type="button"
            onClick={editingGameId ? () => handleUpdateGame(editingGameId, newGame) : handleAddGame}
            disabled={
              !newGame.title ||
              !newGame.categoryId ||
              !newGame.description ||
              !newGame.developer ||
              !newGame.price ||
              !newGame.cover ||
              !newGame.release
            }
          >
            {editingGameId ? "Update Game" : "Add Game"}
          </button>
          {editingGameId && (
            <button type="button" onClick={handleCancelEditGame}>
              Cancel
            </button>
          )}
        </form>
      </div>

     
      <div>
        <h3>{editingCategoryId ? "Edit Category" : "Add New Category"}</h3>
        <form>
          <input
            placeholder="Category Title"
            value={newCategory.title}
            onChange={(e) =>
              setNewCategory({ ...newCategory, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Category Description"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}
            disabled={!newCategory.title || !newCategory.description}
          >
            {editingCategoryId ? "Update Category" : "Add Category"}
          </button>
          {editingCategoryId && (
            <button type="button" onClick={handleCancelEditCategory}>
              Cancel
            </button>
          )}
        </form>
      </div>

     
      <div>
        <h3>Categories</h3>
        {categories.map((category) => (
          <div key={category.id}>
            <span>{category.title}. {category.description}</span>
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
        {users.map((user) => (
          <div key={user.id}>
            <span>{user.name} {user.surname} ({user.email} ({user.role}))</span>
            <button
              onClick={() => handleChangeUserRole(user.id, user.role === "admin" ? "user" : "admin")}
            >
              Change Role
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

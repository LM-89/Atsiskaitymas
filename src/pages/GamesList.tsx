import { useState, useEffect } from "react";
import { API_URL, getGames, getGameReviews } from "../api/api";
import { Link } from "react-router-dom";
import { Game, User } from "../types";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Category {
  id: number;
  title: string;
}

const GamesList = () => {
  const { user: currentUser } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ratings, setRatings] = useState<{ [gameId: number]: string }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");

  useEffect(() => {
    const loadGamesAndCategories = async () => {
      try {
        const gamesData = await getGames();
        const categoriesResponse = await axios.get(`${API_URL}/categories`);
        setGames(gamesData);
        setCategories(categoriesResponse.data);

        const gameRatings: { [gameId: number]: string } = {};
        for (const game of gamesData) {
          const averageRating = await getAverageRating(game.id);
          gameRatings[game.id] = averageRating;
        }
        setRatings(gameRatings);
      } catch (error) {
        console.error("Error loading games or categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadGamesAndCategories();
    loadUsers();
  }, []);

  const getCategoryName = (categoryId?: number) => {
    return categories.find((category) => category.id === categoryId)?.title || "Unknown";
  };

  const getAverageRating = async (gameId: number) => {
    try {
      const reviews = await getGameReviews(gameId);
      if (reviews.length === 0) return "Not Rated Yet";
      const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      return average.toFixed(1);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return "Not Rated Yet";
    }
  };


  const filteredGames =
    selectedCategory === "all"
      ? games
      : games.filter((game) => game.categoryId === selectedCategory);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className="games-list-container" style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: 1 }}>
        <h2>Games:</h2>

        
        <label htmlFor="categoryFilter">Filter by Category: </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value === "all" ? "all" : parseInt(e.target.value))
          }
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>

        {filteredGames.length === 0 ? (
          <p>No games added to this category yet...</p>
        ) : (
          <ul>
            {filteredGames.map((game) => (
              <li key={game.id}>
                <Link to={`/game/${game.id}`}>
                  <img src={game.cover} alt={game.title} width={100} />
                  <h3>{game.title}</h3>
                  {game.developer && <p>Developer: {game.developer}</p>}
                  <p>{game.description}</p>
                  <p>Category: {getCategoryName(game.categoryId)}</p>
                  {game.release && <p>Release Date: {game.release}</p>}
                  {game.price && <p>Price: {game.price} €</p>}
                  <p>Rating: {ratings[game.id] || "Not Rated Yet"}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      
      <div style={{ flex: 0.3 }}>
        <h2>Users:</h2>
        <ul>
          {users.map((usr) => (
            <li key={usr.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {usr.avatar ? (
                <img
                  src={usr.avatar}
                  alt={usr.nickname}
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#ccc",
                    borderRadius: "50%",
                  }}
                ></div>
              )}

              <Link to={`/user/${usr.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span>{usr.nickname}</span>
              </Link>

              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: currentUser?.id === usr.id ? "green" : "gray",
                }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GamesList;

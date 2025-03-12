import { useEffect, useState } from "react";
import { API_URL, getGames, getGameReviews } from "../api/api";
import { Link } from "react-router-dom";
import axios from "axios";
import { useData } from "../context/DataContext";
import { Game, User, Category, Review } from "../types";

const GamesList = () => {
  const { state, dispatch } = useData();
  const { games, categories, users, reviews } = state;
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gamesData = await getGames();
        dispatch({ type: "SET_GAMES", payload: gamesData });

        const categoriesResponse = await axios.get(`${API_URL}/categories`);
        dispatch({ type: "SET_CATEGORIES", payload: categoriesResponse.data });

        const usersResponse = await axios.get(`${API_URL}/users`);
        dispatch({ type: "SET_USERS", payload: usersResponse.data });

        for (const game of gamesData) {
          const reviewsData = await getGameReviews(game.id);
          dispatch({ type: "SET_REVIEWS", payload: { gameId: game.id, reviews: reviewsData } });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const getCategoryName = (categoryId?: number) => {
    return categories.find((cat: Category) => cat.id === categoryId)?.title || "Unknown";
  };

  const getAverageRating = (gameId: number) => {
    const gameReviews: Review[] = reviews[gameId] || [];
    if (gameReviews.length === 0) return "Not Rated Yet";
    const average = gameReviews.reduce((sum, review) => sum + review.rating, 0) / gameReviews.length;
    return average.toFixed(1);
  };

  const filteredGames =
    selectedCategory === "all" ? games : games.filter((game: Game) => game.categoryId === selectedCategory);

  if (localLoading) {
    return <div>Loading...</div>;
  }

  return (
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
          {categories.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
        {filteredGames.length === 0 ? (
          <p>No games added to this category yet...</p>
        ) : (
          <ul>
            {filteredGames.map((game: Game) => (
              <li key={game.id}>
                <Link to={`/game/${game.id}`}>
                  <img src={game.cover} alt={game.title} width={100} />
                  <h3>{game.title}</h3>
                  {game.developer && <p>Developer: {game.developer}</p>}
                  <p>{game.description}</p>
                  <p>Category: {getCategoryName(game.categoryId)}</p>
                  {game.release && <p>Release Date: {game.release}</p>}
                  {game.price && <p>Price: {game.price} €</p>}
                  <p>Rating: {getAverageRating(game.id)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ flex: 0.3 }}>
        <h2>Users:</h2>
        <ul>
          {users.map((usr: User) => (
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
                  backgroundColor: state.auth.user?.id === usr.id ? "green" : "gray",
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

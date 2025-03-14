import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, getGames, getGameReviews } from "../api/api";
import { useData } from "../context/DataContext";
import { Game, User, Category, Review } from "../types";
import styles from "./GamesList.module.css";

const GamesList = () => {
  const { state, dispatch } = useData();
  const { games, categories, users, reviews } = state;

  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [localLoading, setLocalLoading] = useState(true);

  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);

  
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

  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const container = containerRef.current;
    const tracker = trackerRef.current;
    if (!container || !tracker) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tracker.style.left = `${x}px`;
    tracker.style.top = `${y}px`;
  };


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

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.title.localeCompare(b.title)),
    [categories]
  );
  const sortedGames = useMemo(
    () => [...filteredGames].sort((a, b) => a.title.localeCompare(b.title)),
    [filteredGames]
  );
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.nickname.localeCompare(b.nickname)),
    [users]
  );

  if (localLoading) {
    return (
      <div className={styles["loading"]}>
        <div className={styles["spinner"]}></div>
      </div>
    );
  }

  return (
    <div className={styles["main-content-container"]}>
      <div
        className={styles["main-games-container"]}
        ref={containerRef}
        style={{ position: "relative" }}
        onMouseMove={handleMouseMove}
      >
        
        <div className={styles["mouse-tracker"]} ref={trackerRef}></div>

        <h2 className={styles["section-title"]}>Games:</h2>
        <label htmlFor="categoryFilter">Filter by Category: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value === "all" ? "all" : parseInt(event.target.value))
          }
          className={styles["category-filter"]}
        >
          <option value="all">All Categories</option>
          {sortedCategories.map((category: Category) => (
            <option key={category.id} value={category.id} className={styles["option"]}>
              {category.title}
            </option>
          ))}
        </select>
        {sortedGames.length === 0 ? (
          <p>No games added to this category yet...</p>
        ) : (
          <ul className={styles["games-ul-container"]}>
            {sortedGames.map((game: Game) => (
              <Link to={`/game/${game.id}`} className={styles["game-link"]} key={game.id}>
                <li className={styles["games-list-item"]}>
                  <div className={styles["game-cover-container"]}>
                    <img src={game.cover} alt={game.title} className={styles["game-cover-img"]} />
                  </div>
                  <h3 className={styles["game-title"]}>{game.title}</h3>
                  <p className={styles["average-rating"]}>Rating: {getAverageRating(game.id)}</p>
                  <p>Category: {getCategoryName(game.categoryId)}</p>
                  {game.release && <p className={styles["release-date"]}>Release Date: {game.release}</p>}
                  {game.price && <p className={styles["game-price"]}>Price: {game.price} €</p>}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
      <div className={styles["main-users-container"]}>
        <h2 className={styles["section-title"]}>Users:</h2>
        <ul className={styles["users-list"]}>
          {sortedUsers.map((user: User) => (
            <li key={user.id} className={styles["users-list-item"]}>
              <div
                className={`${styles["user-status-indicator"]} ${
                  state.auth.user?.id === user.id ? styles["online"] : styles["offline"]
                }`}
              />
              {user.avatar ? (
                <img src={user.avatar} alt={user.nickname} className={styles["user-avatar"]} />
              ) : (
                <div className={styles["user-avatar-placeholder"]}></div>
              )}
              <Link to={`/user/${user.id}`} className={styles["user-link"]}>
                <span>{user.nickname}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GamesList;

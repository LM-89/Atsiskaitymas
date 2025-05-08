import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getGames, getGenres, getUsers } from "../../api/api";
import { useData } from "../../context/DataContext";
import { Game, Genre, User, Review } from "../../types";
import styles from "./GamesList.module.scss";

const GamesList = () => {
  const { state, dispatch } = useData();
  const { games, genres, users, reviews } = state;

  const [localLoading, setLocalLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const gamesData = await getGames();
        dispatch({ type: "SET_GAMES", payload: gamesData });

        const genresData = await getGenres();
        dispatch({ type: "SET_GENRES", payload: genresData });

        const usersData = await getUsers(); 
        dispatch({ type: "SET_USERS", payload: usersData });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const getGenreName = (genreId?: string) => {
    return genres.find((genre: Genre) => genre._id === genreId)?.title || "Unknown";
  };

  const getAverageRating = (gameId: string) => {
    const gameReviews: Review[] = reviews[gameId] || [];
    if (gameReviews.length === 0) return "Not Rated Yet";
    const average = gameReviews.reduce((sum, review) => sum + review.rating, 0) / gameReviews.length;
    return average.toFixed(1);
  };

  const filteredGames =
    selectedGenre === "all"
      ? games
      : games.filter((game: Game) => game.genres.includes(selectedGenre));

  const sortedGenres = useMemo(() => [...genres].sort((a, b) => a.title.localeCompare(b.title)), [genres]);
  const sortedGames = useMemo(
    () => [...filteredGames].sort((a, b) => a.title.localeCompare(b.title)),
    [filteredGames]
  );
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.username.localeCompare(b.username)),
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
    <div className={`${styles["main-content-container"]} content-container`}>
      <div className={styles["main-games-container"]}>
        <h2 className={styles["section-title"]}>Games:</h2>
        <label htmlFor="genre-filter">Filter by Genre: </label>
        <select
          id="genre-filter"
          value={selectedGenre}
          onChange={(event) => setSelectedGenre(event.target.value)}
          className={styles["genre-filter"]}
        >
          <option value="all">All Genres</option>
          {sortedGenres.map((genre: Genre) => (
            <option key={genre._id} value={genre._id} className={styles["option"]}>
              {genre.title}
            </option>
          ))}
        </select>
        {sortedGames.length === 0 ? (
          <p>No games added to this genre yet...</p>
        ) : (
          <ul className={styles["games-ul-container"]}>
            {sortedGames.map((game: Game) => (
              <Link to={`/game/${game._id}`} className={styles["game-link"]} key={game._id}>
                <li className={styles["games-list-item"]}>
                  <div className={styles["game-cover-container"]}>
                    <img src={game.cover} alt={game.title} className={styles["game-cover-img"]} />
                  </div>
                  <h3 className={styles["game-title"]}>{game.title}</h3>
                  <p className={styles["average-rating"]}>Rating: {getAverageRating(game._id)}</p>
                  <p>Genre: {game.genres.map(getGenreName).join(", ")}</p>
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
            <li key={user._id} className={styles["users-list-item"]}>
              <div
                className={`${styles["user-status-indicator"]} ${
                  user.status === "online" ? styles["online"] : styles["offline"]
                }`}
              />
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className={styles["user-avatar"]} />
              ) : (
                <div className={styles["user-avatar-placeholder"]}></div>
              )}
              <Link to={`/user/${user._id}`} className={styles["user-link"]}>
                <span>{user.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GamesList;

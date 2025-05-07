import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useData } from "../../context/DataContext";
import { getGames, getGameReviews, getUsers } from "../../api/api";
import { useReviewHandlers } from "../../context/useReviewHandlers";
import { Review, Genre, NewReview } from "../../types";
import styles from "./GameDetails.module.scss";
import "../../App.scss";

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state, dispatch } = useData();
  const { games, genres, reviews, users } = state;
  const { addReviewHandler, updateReviewHandler, deleteReviewHandler } = useReviewHandlers();

  const game = games.find((g) => g._id === gameId) || null;

  const [newReviewData, setNewReviewData] = useState({ rating: 3.0, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReviewData, setEditReviewData] = useState({ rating: 3.0, comment: "" });
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState("Not Rated Yet");

  const gameReviews = useMemo(() => reviews[gameId] || [], [reviews, gameId]);

  const enrichedReviews = useMemo(() => {
    return gameReviews.map((review) => {
      const userData = users.find((u) => u._id === review.userId);
      return { ...review, user: userData || review.user };
    });
  }, [gameReviews, users]);

  const refreshReviews = async () => {
    try {
      const reviewsData = await getGameReviews(gameId!);
      dispatch({ type: "SET_REVIEWS", payload: { gameId, reviews: reviewsData } });
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!game) {
        setLoading(true);
        try {
          const gamesData = await getGames();
          dispatch({ type: "SET_GAMES", payload: gamesData });
        } catch (err) {
          console.error("Error fetching games", err);
        }
        setLoading(false);
      }
      setLoading(true);
      try {
        const reviewsData = await getGameReviews(gameId!);
        dispatch({ type: "SET_REVIEWS", payload: { gameId, reviews: reviewsData } });
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
      setLoading(false);
    };
    loadData();
  }, [game, gameId, dispatch]);

  useEffect(() => {
    if (users.length === 0) {
      getUsers()
        .then((usersData) => dispatch({ type: "SET_USERS", payload: usersData }))
        .catch((err) => console.error("Error fetching users", err));
    }
  }, [users, dispatch]);

  useEffect(() => {
    if (gameReviews.length > 0) {
      const total = gameReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating((total / gameReviews.length).toFixed(1));
    } else {
      setAverageRating("Not Rated Yet");
    }
  }, [gameReviews]);

  const handleAddReview = async () => {
    const reviewPayload: NewReview = {
      gameId: gameId!,
      userId: state.auth.user?._id || "",
      rating: newReviewData.rating,
      comment: newReviewData.comment,
    };
    await addReviewHandler(reviewPayload);
    await refreshReviews();
    setNewReviewData({ rating: 3.0, comment: "" });
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review._id);
    setEditReviewData({ rating: review.rating, comment: review.comment });
  };

  const handleSaveEdit = async (reviewId: string) => {
    await updateReviewHandler(gameId!, reviewId, {
      rating: editReviewData.rating,
      comment: editReviewData.comment,
    });
    await refreshReviews();
    setEditingReviewId(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReviewHandler(gameId!, reviewId);
    await refreshReviews();
  };

  if (loading) {
    return <p>Loading game details...</p>;
  }

  if (!game) {
    return <p>Game not found</p>;
  }

  return (
    <div className={`${styles["game-details-container"]} content-container`}>
      <div className={styles["game-details-top"]}>
        <div className={styles["game-cover-container"]}>
          <img className={styles["game-cover"]} src={game.cover} alt={game.title} />
        </div>
        <div className={styles["game-details"]}>
          <h2>{game.title}</h2>
          <p>
            <strong>Genre:</strong>{" "}
            {genres.find((genre: Genre) => genre._id === game.genreId)?.title || "Unknown"}
          </p>
          <p>
            <strong>Description:</strong> {game.description}
          </p>
          <p>
            <strong>Developer:</strong> {game.developer}
          </p>
          <p>
            <strong>Release Date:</strong> {game.release}
          </p>
          <p>
            <strong>Average Rating:</strong> {averageRating} ⭐
          </p>
        </div>
        <div className={styles["game-trailer-container"]}>
          <iframe
            src={game.iframe}
            allowFullScreen
            title={game.title}
            className={styles["game-iframe"]}
          ></iframe>
        </div>
      </div>

      <div className={styles["reviews-section"]}>
        <h2>Reviews:</h2>
        {enrichedReviews.length > 0 ? (
          enrichedReviews.map((review) => (
            <div key={review._id} className={styles["review-item"]}>
              <div className={styles["review-user-info"]}>
                {review.user ? (
                  <Link to={`/user/${review.user._id}`} className={styles["user-link"]}>
                    {review.user.avatar && (
                      <img
                        className={styles["review-avatar"]}
                        src={review.user.avatar}
                        alt={review.user.username}
                      />
                    )}
                    <strong>{review.user.username}</strong>
                  </Link>
                ) : (
                  <strong>Anonymous</strong>
                )}
              </div>
              {editingReviewId === review._id ? (
                <div className={styles["review-container"]}>
                  <div className={styles["review-control-range"]}>
                    <label>Rating:</label>
                    <input
                      className={styles["review-range-input"]}
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={editReviewData.rating}
                      onChange={(e) =>
                        setEditReviewData({ ...editReviewData, rating: parseFloat(e.target.value) })
                      }
                    />
                    <span>{editReviewData.rating.toFixed(1)}</span>
                  </div>
                  <div className={styles["review-control"]}>
                    <label>Comment:</label>
                    <textarea
                      className={styles["review-textarea"]}
                      value={editReviewData.comment}
                      onChange={(e) =>
                        setEditReviewData({ ...editReviewData, comment: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles["review-actions"]}>
                    <button className={styles["review-button"]} onClick={() => handleSaveEdit(review._id)}>
                      Save
                    </button>
                    <button
                      className={`${styles["review-button"]} ${styles["cancel-button"]}`}
                      onClick={() => setEditingReviewId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles["review-info"]}>
                  <div className={styles["review-text"]}>
                    <p>
                      <strong>Rating:</strong> {review.rating}
                    </p>
                    <p>
                      <strong>Comment:</strong> {review.comment}
                    </p>
                  </div>
                  <div className={styles["review-actions"]}>
                    {state.auth.user?._id === review.userId && (
                      <button className={styles["review-button"]} onClick={() => handleEditClick(review)}>
                        Edit
                      </button>
                    )}
                    {(state.auth.user?._id === review.userId || state.auth.user?.role === "ADMIN") && (
                      <button
                        className={`${styles["delete-button"]} delete-button`}
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to add one!</p>
        )}
      </div>
      {state.auth.user && (
        <div className={styles["add-review"]}>
          <h3>Add a Review:</h3>
          <div className={styles["review-rating-container"]}>
            <label htmlFor="rating">
              <strong>Rating:</strong>
            </label>
            <input
              id="rating"
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={newReviewData.rating}
              onChange={(e) =>
                setNewReviewData({ ...newReviewData, rating: parseFloat(e.target.value) })
              }
              className={styles["review-range-input"]}
            />
            <span>{newReviewData.rating.toFixed(1)}</span>
            <textarea
              className={styles["review-textarea"]}
              value={newReviewData.comment}
              onChange={(e) => setNewReviewData({ ...newReviewData, comment: e.target.value })}
              placeholder="Write your review..."
              rows={3}
            />
          </div>
          <button className={styles["submit-review-btn"]} onClick={handleAddReview}>
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default GameDetails;

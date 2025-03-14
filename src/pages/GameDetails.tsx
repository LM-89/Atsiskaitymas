import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import { getGames, getGameReviews } from "../api/api";
import { useReviewHandlers } from "../context/useReviewHandlers";
import styles from "./GameDetails.module.css";
import { Review, Category, NewReview } from "../types";

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state, dispatch } = useData();
  const { games, categories, reviews } = state;
  const { addReviewHandler, updateReviewHandler, deleteReviewHandler } = useReviewHandlers();


  const game = games.find((g) => g.id === Number(gameId)) || null;

 
  const [newReviewData, setNewReviewData] = useState({ rating: 3.0, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewData, setEditReviewData] = useState({ rating: 3.0, comment: "" });
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState("Not Rated Yet");


  const gameReviews = useMemo(() => reviews[Number(gameId)] || [], [reviews, gameId]);


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
      if (!reviews[Number(gameId)]) {
        setLoading(true);
        try {
          const reviewsData = await getGameReviews(Number(gameId));
          dispatch({
            type: "SET_REVIEWS",
            payload: { gameId: Number(gameId), reviews: reviewsData },
          });
        } catch (err) {
          console.error("Error fetching reviews", err);
        }
        setLoading(false);
      }
    };
    loadData();
  }, [game, gameId, dispatch, reviews]);


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
      gameId: Number(gameId),
      userId: state.auth.user?.id || 0,
      rating: newReviewData.rating,
      comment: newReviewData.comment,
    };
    await addReviewHandler(reviewPayload);
    setNewReviewData({ rating: 3.0, comment: "" });
  };


  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    setEditReviewData({ rating: review.rating, comment: review.comment });
  };


  const handleSaveEdit = async (reviewId: number) => {
    await updateReviewHandler(Number(gameId), reviewId, {
      rating: editReviewData.rating,
      comment: editReviewData.comment,
    });
    setEditingReviewId(null);
  };


  const handleDeleteReview = async (reviewId: number) => {
    await deleteReviewHandler(Number(gameId), reviewId);
  };

  if (loading) {
    return <p>Loading game details...</p>;
  }

  if (!game) {
    return <p>Game not found</p>;
  }
  

  return (
    <div className={styles["game-details-container"]}>
      <div className={styles["game-details"]}>
        <h2>{game.title}</h2>
        <p>
          <strong>Category:</strong>{" "}
          {categories.find((cat: Category) => cat.id === game.categoryId)?.title || "Unknown"}
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
        <img className={styles["game-cover"]} src={game.cover} alt={game.title} />
        <p>
          <strong>Average Rating:</strong> {averageRating} ⭐
        </p>
      </div>
      <div className={styles["reviews-section"]}>
        <h2>Reviews:</h2>
        {gameReviews.length > 0 ? (
          gameReviews.map((review) => (
            <div key={review.id} className={styles["review-item"]}>
              <div className={styles["review-user-info"]}>
                {review.user?.avatar && (
                  <img
                    className={styles["review-avatar"]}
                    src={review.user.avatar}
                    alt={review.user.nickname}
                  />
                )}
                <strong>{review.user?.nickname}</strong>
              </div>
              {editingReviewId === review.id ? (
                <>
                  <div className={styles["review-control"]}>
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
                    <button className={styles["review-button"]} onClick={() => handleSaveEdit(review.id)}>
                      Save
                    </button>
                    <button
                      className={`${styles["review-button"]} ${styles["cancel-button"]}`}
                      onClick={() => setEditingReviewId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>Rating:</strong> {review.rating}
                  </p>
                  <p>
                    <strong>Comment:</strong> {review.comment}
                  </p>
                  {state.auth.user?.id === review.userId && (
                    <button className={styles["review-button"]} onClick={() => handleEditClick(review)}>
                      Edit
                    </button>
                  )}
                  {(state.auth.user?.id === review.userId || state.auth.user?.role === "admin") && (
                    <button className={styles["review-button"]} onClick={() => handleDeleteReview(review.id)}>
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to add one!</p>
        )}
      </div>
      {state.auth.user && (
        <div className={styles["add-review"]}>
          <h3>Add a Review</h3>
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
          </div>
          <textarea
            className={styles["review-textarea"]}
            value={newReviewData.comment}
            onChange={(e) => setNewReviewData({ ...newReviewData, comment: e.target.value })}
            placeholder="Write your review..."
          />
          <button className={styles["submit-review-btn"]} onClick={handleAddReview}>
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default GameDetails;

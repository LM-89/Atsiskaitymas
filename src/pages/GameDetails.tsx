import { useParams } from "react-router-dom";
import { getGameReviews, addReview, deleteReview, updateReview, getGames } from "../api/api";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Game, Review, Category, NewReview } from "../types";
import { API_URL } from "../api/api";

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state, dispatch } = useData();
  const { games, categories, auth, reviews } = state;
  const { user, token } = auth;

  const [localGame, setLocalGame] = useState<Game | null>(null);
  const [newReviewData, setNewReviewData] = useState({ rating: 3.0, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewData, setEditReviewData] = useState({ rating: 3.0, comment: "" });
  const [averageRating, setAverageRating] = useState("Not Rated Yet");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameAndReviews = async () => {
      try {
        let gameItem: Game | null = games.find((g) => g.id === Number(gameId)) ?? null;
        if (!gameItem) {
          const gamesData = await getGames();
          dispatch({ type: "SET_GAMES", payload: gamesData });
          gameItem = gamesData.find((g) => g.id === Number(gameId)) ?? null;
        }
        setLocalGame(gameItem);

        if (categories.length === 0) {
          const categoriesResponse = await axios.get(`${API_URL}/categories`);
          dispatch({ type: "SET_CATEGORIES", payload: categoriesResponse.data });
        }

        const reviewsData = await getGameReviews(Number(gameId));
        const reviewsWithUserInfo = await Promise.all(
          reviewsData.map(async (review: Review) => {
            const userResponse = await axios.get(`${API_URL}/users/${review.userId}`);
            return { ...review, user: userResponse.data };
          })
        );
        dispatch({
          type: "SET_REVIEWS",
          payload: { gameId: Number(gameId), reviews: reviewsWithUserInfo },
        });
        if (reviewsWithUserInfo.length > 0) {
          const total = reviewsWithUserInfo.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating((total / reviewsWithUserInfo.length).toFixed(1));
        } else {
          setAverageRating("Not Rated Yet");
        }
      } catch (error) {
        console.error("Error loading game and reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGameAndReviews();
  }, [gameId, dispatch, games, categories]);

  const handleAddReview = async () => {
    if (user && token) {
      const reviewPayload: NewReview = {
        gameId: Number(gameId),
        userId: user.id,
        rating: newReviewData.rating,
        comment: newReviewData.comment,
      };
      const addedReview = await addReview(reviewPayload, token);
      dispatch({
        type: "ADD_REVIEW",
        payload: { gameId: Number(gameId), review: addedReview },
      });
      const currentReviews: Review[] = reviews[Number(gameId)] || [];
      const updatedReviews = [...currentReviews, addedReview];
      const total = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating((total / updatedReviews.length).toFixed(1));
      setNewReviewData({ rating: 3.0, comment: "" });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (user && token) {
      await deleteReview(reviewId, token);
      dispatch({
        type: "DELETE_REVIEW",
        payload: { gameId: Number(gameId), reviewId },
      });
      const currentReviews: Review[] = reviews[Number(gameId)] || [];
      const updatedReviews = currentReviews.filter((r) => r.id !== reviewId);
      if (updatedReviews.length > 0) {
        const total = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating((total / updatedReviews.length).toFixed(1));
      } else {
        setAverageRating("Not Rated Yet");
      }
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    setEditReviewData({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleSaveEdit = async (reviewId: number) => {
    if (user && token) {
      try {
        const updatedReviewData = { ...editReviewData, user };
        await updateReview(reviewId, updatedReviewData, token);
        dispatch({
          type: "UPDATE_REVIEW",
          payload: {
            gameId: Number(gameId),
            review: {
              id: reviewId,
              ...updatedReviewData,
              gameId: Number(gameId),
              userId: user.id,
            },
          },
        });
        const currentReviews: Review[] = reviews[Number(gameId)] || [];
        const updatedReviews = currentReviews.map((r) =>
          r.id === reviewId
            ? { id: reviewId, ...updatedReviewData, gameId: Number(gameId), userId: user.id }
            : r
        );
        const total = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating((total / updatedReviews.length).toFixed(1));
        setEditingReviewId(null);
      } catch (error) {
        console.error("Error updating review:", error);
      }
    }
  };

  const getCategoryName = (categoryId?: number) => {
    return categories.find((cat: Category) => cat.id === categoryId)?.title || "Unknown";
  };

  const gameReviews: Review[] = reviews[Number(gameId)] || [];

  if (loading) {
    return <p>Loading game details...</p>;
  }

  return (
    <div>
      {localGame ? (
        <>
          <div className="game-details">
            <h2>{localGame.title}</h2>
            <p>
              <strong>Category:</strong> {getCategoryName(localGame.categoryId)}
            </p>
            <p>
              <strong>Description:</strong> {localGame.description}
            </p>
            <p>
              <strong>Developer:</strong> {localGame.developer}
            </p>
            <p>
              <strong>Release Date:</strong> {localGame.release}
            </p>
            <img src={localGame.cover} alt={localGame.title} width={300} />
            <p>
              <strong>Average Rating:</strong> {averageRating} ⭐
            </p>
          </div>
          <div className="reviews-section">
            <h2>Reviews:</h2>
            {gameReviews.length > 0 ? (
              gameReviews.map((review) => (
                <div key={review.id} className="review">
                  <div className="review-user-info">
                    {review.user && review.user.avatar && (
                      <img
                        src={review.user.avatar}
                        alt={review.user.nickname}
                        width={50}
                        height={50}
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                    <strong>{review.user?.nickname}</strong>
                  </div>
                  {editingReviewId === review.id ? (
                    <>
                      <div>
                        <label>Rating:</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.1"
                          value={editReviewData.rating}
                          onChange={(e) =>
                            setEditReviewData({
                              ...editReviewData,
                              rating: parseFloat(e.target.value),
                            })
                          }
                        />
                        <span>{editReviewData.rating.toFixed(1)}</span>
                      </div>
                      <div>
                        <label>Comment:</label>
                        <textarea
                          value={editReviewData.comment}
                          onChange={(e) =>
                            setEditReviewData({
                              ...editReviewData,
                              comment: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button onClick={() => handleSaveEdit(review.id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Rating:</strong> {review.rating}
                      </p>
                      <p>
                        <strong>Comment:</strong> {review.comment}
                      </p>
                      {user?.id === review.userId && (
                        <button onClick={() => handleEditClick(review)}>Edit</button>
                      )}
                      {(user?.id === review.userId || user?.role === "admin") && (
                        <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to add one!</p>
            )}
          </div>
          {user && (
            <div className="add-review">
              <h3>Add a Review</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                  style={{ width: "300px" }}
                />
                <span>{newReviewData.rating.toFixed(1)}</span>
              </div>
              <textarea
                value={newReviewData.comment}
                onChange={(e) => setNewReviewData({ ...newReviewData, comment: e.target.value })}
                placeholder="Write your review..."
                style={{ width: "100%", height: "80px", marginTop: "10px" }}
              />
              <button onClick={handleAddReview} style={{ marginTop: "10px" }}>
                Submit Review
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Game not found.</p>
      )}
    </div>
  );
};

export default GameDetails;

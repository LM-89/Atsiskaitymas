import { useParams } from "react-router-dom";
import { getGameReviews, addReview, deleteReview, updateReview, getGames } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Review, Game } from "../types";
import axios from "axios";

interface Category {
  id: number;
  title: string;
}

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user, token } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 3.0, comment: "" });
  const [averageRating, setAverageRating] = useState<string>("Not Rated Yet");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewData, setEditReviewData] = useState<{ rating: number; comment: string }>({
    rating: 3.0,
    comment: ""
  });

  useEffect(() => {
    const loadGameAndReviews = async () => {    
      const gamesData = await getGames();
      const selectedGame = gamesData.find((g) => g.id === Number(gameId));
      setGame(selectedGame || null);

      
      const categoriesResponse = await axios.get("http://localhost:3000/categories");
      setCategories(categoriesResponse.data);

      
      const reviewData = await getGameReviews(Number(gameId));
      const reviewsWithUserInfo = await Promise.all(
        reviewData.map(async (review) => {
          const userResponse = await axios.get(`http://localhost:3000/users/${review.userId}`);
          return { ...review, user: userResponse.data };
        })
      );
      setReviews(reviewsWithUserInfo);

     
      if (reviewData.length > 0) {
        const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
        const average = (totalRating / reviewData.length).toFixed(1);
        setAverageRating(average);
      } else {
        setAverageRating("Not Rated Yet");
      }
    };

    loadGameAndReviews();
  }, [gameId]);

  const handleAddReview = async () => {
    if (user && token) {
      const reviewData = {
        gameId: Number(gameId),
        userId: user.id,
        rating: newReview.rating,
        comment: newReview.comment,
        user: user, 
      };

    
      const addedReview = await addReview(reviewData, token);
      setReviews([...reviews, addedReview]);
      setNewReview({ rating: 3.0, comment: "" });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (user && token) {
      await deleteReview(reviewId, token);
      setReviews(reviews.filter((review) => review.id !== reviewId));
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
        setReviews(
          reviews.map((r) =>
            r.id === reviewId ? { ...r, ...updatedReviewData } : r
          )
        );
        setEditingReviewId(null);
      } catch (error) {
        console.error("Error updating review:", error);
      }
    }
  };

  
  const getCategoryName = (categoryId?: number) => {
    return categories.find((category) => category.id === categoryId)?.title || "Unknown";
  };

  return (
    <div>
      {game ? (
        <>
          <div className="game-details">
            <h2>{game.title}</h2>
            <p>
              <strong>Category:</strong> {getCategoryName(game.categoryId)}
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
            <img src={game.cover} alt={game.title} width={300} />
            <p>
              <strong>Average Rating:</strong> {averageRating} ⭐
            </p>
          </div>

         
          <div className="reviews-section">
            <h2>Reviews:</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review">
                  <div className="review-user-info">
                    {review.user.avatar && (
                      <img
                        src={review.user.avatar}
                        alt={review.user.nickname}
                        width={50}
                        height={50}
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                    <strong>{review.user.nickname}</strong>
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
                              rating: parseFloat(e.target.value)
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
                              comment: e.target.value
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
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: parseFloat(e.target.value) })
                  }
                  style={{ width: "300px" }}
                />
                <span>{newReview.rating.toFixed(1)}</span>
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
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
        <p>Loading game details...</p>
      )}
    </div>
  );
};

export default GameDetails;

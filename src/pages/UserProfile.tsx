import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import axios from "axios";
import { API_URL, updateReview, deleteReview } from "../api/api";
import { Link } from "react-router-dom";
import { Review, Game } from "../types";
import ProfileForm from "../components/ProfileForm";

const UserProfile = () => {
  const { state } = useData();
  const { auth, games } = state;
  const { user, token } = auth;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewData, setEditReviewData] = useState<{ rating: number; comment: string }>({
    rating: 0,
    comment: "",
  });


  useEffect(() => {
    const fetchReviews = async () => {
      if (user) {
        try {
          const response = await axios.get(`${API_URL}/reviews?userId=${user.id}`);
          setReviews(response.data);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };
    fetchReviews();
  }, [user]);


  const getGameTitle = (gameId: number) => {
    const game: Game | undefined = games.find((g) => g.id === gameId);
    return game ? game.title : `Game ${gameId}`;
  };

  const handleUpdateReview = async (reviewId: number) => {
    try {
      if (!token) return;
      await updateReview(reviewId, editReviewData, token);
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? { ...review, rating: editReviewData.rating, comment: editReviewData.comment }
            : review
        )
      );
      setEditingReviewId(null);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      if (!token) return;
      await deleteReview(reviewId, token);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !token) return;
  
    const firstConfirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!firstConfirm) return;
  
    const secondConfirm = window.confirm("This is your last chance! Are you absolutely sure you want to delete your account?");
    if (!secondConfirm) return;
  
    try {
      await axios.delete(`${API_URL}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Your account has been deleted.");

      dispatch({ type: "LOGOUT" });
  
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="profile">
      {user && (
        <>
          <ProfileForm user={user} />
          <div className="avatar-section">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                width={100}
                height={100}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <div>No avatar available</div>
            )}
            <div>
              <strong>Nickname:</strong> {user.nickname || "No nickname available"}
            </div>
            <div>
              <strong>Email:</strong> {user.email || "No email available"}
            </div>
            <div>
              <strong>Role:</strong> {user.role || "No role available"}
            </div>
            <button style={{ background: "red", color: "white", marginTop: "1rem" }} onClick={handleDeleteAccount}>
              Delete My Account
            </button>
          </div>

          <h3>My Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews added yet</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} style={{ marginBottom: "1rem" }}>
                  <div>
                    <strong>Game:</strong>{" "}
                    <Link to={`/game/${review.gameId}`}>{getGameTitle(review.gameId)}</Link>
                  </div>
                  {editingReviewId === review.id ? (
                    <>
                      <div>
                        <label>Rating: </label>
                        <input
                          type="number"
                          value={editReviewData.rating}
                          onChange={(e) =>
                            setEditReviewData({
                              ...editReviewData,
                              rating: Number(e.target.value),
                            })
                          }
                          min={0}
                          max={5}
                          step={0.1}
                        />
                      </div>
                      <div>
                        <label>Comment: </label>
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
                      <button onClick={() => handleUpdateReview(review.id)}>Save</button>
                      <button onClick={() => setEditingReviewId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <div>
                        <strong>Rating:</strong> {review.rating}
                      </div>
                      <div>
                        <strong>Comment:</strong> {review.comment}
                      </div>
                      <button
                        onClick={() => {
                          setEditingReviewId(review.id);
                          setEditReviewData({ rating: review.rating, comment: review.comment });
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dispatch(_arg0: { type: string; }) {
  throw new Error("Function not implemented.");
}


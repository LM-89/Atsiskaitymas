import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import axios from "axios";
import { API_URL } from "../../api/api";
import { Link } from "react-router-dom";
import { Review, Game } from "../../types";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import { useReviewHandlers } from "../../context/useReviewHandlers";
import styles from "./UserProfile.module.scss";
import "../../App.scss"

const UserProfile = () => {
  const { state, dispatch } = useData();
  const { auth, games } = state;
  const { user, token } = auth;

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewData, setEditReviewData] = useState<{ rating: number; comment: string }>({
    rating: 0,
    comment: "",
  });
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  const { updateReviewHandler, deleteReviewHandler } = useReviewHandlers();

  useEffect(() => {
    const fetchReviews = async () => {
      if (user) {
        try {
          const response = await axios.get(`${API_URL}/reviews?userId=${user.id}`);
          setUserReviews(response.data);
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
    const reviewToUpdate = userReviews.find((review) => review.id === reviewId);
    if (reviewToUpdate) {
      await updateReviewHandler(reviewToUpdate.gameId, reviewId, {
        rating: editReviewData.rating,
        comment: editReviewData.comment,
      });
      setUserReviews(
        userReviews.map((review) =>
          review.id === reviewId
            ? { ...review, rating: editReviewData.rating, comment: editReviewData.comment }
            : review
        )
      );
      setEditingReviewId(null);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const reviewToDelete = userReviews.find((r) => r.id === reviewId);
    if (reviewToDelete) {
      await deleteReviewHandler(reviewToDelete.gameId, reviewId);
      setUserReviews(userReviews.filter((review) => review.id !== reviewId));
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !token) return;
    const firstConfirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!firstConfirm) return;
    const secondConfirm = window.confirm(
      "This is your last chance! Are you absolutely sure you want to delete your account?"
    );
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
    <div className={`${styles["user-profile-container"]} content-container`}>
      {user && (
        <div className={styles["user-profile"]}>
          <div className={styles["profile-form"]}>
            <div className={styles["avatar-section"]}>
              {user.avatar ? (
                <img className={styles["profile-avatar"]} src={user.avatar} alt="Avatar" />
              ) : (
                <div className={styles["avatar-placeholder"]}>No avatar available</div>
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
              <div>
                <strong>Bio:</strong> {user.bio || "No bio available"}
              </div>
              <button className={`${styles["delete-btn"]} delete-button`} onClick={handleDeleteAccount}>
                Delete My Account
              </button>
            </div>
            <ProfileForm user={user} />
          </div>

          <div className={styles["reviews-container"]}>
            <h3>My Reviews:</h3>
            {userReviews.length === 0 ? (
              <p>No reviews added yet</p>
            ) : (
              <ul className={styles["reviews-ul"]}>
                {userReviews.map((review) => (
                  <li key={review.id} className={styles["review-item"]}>
                    <div>
                      <strong>Game:</strong>{" "}
                      <Link to={`/game/${review.gameId}`}>{getGameTitle(review.gameId)}</Link>
                    </div>
                    {editingReviewId === review.id ? (
                      <>
                        <div className={styles["form-control"]}>
                          <label>Rating: </label>
                          <input
                            className={styles["review-input"]}
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
                        <div className={styles["review-form-control"]}>
                          <label>Comment: </label>
                          <textarea
                            className={styles["review-textarea"]}
                            value={editReviewData.comment}
                            onChange={(e) =>
                              setEditReviewData({
                                ...editReviewData,
                                comment: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className={styles["actions"]}>
                          <button className={styles["review-button"]} onClick={() => handleUpdateReview(review.id)}>
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
                        <div>
                          <strong>Rating:</strong> {review.rating}
                        </div>
                        <div>
                          <strong>Comment:</strong> {review.comment}
                        </div>
                        <div className={styles["actions"]}>
                          <button
                            className={styles["review-button"]}
                            onClick={() => {
                              setEditingReviewId(review.id);
                              setEditReviewData({ rating: review.rating, comment: review.comment });
                            }}
                          >
                            Edit
                          </button>
                          <button className={`${styles["delete-btn"]} delete-button`} onClick={() => handleDeleteReview(review.id)}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

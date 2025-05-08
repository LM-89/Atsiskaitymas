import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL, updateUserRole, deleteReview } from "../../api/api";
import { Review, Game } from "../../types";
import { useData } from "../../context/DataContext";
import styles from "./OtherUserProfile.module.scss";
import "../../App.scss"

type ReviewWithGameTitle = Review & { gameTitle: string };

const OtherUserProfile = () => {
  const { userId } = useParams();
  const numericUserId = userId ? Number(userId) : null;
  const { state, dispatch } = useData();
  const { auth, users, games } = state;
  const loggedInUser = auth.user;
  const token = auth.token;

  
  const profileUser = useMemo(() => {
    if (numericUserId === null) return null;
    return users.find((user) => user._id === String(numericUserId)) || null;
  }, [numericUserId, users]);


  useEffect(() => {
    if (numericUserId && !profileUser) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/users/${numericUserId}`);
          dispatch({ type: "SET_USERS", payload: [...users, response.data] });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    }
  }, [numericUserId, profileUser, dispatch, users]);

  
  const [reviewsForUser, setReviewsForUser] = useState<ReviewWithGameTitle[]>([]);
  useEffect(() => {
    if (!numericUserId) return;
    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get(`${API_URL}/reviews`);
        const userReviews: Review[] = reviewsResponse.data.filter(
          (review: Review) => review.user === numericUserId
        );
        const reviewsWithGames: ReviewWithGameTitle[] = userReviews.map((review: Review) => ({
          ...review,
          gameTitle: games.find((game: Game) => game._id === review.game)?.title || "Unknown Game",
        }));
        setReviewsForUser(reviewsWithGames);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [numericUserId, games]);


  const handleRoleChange = async (newRole: "user" | "admin") => {
    if (!loggedInUser || !token || !numericUserId) return;
    try {
      await updateUserRole(numericUserId, newRole, token);
      const updatedUsers = users.map((user) =>
        user.id === numericUserId ? { ...user, role: newRole } : user
      );
      dispatch({ type: "SET_USERS", payload: updatedUsers });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };


  const handleDeleteReview = async (reviewId: number) => {
    if (loggedInUser && token) {
      try {
        await deleteReview(reviewId, token);
        setReviewsForUser((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  if (!profileUser) {
    return <div className={styles["loading"]}>Loading...</div>;
  }

  return (
    <div className={`${styles["other-user-profile"]} content-container`}>
      <h2>User Profile:</h2>
        <div className={styles["avatar-section"]}>
          {profileUser.avatar ? (
            <img
              className={styles["profile-avatar"]}
              src={profileUser.avatar}
              alt="Avatar"
              width={100}
              height={100}
            />
          ) : (
            <div className={styles["avatar-placeholder"]}>No avatar available</div>
          )}
          <div>
            <strong>Nickname:</strong> {profileUser.username}
          </div>
          <div>
            <strong>Bio:</strong> {profileUser.bio || "No bio available"}
          </div>
          <div>
            <strong>Role:</strong> {profileUser.role}
          </div>

          {loggedInUser?.role === "ADMIN" && loggedInUser._id !== profileUser._id && (
            <div className={styles["role-change"]}>
              <label>Change Role: </label>
              <select
                value={profileUser.role}
                onChange={(e) => handleRoleChange(e.target.value as "user" | "admin")}
                className={styles["role-select"]}
                >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
        </div>

      <div className={styles["reviews-section"]}>
        <h3>{profileUser.username}'s Reviews: </h3>
        {reviewsForUser.length > 0 ? (
          reviewsForUser.map((review) => (
            <div key={review._id} className={styles["review-item"]}>
              <p>
                <strong>Game:</strong> {review.gameTitle}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating}
              </p>
              <p>
                <strong>Comment:</strong> {review.feedback}
              </p>
              <div className={styles["actions"]}>
                {loggedInUser?.role === "ADMIN" && (
                  <button className={`${styles["delete-btn"]} delete-button`} onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default OtherUserProfile;

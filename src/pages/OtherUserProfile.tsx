import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, deleteReview, updateUserRole } from "../api/api";
import { User, Review, Game } from "../types";
import { useAuth } from "../context/AuthContext";

type ReviewWithGameTitle = Review & { gameTitle: string };

const OtherUserProfile = () => {
  const { userId } = useParams();
  const numericUserId = userId ? Number(userId) : null;
  const { user: loggedInUser, token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [reviews, setReviews] = useState<ReviewWithGameTitle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!numericUserId) return;

      try {
        const userResponse = await axios.get(`${API_URL}/users/${numericUserId}`);
        setUser(userResponse.data);
        setRole(userResponse.data.role);

        const userReviewsResponse = await axios.get(`${API_URL}/reviews`);
        const userReviews: Review[] = userReviewsResponse.data.filter(
          (review: Review) => review.userId === numericUserId
        );

        const gamesResponse = await axios.get(`${API_URL}/games`);
        const reviewsWithGames: ReviewWithGameTitle[] = userReviews.map((review: Review) => ({
          ...review,
          gameTitle: gamesResponse.data.find((game: Game) => game.id === review.gameId)?.title || "Unknown Game",
        }));

        setReviews(reviewsWithGames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [numericUserId]);

  const handleRoleChange = async (newRole: "user" | "admin") => {
    if (!loggedInUser || !token || !numericUserId) return;

    try {
      await updateUserRole(numericUserId, newRole, token);
      setRole(newRole);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (loggedInUser && token) {
      await deleteReview(reviewId, token);
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="avatar-section">
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" width={100} height={100} style={{ borderRadius: "50%" }} />
        ) : (
          <div>No avatar available</div>
        )}
        <div>
          <strong>Nickname:</strong> {user.nickname}
        </div>
        <div>
          <strong>Bio:</strong> {user.bio || "No bio available"}
        </div>
        <div>
          <strong>Role:</strong> {role}
        </div>
      </div>

      {loggedInUser?.role === "admin" && loggedInUser.id !== user.id && (
        <div>
          <label>Change Role:</label>
          <select value={role} onChange={(e) => handleRoleChange(e.target.value as "user" | "admin")}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

      <div className="reviews-section">
        <h3>{user.nickname}'s Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p><strong>Game:</strong> {review.gameTitle}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Comment:</strong> {review.comment}</p>

              {loggedInUser?.role === "admin" && (
                <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default OtherUserProfile;

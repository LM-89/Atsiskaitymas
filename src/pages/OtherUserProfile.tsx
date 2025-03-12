import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, deleteReview, updateUserRole } from "../api/api";
import { User, Review, Game } from "../types";
import { useData } from "../context/DataContext";

type ReviewWithGameTitle = Review & { gameTitle: string };

const OtherUserProfile = () => {
  const { userId } = useParams();
  const numericUserId = userId ? Number(userId) : null;
  const { state, dispatch } = useData();
  const { auth, users, games } = state;
  const loggedInUser = auth.user;
  const token = auth.token;
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [reviews, setReviews] = useState<ReviewWithGameTitle[]>([]);

  useEffect(() => {
    if (!numericUserId) return;

    const foundUser = users.find((u) => u.id === numericUserId);
    if (foundUser) {
      setProfileUser(foundUser);
      setRole(foundUser.role);
    } else {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/users/${numericUserId}`);
          setProfileUser(response.data);
          setRole(response.data.role);
          dispatch({ type: "SET_USERS", payload: [...users, response.data] });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    }
  }, [numericUserId, users, dispatch]);


  useEffect(() => {
    if (!numericUserId) return;

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get(`${API_URL}/reviews`);
        const userReviews: Review[] = reviewsResponse.data.filter(
          (review: Review) => review.userId === numericUserId
        );
        const reviewsWithGames: ReviewWithGameTitle[] = userReviews.map(
          (review: Review) => ({
            ...review,
            gameTitle:
              games.find((game: Game) => game.id === review.gameId)?.title ||
              "Unknown Game",
          })
        );
        setReviews(reviewsWithGames);
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
      setRole(newRole);

      const updatedUsers = users.map((u) =>
        u.id === numericUserId ? { ...u, role: newRole } : u
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
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
        
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="avatar-section">
        {profileUser.avatar ? (
          <img
            src={profileUser.avatar}
            alt="Avatar"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <div>No avatar available</div>
        )}
        <div>
          <strong>Nickname:</strong> {profileUser.nickname}
        </div>
        <div>
          <strong>Bio:</strong> {profileUser.bio || "No bio available"}
        </div>
        <div>
          <strong>Role:</strong> {role}
        </div>
      </div>

      {loggedInUser?.role === "admin" && loggedInUser.id !== profileUser.id && (
        <div>
          <label>Change Role:</label>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as "user" | "admin")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

      <div className="reviews-section">
        <h3>{profileUser.nickname}'s Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p>
                <strong>Game:</strong> {review.gameTitle}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating}
              </p>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
              {loggedInUser?.role === "admin" && (
                <button onClick={() => handleDeleteReview(review.id)}>
                  Delete
                </button>
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

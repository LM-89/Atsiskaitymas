import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL, updateReview, deleteReview } from "../api/api";
import { Link } from "react-router-dom";
import { Review } from "../types";
import { Game } from "../types";

const UserProfile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    surname: "",
    nickname: "",
    avatar: "",
    bio: ""
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewData, setEditReviewData] = useState<{ rating: number; comment: string }>({
    rating: 0,
    comment: ""
  });

  // Update profile when the user object changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        surname: user.surname || "",
        nickname: user.nickname || "",
        avatar: user.avatar || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  // Fetch user's reviews
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

  // Fetch all games to map game titles in reviews
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${API_URL}/games`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.patch(`${API_URL}/users/${user?.id}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUser = { ...user, ...profile };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update failed", error);
    }
  };


  const getGameTitle = (gameId: number) => {
    const game = games.find((game) => game.id === gameId);
    return game ? game.title : `Game ${gameId}`;
  };

  
  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    setEditReviewData({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleSaveEdit = async (reviewId: number) => {
    try {
      if (!token) return;
      await updateReview(reviewId, editReviewData, token);
    
      setReviews(reviews.map(review => review.id === reviewId ? { ...review, rating: editReviewData.rating, comment: editReviewData.comment } : review));
      setEditingReviewId(null);

    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      if (!token) return;
      await deleteReview(reviewId, token);
      
      setReviews(reviews.filter(review => review.id !== reviewId));

    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="profile">
      <h2>Profile Settings</h2>
      <div className="avatar-section">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="Avatar"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <div>No avatar available</div>
        )}
        <div>
          <strong>Nickname:</strong> {profile.nickname || "No nickname available"}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || "No email available"}
        </div>
        <div>
          <strong>Role:</strong> {user?.role || "No role available"}
        </div>
      </div>




      <h3>Edit Profile</h3>
      <div>
        <label>Name:</label>
        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </div>
      <div>
        <label>Surname:</label>
        <input
          value={profile.surname}
          onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
        />
      </div>
      <div>
        <label>Nickname:</label>
        <input
          value={profile.nickname}
          onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
        />
      </div>
      <div>
        <label>Avatar URL:</label>
        <input
          value={profile.avatar}
          onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
        />
      </div>
      <div>
        <label>Bio:</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>
      <button onClick={handleUpdate}>Save Changes</button>



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
                          rating: Number(e.target.value)
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
                  <div>
                    <strong>Rating:</strong> {review.rating}
                  </div>
                  <div>
                    <strong>Comment:</strong> {review.comment}
                  </div>
                  <button onClick={() => handleEditClick(review)}>Edit</button>
                  <button onClick={() => handleDelete(review.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProfile;

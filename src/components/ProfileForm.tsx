import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api/api";
import { User } from "../types";
import { useData } from "../context/DataContext";

interface ProfileFormProps {
  user: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const { dispatch, state } = useData();
  const { auth } = state;
  const token = auth.token;
  const [profile, setProfile] = useState({
    name: user.name || "",
    surname: user.surname || "",
    nickname: user.nickname || "",
    avatar: user.avatar || "",
    bio: user.bio || "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile({
      name: user.name || "",
      surname: user.surname || "",
      nickname: user.nickname || "",
      avatar: user.avatar || "",
      bio: user.bio || "",
    });
  }, [user]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`${API_URL}/users/${user.id}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = { ...user, ...profile };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_USER", payload: { user: updatedUser } });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div>
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfileForm;

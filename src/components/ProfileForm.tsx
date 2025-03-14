import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api/api";
import { User } from "../types";
import { useData } from "../context/DataContext";
import styles from "./ProfileForm.module.css";

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
    email: user.email || ""
  });
  const [message, setMessage] = useState("");


  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMessage, setPassMessage] = useState("");


  useEffect(() => {
    setProfile({
      name: user.name || "",
      surname: user.surname || "",
      nickname: user.nickname || "",
      avatar: user.avatar || "",
      bio: user.bio || "",
      email: user.email || ""
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


  const handlePasswordChange = async () => {
    if (!newPassword || newPassword !== confirmPassword) return;
    try {
      await axios.patch(
        `${API_URL}/users/${user.id}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPassMessage(""), 3000);
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };


  return (
    <div className={styles["profile-form"]}>
      <h3>Edit Profile</h3>
      <div className={styles["form-group"]}>
        <label>Name:</label>
        <input
          className={styles["profile-input"]}
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </div>
      <div className={styles["form-group"]}>
        <label>Surname:</label>
        <input
          className={styles["profile-input"]}
          value={profile.surname}
          onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
        />
      </div>
      <div className={styles["form-group"]}>
        <label>Nickname:</label>
        <input
          className={styles["profile-input"]}
          value={profile.nickname}
          onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
        />
      </div>
      <div className={styles["form-group"]}>
        <label>Avatar URL:</label>
        <input
          className={styles["profile-input"]}
          value={profile.avatar}
          onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
        />
      </div>
      <div className={styles["form-group"]}>
        <label>Bio:</label>
        <textarea
          className={styles["profile-textarea"]}
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={5}
        />
      </div>
      <div className={styles["form-group"]}>
        <label>Email:</label>
        <input
          className={styles["profile-input"]}
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
      </div>
      <button className={styles["profile-button"]} onClick={handleUpdate}>
        Save Changes
      </button>
      {message && <p className={styles["profile-message"]}>{message}</p>}

      <hr className={styles["profile-separator"]} />

      <h3>Change Password</h3>
      <div className={styles["form-group"]}>
        <label>New Password:</label>
        <input
          className={styles["profile-input"]}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className={styles["form-group"]}>
        <label>Confirm New Password:</label>
        <input
          className={styles["profile-input"]}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        className={styles["profile-button"]}
        onClick={handlePasswordChange}
        disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
      >
        Change Password
      </button>
      {passMessage && <p className={styles["profile-message"]}>{passMessage}</p>}
    </div>
  );
};

export default ProfileForm;

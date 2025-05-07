import axios from "axios";
import { Genre, Game, NewReview, Review, User } from "../types";

export const API_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

// Add a helper function to include the Authorization header
export const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Authentication
export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/users/login", { email, password });
  return response.data;
};

export const getUserProfile = async (token: string) => {
  setAuthHeader(token);
  const response = await api.get("/users/me");
  return response.data; // User object
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  role: "USER" | "ADMIN";
}) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

// Users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUser = async (userId: string, userData: Partial<User>, token: string) => {
  const response = await api.put(`/users/${userId}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId: string, token: string) => {
  await api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserRole = async (userId: string, role: "ADMIN" | "USER", token: string) => {
  const response = await api.patch(`/users/${userId}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Games
export const getGames = async () => {
  const response = await api.get("/games");
  return response.data;
};

export const addGame = async (gameData: Omit<Game, "_id">, token: string) => {
  const response = await api.post("/games", gameData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateGame = async (gameId: string, gameData: Partial<Game>, token: string) => {
  const response = await api.put(`/games/${gameId}`, gameData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteGame = async (gameId: string, token: string) => {
  await api.delete(`/games/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Genres
export const getGenres = async () => {
  const response = await api.get("/genres");
  return response.data;
};

export const addGenre = async (genreData: Omit<Genre, "_id">, token: string) => {
  const response = await api.post("/genres", genreData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateGenre = async (genreId: string, updatedData: Partial<Genre>, token: string) => {
  const response = await api.put(`/genres/${genreId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteGenre = async (genreId: string, token: string) => {
  await api.delete(`/genres/${genreId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Reviews
export const getGameReviews = async (gameId: string) => {
  const response = await api.get(`/reviews/game/${gameId}`);
  return response.data;
};

export const addReview = async (review: NewReview, token: string) => {
  const response = await api.post("/reviews", review, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateReview = async (reviewId: string, reviewData: Partial<Review>, token: string) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteReview = async (reviewId: string, token: string) => {
  await api.delete(`/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
import axios from "axios";
import { Category, Game, NewReview, Review, User } from "../types";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

export const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await api.get("/users", { params: { email, password } });
  if (response.data.length === 0) throw new Error("Invalid credentials");
  return { token: "mock-token", user: response.data[0] };
};

export const registerUser = async (userData: Omit<User, "id">): Promise<{ token: string; user: User }> => {
  const response = await api.post("/users", userData);
  return { token: "mock-token", user: response.data };
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const deleteUser = async (userId: number, token: string) => {
  await api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserRole = async (userId: number, role: "admin" | "user", token: string) => {
  const response = await api.patch(`/users/${userId}`, { role }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getGames = async (): Promise<Game[]> => {
  const response = await api.get("/games");
  return response.data;
};

export const addGame = async (gameData: Omit<Game, "id">, token: string) => {
  const response = await api.post("/games", gameData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateGame = async (gameId: number, gameData: Partial<Game>, token: string) => {
  const response = await api.put(`/games/${gameId}`, gameData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteGame = async (gameId: number, token: string) => {
  await api.delete(`/games/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

export const addCategory = async (categoryData: Omit<Category, "id">, token: string) => {
  const response = await api.post("/categories", categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCategory = async (categoryId: number, token: string) => {
  await api.delete(`/categories/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCategory = async (
  categoryId: number,
  updatedData: Partial<Category>,
  token: string
): Promise<Category> => {
  try {
    const response = await axios.put(
      `${API_URL}/categories/${categoryId}`,
      updatedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const getGameReviews = async (gameId: number): Promise<Review[]> => {
  const response = await api.get(`/reviews?gameId=${gameId}`);
  return response.data;
};

export const addReview = async (review: NewReview, token: string) => {
  const response = await api.post("/reviews", review, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateReview = async (reviewId: number, reviewData: Partial<Review>, token: string) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteReview = async (reviewId: number, token: string) => {
  await api.delete(`/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

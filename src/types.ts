export interface User {
  _id: string; // MongoDB ObjectId as a string
  email: string;
  role: "ADMIN" | "USER"; // Matches the roles defined in the backend
  name?: string;
  surname?: string;
  username: string;
  bio?: string;
  avatar?: string;
  status?: "online" | "offline";
}

export interface Game {
  _id: string; // MongoDB ObjectId as a string
  title: string;
  description: string;
  developer: string;
  release: number;
  price: number;
  cover: string;
  video: string;
  rating?: number; // Optional, matches the backend model
  genres: string[]; // Array of MongoDB ObjectIds referencing Genre
}

export interface Review {
  _id: string; // MongoDB ObjectId as a string
  rating: number;
  feedback: string; // Matches the "feedback" field in the backend
  user: string; // MongoDB ObjectId referencing User
  game: string; // MongoDB ObjectId referencing Game
}

export interface Genre {
  _id: string; // MongoDB ObjectId as a string
  title: string;
  description: string;
}

export type NewReview = {
  game: string; // MongoDB ObjectId referencing Game
  user: string; // MongoDB ObjectId referencing User
  rating: number;
  feedback: string; // Matches the "feedback" field in the backend
};

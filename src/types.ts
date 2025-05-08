export interface User {
  _id: string; 
  email: string;
  role: "ADMIN" | "USER"; 
  name?: string;
  surname?: string;
  username: string;
  bio?: string;
  avatar?: string;
  status?: "online" | "offline";
}

export interface Game {
  _id: string; 
  title: string;
  description: string;
  developer: string;
  release: number;
  price: number;
  cover: string;
  video: string;
  rating?: number; 
  genres: string[]; 
}

export interface Review {
  _id: string; 
  rating: number;
  feedback: string;
  user: string; 
  game: string; 
}

export interface Genre {
  _id: string; 
  title: string;
  description: string;
}

export type NewReview = {
  game: string; 
  user: string; 
  rating: number;
  feedback: string; 
};

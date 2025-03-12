export interface User {
    id: number;
    email: string;
    role: "admin" | "user";
    password?: string;
    name?: string;
    surname?: string;
    nickname: string;
    bio?: string;
    avatar?: string;
    status?: "online" | "offline";
}
  
export interface Game {
    id: number;
    title: string;
    cover: string;
    description: string;
    categoryId?: number;
    developer?: string;
    price?: number;
    release?: number;
}
  
export interface Review {
    id: number;
    gameId: number;
    userId: number;
    rating: number;
    comment: string;
    user: User;
}

export interface Category {
    id: number;
    title: string;
    description: string;
}

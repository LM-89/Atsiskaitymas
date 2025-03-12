import { Game, User, Review, Category } from "../types";

export interface AppState {
  auth: {
    user: User | null;
    token: string | null;
  };
  games: Game[];
  categories: Category[];
  users: User[];
  reviews: { [gameId: number]: Review[] };
  loading: boolean;
}

export type Action =
  | { type: "SET_AUTH"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_GAMES"; payload: Game[] }
  | { type: "ADD_GAME"; payload: Game }
  | { type: "UPDATE_GAME"; payload: Game }
  | { type: "DELETE_GAME"; payload: number }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: number }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "UPDATE_USER"; payload: { user: User } }
  | { type: "SET_REVIEWS"; payload: { gameId: number; reviews: Review[] } }
  | { type: "ADD_REVIEW"; payload: { gameId: number; review: Review } }
  | { type: "UPDATE_REVIEW"; payload: { gameId: number; review: Review } }
  | { type: "DELETE_REVIEW"; payload: { gameId: number; reviewId: number } }
  | { type: "SET_LOADING"; payload: boolean };

export const initialState: AppState = {
  auth: {
    user: null,
    token: localStorage.getItem("token") || null,
  },
  games: [],
  categories: [],
  users: [],
  reviews: {},
  loading: false,
};

export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        auth: { user: action.payload.user, token: action.payload.token },
      };
    case "LOGOUT":
      return {
        ...state,
        auth: { user: null, token: null },
      };
    case "SET_GAMES":
      return {
        ...state,
        games: action.payload,
      };
    case "ADD_GAME":
      return {
        ...state,
        games: [...state.games, action.payload],
      };
    case "UPDATE_GAME":
      return {
        ...state,
        games: state.games.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case "DELETE_GAME":
      return {
        ...state,
        games: state.games.filter((g) => g.id !== action.payload),
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        auth: { ...state.auth, user: action.payload.user },
      };
    case "SET_REVIEWS":
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.gameId]: action.payload.reviews,
        },
      };
    case "ADD_REVIEW": {
      const { gameId, review } = action.payload;
      const currentReviews = state.reviews[gameId] || [];
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [gameId]: [...currentReviews, review],
        },
      };
    }
    case "UPDATE_REVIEW": {
      const { gameId, review } = action.payload;
      const currentReviews = state.reviews[gameId] || [];
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [gameId]: currentReviews.map((r) => (r.id === review.id ? review : r)),
        },
      };
    }
    case "DELETE_REVIEW": {
      const { gameId, reviewId } = action.payload;
      const currentReviews = state.reviews[gameId] || [];
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [gameId]: currentReviews.filter((r) => r.id !== reviewId),
        },
      };
    }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

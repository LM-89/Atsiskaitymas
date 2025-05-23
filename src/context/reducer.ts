import { Game, User, Review, Genre } from "../types";

export interface AppState {
  token: string;
  auth: {
    user: User | null;
    token: string | null;
  };
  games: Game[];
  genres: Genre[];
  users: User[];
  reviews: { [gameId: string]: Review[] }; 
  loading: boolean;
}

export type Action =
  | { type: "SET_AUTH"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_GAMES"; payload: Game[] }
  | { type: "ADD_GAME"; payload: Game }
  | { type: "UPDATE_GAME"; payload: Game }
  | { type: "DELETE_GAME"; payload: string } 
  | { type: "SET_GENRES"; payload: Genre[] }
  | { type: "ADD_GENRE"; payload: Genre }
  | { type: "UPDATE_GENRE"; payload: Genre }
  | { type: "DELETE_GENRE"; payload: string }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "DELETE_USER"; payload: string }
  | { type: "UPDATE_USER"; payload: { user: User } }
  | { type: "SET_REVIEWS"; payload: { gameId: string; reviews: Review[] } }
  | { type: "ADD_REVIEW"; payload: { gameId: string; review: Review } }
  | { type: "UPDATE_REVIEW"; payload: { gameId: string; review: Review } }
  | { type: "DELETE_REVIEW"; payload: { gameId: string; reviewId: string } }
  | { type: "SET_LOADING"; payload: boolean };

export const initialState: AppState = {
  auth: {
    user: null,
    token: localStorage.getItem("token") || null,
  },
  games: [],
  genres: [],
  users: [],
  reviews: {},
  loading: false,
  token: ""
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
        games: state.games.map((game) =>
          game._id === action.payload._id ? action.payload : game
        ),
      };
    case "DELETE_GAME":
      return {
        ...state,
        games: state.games.filter((game) => game._id !== action.payload),
      };
    case "SET_GENRES":
      return {
        ...state,
        genres: action.payload,
      };
    case "ADD_GENRE":
      return {
        ...state,
        genres: [...state.genres, action.payload],
      };
    case "UPDATE_GENRE":
      return {
        ...state,
        genres: state.genres.map((genre) =>
          genre._id === action.payload._id ? action.payload : genre
        ),
      };
    case "DELETE_GENRE":
      return {
        ...state,
        genres: state.genres.filter((genre) => genre._id !== action.payload),
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload.user._id ? action.payload.user : user
        ),
        auth: state.auth.user?._id === action.payload.user._id
          ? { ...state.auth, user: action.payload.user }
          : state.auth,
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
          [gameId]: currentReviews.map((r) =>
            r._id === review._id ? review : r
          ),
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
          [gameId]: currentReviews.filter((review) => review._id !== reviewId),
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

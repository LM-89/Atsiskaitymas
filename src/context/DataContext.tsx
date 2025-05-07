import { createContext, useReducer, useContext, useEffect } from "react";
import { appReducer, initialState, AppState, Action } from "./reducer";
import { setAuthHeader, getUserProfile } from "../api/api";

interface DataContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  loginUser: (token: string) => Promise<void>;
  logoutUser: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthHeader(token);
      getUserProfile(token)
        .then(user => {
          dispatch({ type: "SET_AUTH", payload: { user, token } });
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const loginUser = async (token: string) => {
    localStorage.setItem("token", token);
    setAuthHeader(token);
    const user = await getUserProfile(token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "SET_AUTH", payload: { user, token } });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthHeader(null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <DataContext.Provider value={{ state, dispatch, loginUser, logoutUser }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}

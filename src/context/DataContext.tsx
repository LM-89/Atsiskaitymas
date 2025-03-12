import { createContext, useReducer, useContext, useEffect } from "react";
import { appReducer, initialState, AppState, Action } from "./reducer";
import { User } from "../types";

interface DataContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (state.auth.token && storedUser) {
      const user: User = JSON.parse(storedUser);
      dispatch({ type: "SET_AUTH", payload: { user, token: state.auth.token } });
    }
  }, [state.auth.token]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

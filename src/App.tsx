import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { DataProvider, useData } from "./context/DataContext";
import LoginPage from "./pages/LoginPage";
import GamesList from "./pages/GamesList";
import AdminPanel from "./pages/AdminPanel";
import UserProfile from "./pages/UserProfile";
import OtherUserProfile from "./pages/OtherUserProfile";
import GameDetails from "./pages/GameDetails";
import Navbar from "./components/NavBar";
import styles from "./App.module.css";
import { JSX } from "react";

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role?: "admin" | "user" }) => {
  const { state } = useData();
  const { user, token } = state.auth;

  if (token && !user) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/games" />;
  return children;
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Navbar />
        <main className={styles["main-content"]}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="/games" element={<GamesList />} />
            <Route path="/game/:gameId" element={<GameDetails />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:userId"
              element={
                <ProtectedRoute>
                  <OtherUserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </DataProvider>
  );
};

export default App;

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { DataProvider, useData } from "./context/DataContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import GamesList from "./pages/GamesList/GamesList";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import UserProfile from "./pages/UserProfile/UserProfile";
import OtherUserProfile from "./pages/OtherUserProfile/OtherUserProfile";
import GameDetails from "./pages/GameDetails/GameDetails";
import Navbar from "./components/NavBar/NavBar";
import "./App.scss";
import { JSX } from "react";

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role?: "ADMIN" | "USER" }) => {
  const { state } = useData();
  const { user, token } = state.auth;

  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/games" />;
  return children;
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Navbar />
        <main className="body-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
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
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </Router>
    </DataProvider>
  );
};

export default App;

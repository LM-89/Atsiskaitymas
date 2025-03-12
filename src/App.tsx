import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import GamesList from "./pages/GamesList";
import AdminPanel from "./pages/AdminPanel";
import UserProfile from "./pages/UserProfile";
import OtherUserProfile from "./pages/OtherUserProfile";
import "./App.css";
import GameDetails from "./pages/GameDetails";
import { JSX } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}
      {user && <Link to="/profile">Profile</Link>}
      <div className="user-info">
        {user ? (
          <>
            <span>Welcome, {user.nickname || user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role?: "admin" | "user" }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/">
        <Navbar />
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
      </Router>
    </AuthProvider>
  );
};

export default App;

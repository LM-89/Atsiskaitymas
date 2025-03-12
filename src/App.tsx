import { HashRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { DataProvider, useData } from "./context/DataContext";
import LoginPage from "./pages/LoginPage";
import GamesList from "./pages/GamesList";
import AdminPanel from "./pages/AdminPanel";
import UserProfile from "./pages/UserProfile";
import OtherUserProfile from "./pages/OtherUserProfile";
import GameDetails from "./pages/GameDetails";
import "./App.css";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { state, dispatch } = useData();
  const { user } = state.auth;
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}
      {user && <Link to="/profile">Profile</Link>}
      <div className="user-info">
        {user ? (
          <>
            <span>Welcome, {user.nickname || user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role?: "admin" | "user" }) => {
  const { state } = useData();
  const { user } = state.auth;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <DataProvider>
      <Router>
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
    </DataProvider>
  );
};

export default App;

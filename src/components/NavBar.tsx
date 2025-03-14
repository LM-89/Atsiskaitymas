import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { state, dispatch } = useData();
  const { user } = state.auth;
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className={styles["navbar"]}>
      <div>
        <Link className={styles["nav-link"]} to="/games">
          Home
        </Link>
        {user?.role === "admin" && (
          <Link className={styles["nav-link"]} to="/admin">
            Admin Panel
          </Link>
        )}
        {user && (
          <Link className={styles["nav-link"]} to="/profile">
            Profile
          </Link>
        )}
      </div>
      <div className={styles["user-info"]}>
        {user ? (
          <>
            <span>{`Welcome, ${user.nickname || user.email}`}</span>
            <button className={styles["logout-button"]} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link className={styles["nav-link"]} to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

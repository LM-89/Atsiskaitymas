import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import styles from "./NavBar.module.scss";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = () => {
  const { state, logoutUser } = useData();
  const user = state.auth.user;
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/login") return null;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className={styles["navbar"]}>
      <div className={styles["nav-links-container"]}>
        <Link className={styles["nav-link"]} to="/games">
          <HomeIcon fontSize="medium" className={styles["nav-link-icon"]} />
        </Link>
        {user?.role === "ADMIN" && (
          <Link className={styles["nav-link"]} to="/admin">
            <AdminPanelSettingsIcon fontSize="medium" className={styles["nav-link-icon"]} />
          </Link>
        )}
        {user && (
          <Link className={styles["nav-link"]} to="/profile">
            <PersonIcon fontSize="medium" className={styles["nav-link-icon"]} />
          </Link>
        )}
      </div>
      <div className={styles["user-info"]}>
        {user ? (
          <div className={styles["greeting-exit-container"]}>
            <span className={styles["greeting"]}>
              Welcome, <span className={styles["glowing-user-name"]}>{user.username || user.email}</span>
            </span>
            <button
              className={styles["logout-button"]}
              onClick={handleLogout}
              title="Logout"
            >
              <LogoutSharpIcon fontSize="medium" className={styles["nav-link-icon"]} />
            </button>
          </div>
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

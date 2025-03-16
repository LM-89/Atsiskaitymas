import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import styles from "./NavBar.module.scss";
import "../../App.scss"
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

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
      <div className={styles["nav-links-container"]}>
        <Link className={styles["nav-link"]} to="/games">
          <HomeIcon fontSize="medium" className={styles["nav-link-icon"]}/>
        </Link>
        {user?.role === "admin" && (
          <Link className={styles["nav-link"]} to="/admin">
            <span className="nav-icon">
              <AdminPanelSettingsIcon fontSize="medium" className={styles["nav-link-icon"]}/>
            </span>
            <span className="nav-text">Admin Panel</span>
          </Link>
        )}
        {user && (
          <Link className={styles["nav-link"]} to="/profile">
            <span className="nav-icon">
              <PersonIcon fontSize="medium" className={styles["nav-link-icon"]}/>
            </span>
            <span className="nav-text">Profile</span>
          </Link>
        )}
      </div>
      <div className={styles["user-info"]}>
        {user ? (
          <div className={styles["greeting-exit-container"]}>
            <span className={styles["greeting"]}>Welcome, <span className={styles["glowing-user-name"]}>{user.nickname || user.email}</span></span>
            <button className={styles["logout-button"]} onClick={handleLogout}>
              <span className="nav-icon">
                <LogoutSharpIcon fontSize="medium" className={`${styles["nav-link-icon"]} logout-button`}/>
              </span>
              <span className="nav-text">Logout</span>
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

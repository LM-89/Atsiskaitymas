import React from "react";
import styles from "./AuthForm.module.scss";
import "../../App.scss";

interface AuthFormProps {
  isLogin: boolean;
  formData: {
    email: string;
    password: string;
    name: string;
    surname: string;
    username: string;
  };
  error: string;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleForm: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  formData,
  error,
  onChange,
  onSubmit,
  onToggleForm,
}) => {
  return (
    <div className={styles["auth-form-container"]}>
      <form className={styles["auth-form"]} onSubmit={onSubmit}>
        <h2 className={styles["heading"]}>{isLogin ? "Login" : "Register"}</h2>
        {!isLogin && (
          <>
            <div className={styles["form-control"]}>
              <label htmlFor="name" className={styles["label"]}>
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(event) => onChange("name", event.target.value)}
                required
                className={styles["input"]}
              />
            </div>
            <div className={styles["form-control"]}>
              <label htmlFor="surname" className={styles["label"]}>
                Surname
              </label>
              <input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={(event) => onChange("surname", event.target.value)}
                required
                className={styles["input"]}
              />
            </div>
            <div className={styles["form-control"]}>
              <label htmlFor="username" className={styles["label"]}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(event) => onChange("username", event.target.value)}
                required
                className={styles["input"]}
              />
            </div>
          </>
        )}
        <div className={styles["form-control"]}>
          <label htmlFor="email" className={styles["label"]}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) => onChange("email", event.target.value)}
            required
            className={styles["input"]}
          />
        </div>
        <div className={styles["form-control"]}>
          <label htmlFor="password" className={styles["label"]}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(event) => onChange("password", event.target.value)}
            required
            className={styles["input"]}
          />
        </div>

        <div className={styles["actions"]}>
          <button type="submit" className={styles["submit-button"]}>
            {isLogin ? "Login" : "Register"}
          </button>
          <button type="button" onClick={onToggleForm} className={styles["toggle-button"]}>
            {isLogin ? "Create new account" : "Already have an account? Login"}
          </button>
        </div>
        {error && <p className={`${styles["error"]} error`}>{error}</p>}
      </form>
    </div>
  );
};

export default AuthForm;

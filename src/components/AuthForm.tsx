import React from "react";
import styles from "./AuthForm.module.css";

interface AuthFormProps {
  isLogin: boolean;
  formData: {
    email: string;
    password: string;
    name: string;
    surname: string;
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
                onChange={(e) => onChange("name", e.target.value)}
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
                onChange={(e) => onChange("surname", e.target.value)}
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
            onChange={(e) => onChange("email", e.target.value)}
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
            onChange={(e) => onChange("password", e.target.value)}
            required
            className={styles["input"]}
          />
        </div>
        <button type="submit" className={styles["submit-button"]}>
          {isLogin ? "Login" : "Register"}
        </button>
        <button type="button" onClick={onToggleForm} className={styles["toggle-button"]}>
          {isLogin ? "Create new account" : "Already have an account? Login"}
        </button>
        {error && <p className={styles["error"]}>{error}</p>}
      </form>
    </div>
  );
};

export default AuthForm;

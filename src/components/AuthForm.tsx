import React from "react";

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
    <form onSubmit={onSubmit}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {!isLogin && (
        <>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              type="text"
              value={formData.surname}
              onChange={(e) => onChange("surname", e.target.value)}
              required
            />
          </div>
        </>
      )}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          required
        />
      </div>
      <button type="submit">{isLogin ? "Login" : "Register"}</button>
      <button type="button" onClick={onToggleForm}>
        {isLogin ? "Create new account" : "Already have an account? Login"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default AuthForm;

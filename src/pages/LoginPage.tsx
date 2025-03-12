import React, { useState } from "react";
import { loginUser, registerUser } from "../api/api";
import { useData } from "../context/DataContext";
import { Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  const { state, dispatch } = useData();
  const { auth } = state;
  const { user } = auth;

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
  });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/games" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await loginUser(formData.email, formData.password);
        dispatch({ type: "SET_AUTH", payload: { user: data.user, token: data.token } });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        const data = await registerUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname,
          role: "user",
          nickname: "",
        });
        dispatch({ type: "SET_AUTH", payload: { user: data.user, token: data.token } });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", name: "", surname: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="login-modal">
      <div className="login-content">
        <AuthForm
          isLogin={isLogin}
          formData={formData}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onToggleForm={handleToggleForm}
        />
      </div>
    </div>
  );
};

export default LoginPage;

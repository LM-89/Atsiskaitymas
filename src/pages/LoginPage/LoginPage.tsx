import React, { useState } from "react";
import { loginUser as apiLoginUser, registerUser } from "../../api/api";
import { useData } from "../../context/DataContext";
import { Navigate, useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import "../../App.scss";

const LoginPage = () => {
  const { state, loginUser } = useData();
  const user = state.auth.user;
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    username: "",
  });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/games" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await apiLoginUser(formData.email, formData.password);
        await loginUser(data.token);
        navigate("/games");
      } else {
        const data = await registerUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname,
          username: formData.username,
          role: "USER",
        });
        await loginUser(data.token);
        navigate("/games");
      }
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", name: "", surname: "", username: "" });
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

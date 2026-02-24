// src/pages/Signup.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../../css/auth.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
  });
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(form);
    alert("Signup successful!");
    navigate("/insurer/login");
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Insurer Signup</h2>
        {["name", "companyName", "email", "password"].map((field) => (
          <div key={field} className="auth-form-group">
            <input
              type={field === "password" ? "password" : "text"}
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="auth-input"
              required
            />
          </div>
        ))}
        <button type="submit" className="auth-btn">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;

import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!username || !email || !password) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      toast.success("Registration successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");

      toast.error(err.response?.data?.message || "Registration failed.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <p>Please register to continue</p>
          <div className="inputGroup">
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
            />
            <span className="inputIcon">👤</span>
          </div>
          <div className="inputGroup">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <span className="inputIcon">📧</span>
          </div>
          <div className="inputGroup">
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <span className="inputIcon">🔒</span>
          </div>
          <button disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          {error && <span className="error">{error}</span>}
          <div className="links">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginFormProps {
  variant?: "user" | "admin";
}

export function LoginForm({ variant = "user" }: LoginFormProps) {
  const isAdmin = variant === "admin";
  const navigate = useNavigate();

  // Toggle between login and register
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { alert("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const url =
        variant === "admin"
          ? "http://localhost:8080/api/admin/login"
          : "http://localhost:8080/api/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await res.text();

      // ── Admin login flow ──
      if (variant === "admin") {
        if (responseText === "Admin Login Success") {
          alert("Login Successful ✅");
          sessionStorage.setItem("role", "admin");
          sessionStorage.setItem("adminEmail", email);
          navigate("/admin-dashboard");
        } else {
          alert("Invalid admin credentials ❌");
        }
        return;
      }

      // ── User login flow ──
      if (responseText === "INVALID") {
        alert("Invalid email or password ❌");
        return;
      }

      if (responseText === "ADMIN") {
        alert("⚠️ You are an ADMIN. Please login from Admin page.");
        return;
      }

      if (responseText === "UNVERIFIED") {
        alert("⏳ Your account is pending verification.\nAn admin will review and verify your account shortly.");
        return;
      }

      // USER success
      alert("Login Successful ✅");
      sessionStorage.setItem("role", "user");
      sessionStorage.setItem("userEmail", email);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields."); return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match ❌"); return;
    }
    if (password.length < 4) {
      alert("Password must be at least 4 characters."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.status === "REGISTERED") {
        alert("✅ Registration successful!\n⏳ Your account is pending admin verification.\nYou'll be able to login once verified.");
        setMode("login");
        setName("");
        setPassword("");
        setConfirmPassword("");
      } else if (data.status === "EXISTS") {
        alert("❌ An account with this email already exists.");
      } else if (data.status === "ADMIN_EMAIL") {
        alert("❌ This email is reserved for admins.");
      } else {
        alert("Registration failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">

      {/* LOGO */}
      <Link to="/">
        <img
          src="/campusLost.png"
          alt="logo"
          width={110}
          height={110}
          className="mx-auto"
          style={{ paddingBottom: "20px" }}
        />
      </Link>

      {/* ADMIN TITLE */}
      {isAdmin && <h2 className="admin-subtitle">Admin Portal</h2>}

      {/* DIVIDER */}
      <div className="login-divider">
        <span className="mx-auto text-xl">
          {isAdmin ? "Admin Login" : mode === "login" ? "Sign In" : "Create Account"}
        </span>
      </div>

      {/* INPUT FIELDS */}
      <div className="login-fields">

        {/* Name — only in register mode */}
        {!isAdmin && mode === "register" && (
          <div className="field-row">
            <label className="field-label">Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="field-row">
          <label className="field-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field-row">
          <label className="field-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm password — only in register mode */}
        {!isAdmin && mode === "register" && (
          <div className="field-row">
            <label className="field-label">Confirm</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="field-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* BUTTON */}
      <button
        className="signin-btn"
        onClick={mode === "register" ? handleRegister : handleLogin}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Please wait…" : mode === "register" ? "Register" : "Sign In"}{" "}
        <span className="signin-arrow">&gt;</span>
      </button>

      {/* TOGGLE LOGIN / REGISTER (user only) */}
      {!isAdmin && (
        <p className="switch-login-prompt" style={{ marginTop: 12 }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="switch-login-link"
                style={{ cursor: "pointer" }}
                onClick={() => { setMode("register"); setPassword(""); }}
              >
                Register here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="switch-login-link"
                style={{ cursor: "pointer" }}
                onClick={() => { setMode("login"); setPassword(""); setConfirmPassword(""); }}
              >
                Sign in
              </span>
            </>
          )}
        </p>
      )}

      {/* SWITCH LOGIN */}
      <p className="switch-login-prompt">
        {isAdmin ? (
          <>
            Are you a User?{" "}
            <Link to="/login" className="switch-login-link">Click here!</Link>
          </>
        ) : (
          <>
            Are you an Admin?{" "}
            <Link to="/admin-login" className="switch-login-link">Click here!</Link>
          </>
        )}
      </p>
    </div>
  );
}

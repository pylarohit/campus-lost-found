import React from "react";
import { LoginForm } from "./_components/LoginForm";
import { Showcase } from "./_components/Showcase";

export default function UserLoginPage() {
  return (
    <div className="login-page">
      {/* LEFT — Login Form */}
      <div className="login-side form-side">
        <LoginForm variant="user" />
      </div>

      {/* RIGHT — Showcase */}
      <div className="login-side showcase-side">
        <Showcase tagline={`\u201CIntelligent Lost &\nFound Locator.\u201D`} />
      </div>
    </div>
  );
}

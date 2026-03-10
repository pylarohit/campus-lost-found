import React from "react";
import { LoginForm } from "./_components/LoginForm";
import { Showcase } from "./_components/Showcase";

export default function AdminLoginPage() {
    return (
        <div className="login-page">
            {/* LEFT — Showcase */}
            <div className="login-side showcase-side">
                <Showcase tagline={`\u201CHelping students recover\nwhat matters most.\u201D`} />
            </div>

            {/* RIGHT — Admin Login Form */}
            <div className="login-side form-side">
                <LoginForm variant="admin" />
            </div>
        </div>
    );
}

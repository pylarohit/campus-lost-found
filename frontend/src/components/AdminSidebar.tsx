import React, { useState, CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    BarChart3,
    Flag,
    LogOut,
    Shield,
    PackageOpen,
    MessageCircle,
    ShieldAlert,
} from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin-dashboard" },
    { id: "lost-found", label: "Lost & Found", icon: <PackageOpen size={20} />, path: "/admin-posts" },
    { id: "verification", label: "Verification", icon: <Flag size={20} />, path: "/admin-users" },
    { id: "users", label: "All Users", icon: <Users size={20} />, path: "/admin-users" },
    { id: "support-chat", label: "Support Chat", icon: <MessageCircle size={20} />, path: "/admin-chat" },
    { id: "reports", label: "Message Reports", icon: <ShieldAlert size={20} />, path: "/admin-reports" },
    { id: "settings", label: "Settings", icon: <Settings size={20} />, path: "/admin-settings" },
];


// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    sidebar: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: 230,
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "22px 20px 18px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
    },
    logoIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        flexShrink: 0,
    },
    brandText: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    brandName: {
        fontSize: "1.05rem",
        fontWeight: 700,
        color: "#f1f5f9",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
    },
    brandTagline: {
        fontSize: "0.65rem",
        fontWeight: 500,
        color: "rgba(148, 163, 184, 0.65)",
        letterSpacing: "0.02em",
    },
    nav: {
        flex: 1,
        padding: "14px 12px",
        overflowY: "auto",
        overflowX: "hidden",
    },
    navList: {
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    navItem: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 14px",
        border: "none",
        borderRadius: 10,
        background: "transparent",
        color: "#8896ab",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
    },
    navItemActive: {
        background: "#6366f1",
        color: "#ffffff",
        fontWeight: 600,
        boxShadow: "0 2px 10px rgba(99, 102, 241, 0.35)",
    },
    navIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: 20,
        height: 20,
    },
    navLabel: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    bottom: {
        padding: "12px 12px 18px",
        borderTop: "1px solid rgba(255, 255, 255, 0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    user: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 10,
        transition: "background 0.2s ease",
        cursor: "pointer",
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.02em",
        flexShrink: 0,
    },
    userInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
        overflow: "hidden",
    },
    userName: {
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "#e2e8f0",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textTransform: "capitalize" as const,
        lineHeight: 1.3,
    },
    userRole: {
        fontSize: "0.65rem",
        color: "#818cf8",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: 1.3,
    },
    logout: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "9px 14px",
        border: "none",
        borderRadius: 10,
        background: "rgba(239, 68, 68, 0.1)",
        color: "#f87171",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.84rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
};

// ── Component ───────────────────────────────

interface AdminSidebarProps {
    isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [hoveredLogout, setHoveredLogout] = useState(false);
    const [hoveredUser, setHoveredUser] = useState(false);

    const adminEmail = localStorage.getItem("adminEmail") || "";
    if (!adminEmail && localStorage.getItem("role") === "admin") {
        navigate("/admin-login");
    }
    const displayEmail = adminEmail || "admin@campus.edu";
    const adminName = displayEmail.split("@")[0];
    const initials = adminName
        .split(/[._-]/)
        .map((seg) => seg[0]?.toUpperCase())
        .join("")
        .slice(0, 2);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/admin-login");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            style={{
                ...s.sidebar,
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            }}
        >
            {/* Brand */}
            <div style={s.brand}>
                <div style={s.logoIcon}>
                    <Shield size={20} color="#fff" />
                </div>
                <div style={s.brandText}>
                    <span style={s.brandName}>CampusTrack</span>
                    <span style={s.brandTagline}>Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={s.nav}>
                <ul style={s.navList}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const hovered = hoveredNav === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    style={{
                                        ...s.navItem,
                                        ...(active ? s.navItemActive : {}),
                                        ...(!active && hovered
                                            ? { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
                                            : {}),
                                    }}
                                    onClick={() => navigate(item.path)}
                                    onMouseEnter={() => setHoveredNav(item.id)}
                                    onMouseLeave={() => setHoveredNav(null)}
                                >
                                    <span style={s.navIcon}>{item.icon}</span>
                                    <span style={s.navLabel}>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom */}
            <div style={s.bottom}>
                <div
                    style={{
                        ...s.user,
                        ...(hoveredUser ? { background: "rgba(255,255,255,0.05)" } : {}),
                    }}
                    onMouseEnter={() => setHoveredUser(true)}
                    onMouseLeave={() => setHoveredUser(false)}
                >
                    <div style={s.avatar}>{initials}</div>
                    <div style={s.userInfo}>
                        <span style={s.userName}>{adminName}</span>
                        <span style={s.userRole}>Administrator</span>
                    </div>
                </div>

                <button
                    style={{
                        ...s.logout,
                        ...(hoveredLogout
                            ? { background: "rgba(239,68,68,0.18)", color: "#fca5a5" }
                            : {}),
                    }}
                    onClick={handleLogout}
                    onMouseEnter={() => setHoveredLogout(true)}
                    onMouseLeave={() => setHoveredLogout(false)}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Scrollbar & responsive */}
            <style>{`
        nav::-webkit-scrollbar { width: 3px; }
        nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          aside {
            box-shadow: 4px 0 24px rgba(0,0,0,0.3);
            width: 260px !important;
          }
        }
        @media (max-width: 480px) {
          aside { width: 240px !important; }
        }
      `}</style>
        </aside>
    );
}

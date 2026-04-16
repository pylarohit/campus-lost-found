import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
    Search,
    MoreVertical,
    Check,
    Trash2,
    Edit3,
    Flag,
    Image as ImageIcon,
} from "lucide-react";

// ── Post interface ──────────────────────────

interface PostItem {
    id: number;
    title: string;
    postedBy: string;
    date: string;
    status: "active" | "flagged" | "pending";
    thumbnail: string;
}

// ── Mock data ───────────────────────────────

const allPosts: PostItem[] = [
    { id: 1, title: "Lost textbook", postedBy: "Alex Chen", date: "Feb 22", status: "active", thumbnail: "📘" },
    { id: 2, title: "Selling bike", postedBy: "Sarah Lee", date: "Feb 21", status: "flagged", thumbnail: "🚲" },
    { id: 3, title: "Looking for roommate", postedBy: "David Kim", date: "Feb 20", status: "active", thumbnail: "🏠" },
    { id: 4, title: "Lost wallet (brown)", postedBy: "Emily Park", date: "Feb 19", status: "pending", thumbnail: "👛" },
    { id: 5, title: "Found AirPods Pro", postedBy: "James Wu", date: "Feb 18", status: "active", thumbnail: "🎧" },
    { id: 6, title: "Missing calculator", postedBy: "Lisa Zhao", date: "Feb 17", status: "flagged", thumbnail: "🧮" },
    { id: 7, title: "Lost campus ID card", postedBy: "Ryan Patel", date: "Feb 16", status: "active", thumbnail: "🪪" },
    { id: 8, title: "Spam listing", postedBy: "Unknown", date: "Feb 15", status: "flagged", thumbnail: "⚠️" },
];

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: {
        maxWidth: 900,
        margin: "0 auto",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    backBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        border: "none",
        borderRadius: 8,
        background: "#f1f5f9",
        color: "#334155",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "all 0.2s ease",
    },
    title: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "1.35rem",
        fontWeight: 700,
        color: "#0f172a",
        margin: 0,
    },
    tabs: {
        display: "flex",
        gap: 0,
        marginBottom: 20,
        borderBottom: "2px solid #e2e8f0",
    },
    tab: {
        padding: "10px 24px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        fontWeight: 600,
        color: "#64748b",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginBottom: -2,
    },
    tabActive: {
        color: "#6366f1",
        borderBottomColor: "#6366f1",
    },
    searchBar: {
        position: "relative",
        marginBottom: 20,
    },
    searchIcon: {
        position: "absolute",
        left: 14,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
        pointerEvents: "none" as const,
    },
    searchInput: {
        width: "100%",
        padding: "10px 16px 10px 42px",
        border: "1.5px solid #e2e8f0",
        borderRadius: 10,
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem",
        color: "#334155",
        background: "#fff",
        outline: "none",
        transition: "all 0.2s ease",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    postItem: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 12,
        background: "#fff",
        border: "1px solid #f1f5f9",
        transition: "all 0.2s ease",
        cursor: "pointer",
    },
    postThumbnail: {
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.3rem",
        flexShrink: 0,
        border: "1px solid #e2e8f0",
    },
    postInfo: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "hidden",
    },
    postTitle: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        fontWeight: 600,
        color: "#0f172a",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    postMeta: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem",
        color: "#94a3b8",
    },
    postActions: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexShrink: 0,
    },
    actionBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        border: "none",
        borderRadius: 8,
        background: "transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: "#64748b",
    },
    statusBadge: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.65rem",
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 20,
        whiteSpace: "nowrap",
    },
    emptyState: {
        textAlign: "center",
        padding: "48px 20px",
        color: "#94a3b8",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.9rem",
    },
};

const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
    flagged: { bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
};

// ── Component ───────────────────────────────

export default function AdminPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const isFlaggedRoute = location.pathname === "/admin-flagged";
    const [activeTab, setActiveTab] = useState<"posts" | "flagged">(
        isFlaggedRoute ? "flagged" : "posts"
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredPost, setHoveredPost] = useState<number | null>(null);
    const [hoveredAction, setHoveredAction] = useState<string | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        if (role !== "admin") navigate("/admin-login");
    }, [navigate]);

    const filteredPosts = allPosts.filter((post) => {
        const matchesTab = activeTab === "flagged" ? post.status === "flagged" : true;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.postedBy.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <AdminLayout>
            <div style={s.page} className="admin-panel-anim">
                {/* Header */}
                <div style={s.header}>
                    <button
                        style={{
                            ...s.backBtn,
                            ...(hoveredAction === "back" ? { background: "#e2e8f0" } : {}),
                        }}
                        onClick={() => navigate("/admin-dashboard")}
                        onMouseEnter={() => setHoveredAction("back")}
                        onMouseLeave={() => setHoveredAction(null)}
                    >
                        ←
                    </button>
                    <h2 style={s.title}>Admin Panel</h2>
                </div>

                {/* Tabs */}
                <div style={s.tabs}>
                    <button
                        style={{
                            ...s.tab,
                            ...(activeTab === "posts" ? s.tabActive : {}),
                        }}
                        onClick={() => setActiveTab("posts")}
                    >
                        Posts
                    </button>
                    <button
                        style={{
                            ...s.tab,
                            ...(activeTab === "flagged" ? s.tabActive : {}),
                        }}
                        onClick={() => setActiveTab("flagged")}
                    >
                        Flagged
                    </button>
                </div>

                {/* Search */}
                <div style={s.searchBar}>
                    <Search size={18} style={s.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        style={{
                            ...s.searchInput,
                            ...(searchFocused
                                ? { borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99,102,241,0.08)" }
                                : {}),
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                </div>

                {/* Post List */}
                <div style={s.list}>
                    {filteredPosts.length === 0 ? (
                        <div style={s.emptyState}>No posts found.</div>
                    ) : (
                        filteredPosts.map((post) => {
                            const sc = statusColors[post.status];
                            return (
                                <div
                                    key={post.id}
                                    style={{
                                        ...s.postItem,
                                        ...(hoveredPost === post.id
                                            ? { background: "#f8fafc", borderColor: "#e2e8f0" }
                                            : {}),
                                    }}
                                    onMouseEnter={() => setHoveredPost(post.id)}
                                    onMouseLeave={() => setHoveredPost(null)}
                                >
                                    <div style={s.postThumbnail}>{post.thumbnail}</div>
                                    <div style={s.postInfo}>
                                        <span style={s.postTitle}>{post.title}</span>
                                        <span style={s.postMeta}>
                                            Posted by {post.postedBy} · {post.date}
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            ...s.statusBadge,
                                            background: sc.bg,
                                            color: sc.color,
                                        }}
                                    >
                                        {post.status}
                                    </span>
                                    <div style={s.postActions}>
                                        <button
                                            style={{
                                                ...s.actionBtn,
                                                ...(hoveredAction === `approve-${post.id}`
                                                    ? { background: "rgba(34,197,94,0.1)", color: "#16a34a" }
                                                    : {}),
                                            }}
                                            title="Approve"
                                            onMouseEnter={() => setHoveredAction(`approve-${post.id}`)}
                                            onMouseLeave={() => setHoveredAction(null)}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            style={{
                                                ...s.actionBtn,
                                                ...(hoveredAction === `edit-${post.id}`
                                                    ? { background: "rgba(59,130,246,0.1)", color: "#3b82f6" }
                                                    : {}),
                                            }}
                                            title="Edit"
                                            onMouseEnter={() => setHoveredAction(`edit-${post.id}`)}
                                            onMouseLeave={() => setHoveredAction(null)}
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            style={{
                                                ...s.actionBtn,
                                                ...(hoveredAction === `delete-${post.id}`
                                                    ? { background: "rgba(239,68,68,0.1)", color: "#dc2626" }
                                                    : {}),
                                            }}
                                            title="Delete"
                                            onMouseEnter={() => setHoveredAction(`delete-${post.id}`)}
                                            onMouseLeave={() => setHoveredAction(null)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Animations + Responsive */}
            <style>{`
        .admin-panel-anim {
          animation: panelIn 0.35s ease;
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .admin-panel-anim {
            max-width: 100% !important;
          }
        }
      `}</style>
        </AdminLayout>
    );
}

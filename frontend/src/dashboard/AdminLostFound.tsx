import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
    Search,
    Check,
    Trash2,
    Edit3,
    Flag,
    X,
    Eye,
    Filter,
    AlertTriangle,
    CheckCircle,
    Clock,
    Image as ImageIcon,
    MapPin,
    User,
    ChevronDown,
    PackageOpen,
    RefreshCw,
    Shield,
} from "lucide-react";

// ── Types ───────────────────────────────────

interface PostItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    category: string;
    tags: string;
    imageUrl: string;
    status: string;
    flagged: boolean;
    flagReason?: string;
    createdAt?: string;
    owner: string; // reportedBy or foundBy
    type: "lost" | "found";
}

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: { maxWidth: 1000, margin: "0 auto" },

    /* Header */
    header: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
    },
    headerLeft: { display: "flex", alignItems: "center", gap: 12 },
    backBtn: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, border: "none", borderRadius: 10,
        background: "#f1f5f9", color: "#334155", cursor: "pointer",
        fontSize: "1rem", transition: "all 0.2s ease",
    },
    title: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.4rem",
        fontWeight: 700, color: "#0f172a", margin: 0,
    },
    refreshBtn: {
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0",
        background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
        fontWeight: 600, color: "#475569", cursor: "pointer", transition: "all 0.2s ease",
    },

    /* Stats Row */
    statsRow: {
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
        marginBottom: 24,
    },
    statCard: {
        padding: "16px", borderRadius: 12, background: "#fff",
        border: "1px solid #e2e8f0", display: "flex", alignItems: "center",
        gap: 12, transition: "all 0.2s ease",
    },
    statIcon: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
    },
    statInfo: { display: "flex", flexDirection: "column", gap: 2 },
    statValue: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.3rem",
        fontWeight: 700, color: "#0f172a", lineHeight: 1.2,
    },
    statLabel: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.7rem",
        fontWeight: 500, color: "#64748b",
    },

    /* Tabs */
    tabs: {
        display: "flex", gap: 0, marginBottom: 20,
        borderBottom: "2px solid #e2e8f0",
    },
    tab: {
        padding: "10px 24px", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", fontWeight: 600, color: "#64748b",
        background: "transparent", border: "none",
        borderBottom: "2px solid transparent", cursor: "pointer",
        transition: "all 0.2s ease", marginBottom: -2,
        display: "flex", alignItems: "center", gap: 6,
    },
    tabActive: { color: "#6366f1", borderBottomColor: "#6366f1" },
    tabBadge: {
        padding: "1px 7px", borderRadius: 10, fontFamily: "'Inter', sans-serif",
        fontSize: "0.62rem", fontWeight: 700,
    },

    /* Search & Filter */
    controlRow: {
        display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap",
    },
    searchBar: { position: "relative", flex: 1, minWidth: 200 },
    searchIcon: {
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: "#94a3b8", pointerEvents: "none" as const,
    },
    searchInput: {
        width: "100%", padding: "10px 16px 10px 42px",
        border: "1.5px solid #e2e8f0", borderRadius: 10,
        fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
        color: "#334155", background: "#fff", outline: "none",
        transition: "all 0.2s ease", boxSizing: "border-box" as const,
    },
    filterSelect: {
        padding: "10px 32px 10px 12px", borderRadius: 10,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.82rem", color: "#334155", background: "#fff",
        cursor: "pointer", outline: "none", appearance: "none" as const,
    },

    /* Post List */
    list: { display: "flex", flexDirection: "column", gap: 6 },
    postItem: {
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px", borderRadius: 12, background: "#fff",
        border: "1px solid #f1f5f9", transition: "all 0.2s ease",
    },
    postThumbnail: {
        width: 48, height: 48, borderRadius: 10, flexShrink: 0,
        overflow: "hidden", background: "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid #e2e8f0",
    },
    postInfo: {
        flex: 1, display: "flex", flexDirection: "column",
        gap: 3, overflow: "hidden",
    },
    postTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.88rem",
        fontWeight: 650, color: "#0f172a", whiteSpace: "nowrap",
        overflow: "hidden", textOverflow: "ellipsis",
    },
    postMeta: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
        color: "#94a3b8", display: "flex", gap: 12, alignItems: "center",
    },
    postBadges: {
        display: "flex", gap: 6, alignItems: "center", flexShrink: 0,
    },
    statusBadge: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.62rem",
        fontWeight: 700, padding: "3px 10px", borderRadius: 20,
        whiteSpace: "nowrap",
    },
    typeBadge: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.62rem",
        fontWeight: 700, padding: "3px 10px", borderRadius: 20,
        whiteSpace: "nowrap",
    },
    postActions: {
        display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
    },
    actionBtn: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 32, height: 32, border: "none", borderRadius: 8,
        background: "transparent", cursor: "pointer",
        transition: "all 0.2s ease", color: "#64748b",
    },

    /* Empty */
    emptyState: {
        textAlign: "center", padding: "48px 20px", color: "#94a3b8",
        fontFamily: "'Inter', sans-serif", fontSize: "0.9rem",
    },

    /* Modal */
    overlay: {
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)", zIndex: 1000, display: "flex",
        alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease",
    },
    modal: {
        background: "#fff", borderRadius: 16, width: "90%", maxWidth: 520,
        maxHeight: "90vh", overflowY: "auto", padding: "28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", position: "relative",
        animation: "modalSlideUp 0.3s ease",
    },
    modalHeader: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20,
    },
    modalTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.1rem",
        fontWeight: 700, color: "#0f172a", margin: 0,
    },
    modalClose: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: 8, border: "none",
        background: "#f1f5f9", color: "#64748b", cursor: "pointer",
        transition: "all 0.2s ease",
    },
    formGroup: { marginBottom: 16 },
    formLabel: {
        display: "block", fontFamily: "'Inter', sans-serif",
        fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: 6,
    },
    formInput: {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", color: "#0f172a", outline: "none",
        boxSizing: "border-box" as const, background: "#fff",
    },
    formTextarea: {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", color: "#0f172a", outline: "none",
        resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" as const,
    },
    saveBtn: {
        width: "100%", padding: "12px", borderRadius: 10, border: "none",
        fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 600,
        cursor: "pointer", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", marginTop: 8,
    },
};

const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
    flagged: { bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
    recovered: { bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    claimed: { bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
};

const typeColors: Record<string, { bg: string; color: string }> = {
    lost: { bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    found: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
};

// ── Component ───────────────────────────────

export default function AdminLostFound() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"all" | "lost" | "found" | "flagged" | "pending">("pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredPost, setHoveredPost] = useState<string | null>(null);
    const [hoveredAction, setHoveredAction] = useState<string | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [editItem, setEditItem] = useState<PostItem | null>(null);
    const [viewItem, setViewItem] = useState<PostItem | null>(null);

    // Edit form state
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editLocation, setEditLocation] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editStatus, setEditStatus] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") navigate("/admin-login");
    }, [navigate]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const [lostRes, foundRes] = await Promise.all([
                fetch("http://localhost:8080/api/admin/lost/all"),
                fetch("http://localhost:8080/api/admin/found/all"),
            ]);
            const allPosts: PostItem[] = [];
            if (lostRes.ok) {
                const lostData = await lostRes.json();
                allPosts.push(...lostData.map((i: any) => ({
                    ...i, owner: i.reportedBy || "Unknown", type: "lost" as const,
                    status: i.status || "pending",
                })));
            }
            if (foundRes.ok) {
                const foundData = await foundRes.json();
                allPosts.push(...foundData.map((i: any) => ({
                    ...i, owner: i.foundBy || "Unknown", type: "found" as const,
                    status: i.status || "pending",
                })));
            }
            setPosts(allPosts);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    // Actions
    const handleApprove = async (item: PostItem) => {
        try {
            await fetch(`http://localhost:8080/api/admin/${item.type}/${item.id}/approve`, { method: "PUT" });
            fetchPosts();
        } catch { alert("Failed to approve."); }
    };

    const handleDelete = async (item: PostItem) => {
        if (!window.confirm(`Delete "${item.itemName}"?`)) return;
        try {
            await fetch(`http://localhost:8080/api/admin/${item.type}/${item.id}`, { method: "DELETE" });
            fetchPosts();
        } catch { alert("Failed to delete."); }
    };

    const openEdit = (item: PostItem) => {
        setEditItem(item);
        setEditName(item.itemName);
        setEditDesc(item.description || "");
        setEditLocation(item.location || "");
        setEditCategory(item.category || "");
        setEditStatus(item.status);
    };

    const handleSaveEdit = async () => {
        if (!editItem) return;
        try {
            await fetch(`http://localhost:8080/api/admin/${editItem.type}/${editItem.id}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemName: editName, description: editDesc,
                    location: editLocation, category: editCategory,
                    status: editStatus,
                }),
            });
            setEditItem(null);
            fetchPosts();
        } catch { alert("Failed to save changes."); }
    };

    // Filter
    const filteredPosts = posts.filter(post => {
        const matchesTab =
            activeTab === "all" ? true :
                activeTab === "lost" ? post.type === "lost" :
                    activeTab === "found" ? post.type === "found" :
                        activeTab === "pending" ? post.status === "pending" :
                            post.flagged;
        const matchesStatus = statusFilter === "all" || post.status === statusFilter;
        const matchesSearch =
            post.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.category || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesStatus && matchesSearch;
    });

    // Stats
    const totalLost = posts.filter(p => p.type === "lost").length;
    const totalFound = posts.filter(p => p.type === "found").length;
    const totalFlagged = posts.filter(p => p.flagged).length;
    const totalPending = posts.filter(p => p.status === "pending").length;
    const totalActive = posts.filter(p => p.status === "active").length;

    return (
        <AdminLayout>
            <div style={s.page} className="admin-lf-anim">

                {/* Header */}
                <div style={s.header}>
                    <div style={s.headerLeft}>
                        <button
                            style={{
                                ...s.backBtn,
                                ...(hoveredAction === "back" ? { background: "#e2e8f0" } : {}),
                            }}
                            onClick={() => navigate("/admin-dashboard")}
                            onMouseEnter={() => setHoveredAction("back")}
                            onMouseLeave={() => setHoveredAction(null)}
                        >←</button>
                        <div>
                            <h2 style={s.title}>Content Moderation</h2>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#64748b", margin: 0, marginTop: 2 }}>
                                Manage all lost & found posts
                            </p>
                        </div>
                    </div>
                    <button
                        style={{
                            ...s.refreshBtn,
                            ...(hoveredAction === "refresh" ? { background: "#f8fafc", borderColor: "#cbd5e1" } : {}),
                        }}
                        onClick={fetchPosts}
                        onMouseEnter={() => setHoveredAction("refresh")}
                        onMouseLeave={() => setHoveredAction(null)}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Stats */}
                <div style={s.statsRow} className="admin-lf-stats">
                    {[
                        { label: "Pending", value: totalPending, icon: <Clock size={18} />, bgIcon: "rgba(245,158,11,0.1)", colorIcon: "#d97706" },
                        { label: "Lost Items", value: totalLost, icon: <PackageOpen size={18} />, bgIcon: "rgba(239,68,68,0.1)", colorIcon: "#dc2626" },
                        { label: "Found Items", value: totalFound, icon: <CheckCircle size={18} />, bgIcon: "rgba(16,185,129,0.1)", colorIcon: "#059669" },
                        { label: "Approved", value: totalActive, icon: <Shield size={18} />, bgIcon: "rgba(99,102,241,0.1)", colorIcon: "#6366f1" },
                    ].map((stat, i) => (
                        <div key={i} style={s.statCard}>
                            <div style={{ ...s.statIcon, background: stat.bgIcon, color: stat.colorIcon }}>
                                {stat.icon}
                            </div>
                            <div style={s.statInfo as any}>
                                <span style={s.statValue}>{stat.value}</span>
                                <span style={s.statLabel}>{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={s.tabs}>
                    {([
                        { key: "pending", label: "⏳ Pending", count: totalPending },
                        { key: "all", label: "All Posts", count: posts.length },
                        { key: "lost", label: "Lost", count: totalLost },
                        { key: "found", label: "Found", count: totalFound },
                        { key: "flagged", label: "Flagged", count: totalFlagged },
                    ] as const).map(tab => (
                        <button
                            key={tab.key}
                            style={{
                                ...s.tab,
                                ...(activeTab === tab.key ? s.tabActive : {}),
                            }}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            <span style={{
                                ...s.tabBadge,
                                background: activeTab === tab.key ? "rgba(99,102,241,0.1)" : "#f1f5f9",
                                color: activeTab === tab.key ? "#6366f1" : "#94a3b8",
                            }}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Search & Filter */}
                <div style={s.controlRow}>
                    <div style={s.searchBar as any}>
                        <Search size={18} style={s.searchIcon as any} />
                        <input
                            type="text" placeholder="Search posts by name, user, or category..."
                            style={{
                                ...s.searchInput,
                                ...(searchFocused ? { borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99,102,241,0.08)" } : {}),
                            }}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                    <select
                        style={s.filterSelect}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="flagged">Flagged</option>
                        <option value="pending">Pending</option>
                        <option value="recovered">Recovered</option>
                        <option value="claimed">Claimed</option>
                    </select>
                </div>

                {/* Post List */}
                {loading ? (
                    <div style={s.emptyState as any}>
                        <Clock size={28} style={{ marginBottom: 8, animation: "pulse 1.5s infinite" }} />
                        <div>Loading posts...</div>
                    </div>
                ) : (
                    <div style={s.list as any}>
                        {filteredPosts.length === 0 ? (
                            <div style={s.emptyState as any}>No posts found.</div>
                        ) : (
                            filteredPosts.map(post => {
                                const sc = statusColors[post.status] || statusColors.active;
                                const tc = typeColors[post.type];
                                const key = `${post.type}-${post.id}`;
                                return (
                                    <div
                                        key={key}
                                        style={{
                                            ...s.postItem,
                                            ...(hoveredPost === key
                                                ? { background: "#f8fafc", borderColor: "#e2e8f0" }
                                                : {}),
                                            ...(post.flagged ? { borderLeft: "3px solid #ef4444" } : {}),
                                        }}
                                        onMouseEnter={() => setHoveredPost(key)}
                                        onMouseLeave={() => setHoveredPost(null)}
                                    >
                                        {/* Thumbnail */}
                                        <div style={s.postThumbnail}>
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <ImageIcon size={20} style={{ color: "#cbd5e1" }} />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div style={s.postInfo as any}>
                                            <span style={s.postTitle}>{post.itemName}</span>
                                            <div style={s.postMeta}>
                                                <span>By {post.owner}</span>
                                                {post.category && <span>· {post.category}</span>}
                                                {post.location && <span>· 📍 {post.location}</span>}
                                            </div>
                                            {post.flagged && post.flagReason && (
                                                <span style={{
                                                    fontFamily: "'Inter', sans-serif", fontSize: "0.68rem",
                                                    color: "#dc2626", marginTop: 2,
                                                }}>
                                                    ⚠️ {post.flagReason}
                                                </span>
                                            )}
                                        </div>

                                        {/* Badges */}
                                        <div style={s.postBadges}>
                                            <span style={{
                                                ...s.typeBadge, background: tc.bg, color: tc.color,
                                            }}>
                                                {post.type.toUpperCase()}
                                            </span>
                                            <span style={{
                                                ...s.statusBadge, background: sc.bg, color: sc.color,
                                            }}>
                                                {post.status}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div style={s.postActions}>
                                            <button
                                                style={{
                                                    ...s.actionBtn,
                                                    ...(hoveredAction === `view-${key}` ? { background: "rgba(99,102,241,0.1)", color: "#6366f1" } : {}),
                                                }}
                                                title="View"
                                                onClick={() => setViewItem(post)}
                                                onMouseEnter={() => setHoveredAction(`view-${key}`)}
                                                onMouseLeave={() => setHoveredAction(null)}
                                            >
                                                <Eye size={15} />
                                            </button>
                                            {(post.flagged || post.status === "pending") && (
                                                <button
                                                    style={{
                                                        ...s.actionBtn,
                                                        ...(hoveredAction === `approve-${key}` ? { background: "rgba(34,197,94,0.1)", color: "#16a34a" } : {}),
                                                    }}
                                                    title="Approve"
                                                    onClick={() => handleApprove(post)}
                                                    onMouseEnter={() => setHoveredAction(`approve-${key}`)}
                                                    onMouseLeave={() => setHoveredAction(null)}
                                                >
                                                    <Check size={15} />
                                                </button>
                                            )}
                                            <button
                                                style={{
                                                    ...s.actionBtn,
                                                    ...(hoveredAction === `edit-${key}` ? { background: "rgba(59,130,246,0.1)", color: "#3b82f6" } : {}),
                                                }}
                                                title="Edit"
                                                onClick={() => openEdit(post)}
                                                onMouseEnter={() => setHoveredAction(`edit-${key}`)}
                                                onMouseLeave={() => setHoveredAction(null)}
                                            >
                                                <Edit3 size={15} />
                                            </button>
                                            <button
                                                style={{
                                                    ...s.actionBtn,
                                                    ...(hoveredAction === `delete-${key}` ? { background: "rgba(239,68,68,0.1)", color: "#dc2626" } : {}),
                                                }}
                                                title="Delete"
                                                onClick={() => handleDelete(post)}
                                                onMouseEnter={() => setHoveredAction(`delete-${key}`)}
                                                onMouseLeave={() => setHoveredAction(null)}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* ── View Detail Modal ──────────────────── */}
            {viewItem && (
                <div style={s.overlay as any} onClick={() => setViewItem(null)}>
                    <div style={s.modal as any} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h3 style={s.modalTitle}>
                                <span style={{
                                    display: "inline-flex", padding: "3px 10px", borderRadius: 6, marginRight: 8,
                                    background: typeColors[viewItem.type].bg, color: typeColors[viewItem.type].color,
                                    fontSize: "0.72rem", fontWeight: 700,
                                }}>{viewItem.type.toUpperCase()}</span>
                                {viewItem.itemName}
                            </h3>
                            <button style={s.modalClose} onClick={() => setViewItem(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        {viewItem.imageUrl && (
                            <img src={viewItem.imageUrl} alt="" style={{
                                width: "100%", height: 200, objectFit: "cover" as const,
                                borderRadius: 10, marginBottom: 16,
                            }} />
                        )}
                        {[
                            { label: "Description", value: viewItem.description },
                            { label: "Category", value: viewItem.category },
                            { label: "Location", value: viewItem.location },
                            { label: "Tags", value: viewItem.tags?.split(",").join(", ") },
                            { label: "Posted By", value: viewItem.owner },
                            { label: "Status", value: viewItem.status },
                            ...(viewItem.flagReason ? [{ label: "Flag Reason", value: viewItem.flagReason }] : []),
                        ].map((row, i) => (
                            <div key={i} style={{
                                display: "flex", gap: 8, marginBottom: 8,
                                fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#475569",
                            }}>
                                <span style={{ fontWeight: 600, color: "#0f172a", minWidth: 90 }}>{row.label}</span>
                                <span>{row.value || "—"}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Edit Modal ──────────────────────────── */}
            {editItem && (
                <div style={s.overlay as any} onClick={() => setEditItem(null)}>
                    <div style={s.modal as any} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h3 style={s.modalTitle}>Edit Post</h3>
                            <button style={s.modalClose} onClick={() => setEditItem(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Item Name</label>
                            <input style={s.formInput} value={editName} onChange={e => setEditName(e.target.value)} />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Description</label>
                            <textarea style={s.formTextarea as any} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Location</label>
                            <input style={s.formInput} value={editLocation} onChange={e => setEditLocation(e.target.value)} />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Category</label>
                            <input style={s.formInput} value={editCategory} onChange={e => setEditCategory(e.target.value)} />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Status</label>
                            <select style={{ ...s.formInput, cursor: "pointer" }} value={editStatus}
                                onChange={e => setEditStatus(e.target.value)}>
                                <option value="active">Active</option>
                                <option value="flagged">Flagged</option>
                                <option value="pending">Pending</option>
                                <option value="recovered">Recovered</option>
                                <option value="claimed">Claimed</option>
                            </select>
                        </div>
                        <button style={s.saveBtn} onClick={handleSaveEdit}>
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Responsive */}
            <style>{`
                .admin-lf-anim { animation: adminLfIn 0.35s ease; }
                @keyframes adminLfIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                @media (max-width: 768px) {
                    .admin-lf-stats { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 480px) {
                    .admin-lf-stats { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </AdminLayout>
    );
}

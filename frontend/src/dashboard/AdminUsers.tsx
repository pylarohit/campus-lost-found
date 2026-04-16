import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
    UserCheck,
    UserX,
    Shield,
    Clock,
    CheckCircle,
    XCircle,
    Mail,
    AlertTriangle,
    Users,
    Search,
} from "lucide-react";

interface UserItem {
    id: number;
    name: string;
    email: string;
    verified: boolean;
}

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: { maxWidth: 1100, margin: "0 auto" },

    /* Header */
    header: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
    },
    headerLeft: { display: "flex", flexDirection: "column", gap: 4 },
    headerTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.4rem", fontWeight: 700,
        color: "#0f172a", letterSpacing: "-0.02em", margin: 0,
    },
    headerSub: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#64748b", margin: 0,
    },

    /* Tabs */
    tabs: {
        display: "flex", gap: 6, background: "#f1f5f9", borderRadius: 10,
        padding: 4, marginBottom: 24,
    },
    tab: {
        padding: "8px 20px", borderRadius: 8, border: "none",
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s ease", background: "transparent",
        color: "#64748b", display: "flex", alignItems: "center", gap: 6,
    },
    tabActive: {
        background: "#fff", color: "#0f172a",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    },

    /* Stats row */
    statsRow: {
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14,
        marginBottom: 24,
    },
    statCard: {
        background: "#fff", borderRadius: 12, padding: "16px 18px",
        border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 14,
    },
    statIcon: {
        width: 42, height: 42, borderRadius: 10, display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    statLabel: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
        fontWeight: 500, color: "#64748b",
    },
    statValue: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.35rem",
        fontWeight: 700, color: "#0f172a", lineHeight: 1.2,
    },

    /* Table */
    table: {
        width: "100%", background: "#fff", borderRadius: 14,
        border: "1px solid #e2e8f0", overflow: "hidden",
    },
    thead: {
        background: "#f8fafc",
    },
    th: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600,
        color: "#64748b", padding: "12px 18px", textAlign: "left" as const,
        textTransform: "uppercase" as const, letterSpacing: "0.04em",
        borderBottom: "1px solid #e2e8f0",
    },
    td: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#0f172a",
        padding: "14px 18px", borderBottom: "1px solid #f1f5f9",
    },
    tdEmail: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#64748b",
        padding: "14px 18px", borderBottom: "1px solid #f1f5f9",
    },
    badge: {
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px", borderRadius: 6,
        fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600,
    },
    badgePending: {
        background: "rgba(245,158,11,0.1)", color: "#d97706",
    },
    badgeVerified: {
        background: "rgba(34,197,94,0.1)", color: "#16a34a",
    },
    actionBtn: {
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "6px 14px", borderRadius: 7, fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
        transition: "all 0.2s ease", border: "none",
    },
    verifyBtn: {
        background: "rgba(34,197,94,0.1)", color: "#16a34a",
    },
    rejectBtn: {
        background: "rgba(239,68,68,0.08)", color: "#ef4444",
        marginLeft: 6,
    },

    /* Empty */
    empty: {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "50px 20px", gap: 12,
    },
    emptyIcon: {
        width: 56, height: 56, borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    emptyText: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.92rem",
        fontWeight: 600, color: "#0f172a", margin: 0,
    },
    emptyDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
        color: "#64748b", margin: 0, textAlign: "center",
    },
};

// ── Component ───────────────────────────────

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"pending" | "verified" | "all">("pending");

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        if (role !== "admin") navigate("/admin-login");
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/admin/users/all");
            if (res.ok) setUsers(await res.json());
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleVerify = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/admin/users/${id}/verify`, {
                method: "PUT",
            });
            if (res.ok) fetchUsers();
        } catch { alert("Error verifying user."); }
    };

    const handleReject = async (id: number) => {
        if (!window.confirm("Are you sure you want to reject and delete this user?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
                method: "DELETE",
            });
            if (res.ok) fetchUsers();
        } catch { alert("Error rejecting user."); }
    };

    const pendingUsers = users.filter((u) => !u.verified);
    const verifiedUsers = users.filter((u) => u.verified);

    const displayUsers =
        activeTab === "pending" ? pendingUsers
            : activeTab === "verified" ? verifiedUsers
                : users;

    return (
        <AdminLayout>
            <div style={s.page} className="admin-users-anim">

                {/* Header */}
                <div style={s.header}>
                    <div style={s.headerLeft}>
                        <h2 style={s.headerTitle}>Campus Verification</h2>
                        <p style={s.headerSub}>Manage student account verifications</p>
                    </div>
                </div>

                {/* Stats */}
                <div style={s.statsRow} className="admin-users-stats">
                    <div style={s.statCard}>
                        <div style={{ ...s.statIcon, background: "rgba(245,158,11,0.1)", color: "#d97706" }}>
                            <Clock size={20} />
                        </div>
                        <div>
                            <div style={s.statLabel}>Pending</div>
                            <div style={s.statValue}>{pendingUsers.length}</div>
                        </div>
                    </div>
                    <div style={s.statCard}>
                        <div style={{ ...s.statIcon, background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <div style={s.statLabel}>Verified</div>
                            <div style={s.statValue}>{verifiedUsers.length}</div>
                        </div>
                    </div>
                    <div style={s.statCard}>
                        <div style={{ ...s.statIcon, background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
                            <Users size={20} />
                        </div>
                        <div>
                            <div style={s.statLabel}>Total Users</div>
                            <div style={s.statValue}>{users.length}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={s.tabs}>
                    <button
                        style={{ ...s.tab, ...(activeTab === "pending" ? s.tabActive : {}) }}
                        onClick={() => setActiveTab("pending")}
                    >
                        <AlertTriangle size={14} /> Pending ({pendingUsers.length})
                    </button>
                    <button
                        style={{ ...s.tab, ...(activeTab === "verified" ? s.tabActive : {}) }}
                        onClick={() => setActiveTab("verified")}
                    >
                        <CheckCircle size={14} /> Verified ({verifiedUsers.length})
                    </button>
                    <button
                        style={{ ...s.tab, ...(activeTab === "all" ? s.tabActive : {}) }}
                        onClick={() => setActiveTab("all")}
                    >
                        <Users size={14} /> All ({users.length})
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <div style={s.empty}>
                        <div style={{ ...s.emptyIcon, background: "rgba(59,130,246,0.1)", color: "#3b82f6", animation: "pulse 1.5s infinite" }}>
                            <Clock size={24} />
                        </div>
                        <p style={s.emptyText}>Loading users…</p>
                    </div>
                ) : displayUsers.length === 0 ? (
                    <div style={s.empty}>
                        <div style={{ ...s.emptyIcon, background: activeTab === "pending" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: activeTab === "pending" ? "#d97706" : "#16a34a" }}>
                            {activeTab === "pending" ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                        </div>
                        <p style={s.emptyText}>
                            {activeTab === "pending" ? "No pending verifications" : activeTab === "verified" ? "No verified users yet" : "No users found"}
                        </p>
                        <p style={s.emptyDesc}>
                            {activeTab === "pending" ? "All accounts have been reviewed." : "Users will appear here after registration."}
                        </p>
                    </div>
                ) : (
                    <div style={s.table}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={s.thead}>
                                <tr>
                                    <th style={s.th}>#</th>
                                    <th style={s.th}>Name</th>
                                    <th style={s.th}>Email</th>
                                    <th style={s.th}>Status</th>
                                    <th style={{ ...s.th, textAlign: "center" as const }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayUsers.map((user, i) => (
                                    <tr
                                        key={user.id}
                                        style={{ transition: "background 0.15s ease" }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafbfc"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                                    >
                                        <td style={{ ...s.td, color: "#94a3b8", width: 50 }}>{i + 1}</td>
                                        <td style={{ ...s.td, fontWeight: 600 }}>{user.name || "—"}</td>
                                        <td style={s.tdEmail}>
                                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                                <Mail size={13} style={{ color: "#94a3b8" }} />
                                                {user.email}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{ ...s.badge, ...(user.verified ? s.badgeVerified : s.badgePending) }}>
                                                {user.verified ? <><CheckCircle size={11} /> Verified</> : <><Clock size={11} /> Pending</>}
                                            </span>
                                        </td>
                                        <td style={{ ...s.td, textAlign: "center" as const }}>
                                            {!user.verified ? (
                                                <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                                                    <button
                                                        style={{ ...s.actionBtn, ...s.verifyBtn }}
                                                        onClick={() => handleVerify(user.id)}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.2)"; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; }}
                                                    >
                                                        <UserCheck size={13} /> Verify
                                                    </button>
                                                    <button
                                                        style={{ ...s.actionBtn, ...s.rejectBtn }}
                                                        onClick={() => handleReject(user.id)}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                                                    >
                                                        <UserX size={13} /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#94a3b8" }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
        .admin-users-anim { animation: adminUsersIn 0.4s ease; }
        @keyframes adminUsersIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 768px) {
          .admin-users-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </AdminLayout>
    );
}

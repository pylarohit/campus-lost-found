import React, { useState, useEffect, CSSProperties } from "react";
import AdminLayout from "./AdminLayout";
import {
    AlertTriangle,
    Trash2,
    CheckCircle,
    MessageSquare,
    User,
    Clock,
    ShieldAlert,
    Eye,
    XCircle
} from "lucide-react";

interface MessageReport {
    id: number;
    messageId: number;
    reporterEmail: string;
    reason: string;
    detail: string;
    status: string;
    reportedAt: string;
    messageContent: string;
    senderEmail: string;
}

const s: Record<string, CSSProperties> = {
    container: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 20px",
        fontFamily: "'Inter', sans-serif"
    },
    header: {
        marginBottom: "32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "20px"
    },
    headerLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    title: {
        fontSize: "1.85rem",
        fontWeight: 800,
        color: "#0f172a",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: 12,
        letterSpacing: "-0.03em"
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#64748b",
        margin: 0
    },
    filterGroup: {
        display: "flex",
        background: "#f1f5f9",
        padding: 4,
        borderRadius: 14,
        border: "1px solid #e2e8f0"
    },
    filterBtn: {
        padding: "8px 20px",
        borderRadius: 10,
        border: "none",
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
        marginBottom: "32px"
    },
    statCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
    },
    reportList: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    reportCard: {
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
    },
    cardHeader: {
        padding: "18px 24px",
        background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cardBody: {
        padding: "24px"
    },
    cardFooter: {
        padding: "16px 24px",
        borderTop: "1px solid #f1f5f9",
        background: "#fafbfc",
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px"
    },
    badge: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase" as const
    },
    dangerBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 12,
        border: "1px solid #fee2e2",
        background: "#fef2f2",
        color: "#ef4444",
        fontSize: "0.85rem",
        fontWeight: 650,
        cursor: "pointer",
        transition: "all 0.2s"
    },
    successBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 12,
        border: "1px solid #d1fae5",
        background: "#ecfdf5",
        color: "#059669",
        fontSize: "0.85rem",
        fontWeight: 650,
        cursor: "pointer",
        transition: "all 0.2s"
    },
    messageBox: {
        padding: "18px",
        background: "#f8fafc",
        borderRadius: 16,
        marginTop: "12px",
        fontSize: "0.95rem",
        color: "#334155",
        lineHeight: 1.6,
        border: "1px solid #e2e8f0",
        position: "relative" as const
    },
    metaLabel: {
        fontSize: "0.7rem",
        fontWeight: 700,
        color: "#94a3b8",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        marginBottom: 8,
        display: "block"
    },
    userBadge: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "#f1f5f9",
        borderRadius: 12,
        width: "fit-content"
    }
};

export default function AdminReports() {
    const [reports, setReports] = useState<MessageReport[]>([]);
    const [filter, setFilter] = useState("PENDING");
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/admin/reports?status=${filter}`);
            const data = await res.json();
            setReports(data || []);
        } catch (e) {
            console.error(e);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [filter]);

    const deleteMessage = async (messageId: number) => {
        if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/admin/messages/${messageId}`, { method: "DELETE" });
            if (res.ok) fetchReports();
        } catch (e) {
            console.error(e);
        }
    };

    const dismissReport = async (reportId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/admin/reports/${reportId}/dismiss`, { method: "PUT" });
            if (res.ok) fetchReports();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AdminLayout>
            <div style={s.container} className="reports-page-anim">
                {/* Header Section */}
                <div style={s.header}>
                    <div style={s.headerLeft}>
                        <h1 style={s.title}>
                            <ShieldAlert size={32} color="#ef4444" />
                            Content Moderation
                        </h1>
                        <p style={s.subtitle}>Review and manage flagged messages from campus chat</p>
                    </div>
                    <div style={s.filterGroup}>
                        {["PENDING", "RESOLVED", "DISMISSED"].map(st => {
                            const isActive = filter === st;
                            return (
                                <button
                                    key={st}
                                    onClick={() => setFilter(st)}
                                    style={{
                                        ...s.filterBtn,
                                        background: isActive ? "#fff" : "transparent",
                                        color: isActive ? "#0f172a" : "#64748b",
                                        boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.08)" : "none"
                                    }}
                                >
                                    {st}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Row */}

                {/* Content Section */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "100px 0", color: "#64748b" }}>
                        <div className="report-loader" />
                        <p style={{ marginTop: 16, fontWeight: 500 }}>Fetching latest reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "80px 20px",
                        background: "#fff",
                        borderRadius: 24,
                        border: "2px dashed #e2e8f0"
                    }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: "50%", background: "#f0fdf4",
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px"
                        }}>
                            <CheckCircle size={40} color="#22c55e" />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", color: "#0f172a", marginBottom: 8 }}>All Clear!</h3>
                        <p style={{ color: "#64748b", maxWidth: 300, margin: "0 auto" }}>
                            No {filter.toLowerCase()} reports to display at the moment.
                        </p>
                    </div>
                ) : (
                    <div style={s.reportList}>
                        {reports.map((report, idx) => (
                            <div
                                key={report.id}
                                style={s.reportCard}
                                className="report-card-hover"
                            >
                                <div style={s.cardHeader}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div style={{
                                            background: "#fee2e2", color: "#ef4444",
                                            padding: "6px 12px", borderRadius: 10, fontSize: "0.75rem", fontWeight: 800,
                                            border: "1px solid rgba(239, 68, 68, 0.1)"
                                        }}>
                                            {report.reason.toUpperCase()}
                                        </div>
                                        <div style={{
                                            fontSize: "0.82rem", color: "#94a3b8", display: "flex",
                                            alignItems: "center", gap: 6, fontWeight: 500
                                        }}>
                                            <Clock size={15} /> {new Date(report.reportedAt).toLocaleDateString()} at {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{
                                        ...s.badge,
                                        background: report.status === "PENDING" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                                        color: report.status === "PENDING" ? "#d97706" : "#059669",
                                        padding: "6px 14px",
                                        border: report.status === "PENDING" ? "1px solid rgba(245, 158, 11, 0.1)" : "1px solid rgba(16, 185, 129, 0.1)"
                                    }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                                        {report.status}
                                    </div>
                                </div>

                                <div style={s.cardBody}>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", marginBottom: 28 }}>
                                        <div>
                                            <span style={s.metaLabel}>Message Sender</span>
                                            <div style={s.userBadge}>
                                                <div style={{ background: "#6366f1", color: "#fff", padding: 8, borderRadius: 10 }}>
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>{report.senderEmail.split('@')[0]}</div>
                                                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{report.senderEmail}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <span style={s.metaLabel}>Reporter Info</span>
                                            <div style={s.userBadge}>
                                                <div style={{ background: "#94a3b8", color: "#fff", padding: 8, borderRadius: 10 }}>
                                                    <Eye size={18} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>{report.reporterEmail.split('@')[0]}</div>
                                                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{report.reporterEmail}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {report.detail && (
                                        <div style={{ marginBottom: 24 }}>
                                            <span style={s.metaLabel}>Reporter's Comments</span>
                                            <div style={{
                                                padding: "16px", background: "#fdf2f8", borderRadius: 12,
                                                color: "#9d174d", fontSize: "0.92rem", fontWeight: 500,
                                                borderLeft: "4px solid #db2777"
                                            }}>
                                                {report.detail}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <span style={s.metaLabel}>Reported Content</span>
                                        <div style={s.messageBox}>
                                            <MessageSquare size={16} color="#94a3b8" style={{ position: "absolute", right: 20, top: 20, opacity: 0.5 }} />
                                            <span style={{ color: "#475569", fontWeight: 450 }}>"{report.messageContent}"</span>
                                        </div>
                                    </div>
                                </div>

                                {report.status === "PENDING" && (
                                    <div style={s.cardFooter}>
                                        <button
                                            className="reports-btn-dismiss"
                                            style={s.successBtn}
                                            onClick={() => dismissReport(report.id)}
                                        >
                                            <XCircle size={18} />
                                            Ignore Report
                                        </button>
                                        <button
                                            className="reports-btn-delete"
                                            style={s.dangerBtn}
                                            onClick={() => deleteMessage(report.messageId)}
                                        >
                                            <Trash2 size={18} />
                                            Remove Content
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <style>{`
          .reports-page-anim { animation: reportsIn 0.5s cubic-bezier(0, 0, 0.2, 1); }
          @keyframes reportsIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .report-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -4px rgba(0,0,0,0.08);
          }
          .reports-stats > div { animation: statsIn 0.5s ease backwards; }
          .reports-stats > div:nth-child(2) { animation-delay: 0.1s; }
          @keyframes statsIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .reports-btn-delete:hover {
            background: #f87171 !important;
            color: #fff !important;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          }
          .reports-btn-dismiss:hover {
            background: #10b981 !important;
            color: #fff !important;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          }
          .report-loader {
            width: 40px;
            height: 40px;
            border: 3px solid #f1f5f9;
            border-top: 3px solid #6366f1;
            border-radius: 50%;
            margin: 0 auto;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
          
          @media (max-width: 1024px) {
            .reports-stats { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 640px) {
            .reports-stats { grid-template-columns: 1fr !important; }
            .reports-header { flex-direction: column; align-items: flex-start !important; }
          }
        `}</style>
            </div>
        </AdminLayout>
    );
}

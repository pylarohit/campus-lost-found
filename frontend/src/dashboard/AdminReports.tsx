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
    container: { padding: "24px", fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 12 },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" },
    statCard: { background: "#fff", padding: "20px", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
    reportList: { display: "flex", flexDirection: "column", gap: "16px" },
    reportCard: {
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
    },
    cardHeader: { padding: "16px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
    cardBody: { padding: "20px" },
    cardFooter: { padding: "12px 20px", borderTop: "1px solid #f1f5f9", background: "#fafbfc", display: "flex", justifyContent: "flex-end", gap: "12px" },
    badge: { padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" },
    dangerBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 10,
        border: "none",
        background: "#fef2f2",
        color: "#ef4444",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s"
    },
    successBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 10,
        border: "none",
        background: "#ecfdf5",
        color: "#10b981",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s"
    },
    messageBox: {
        padding: "14px",
        background: "#f1f5f9",
        borderRadius: 12,
        marginTop: "12px",
        fontSize: "0.9rem",
        color: "#334155",
        fontStyle: "italic",
        borderLeft: "4px solid #cbd5e1"
    },
    metaLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4, display: "block" }
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
            setReports(data);
        } catch (e) {
            console.error(e);
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
            await fetch(`http://localhost:8080/api/admin/messages/${messageId}`, { method: "DELETE" });
            fetchReports();
        } catch (e) {
            console.error(e);
        }
    };

    const dismissReport = async (reportId: number) => {
        try {
            await fetch(`http://localhost:8080/api/admin/reports/${reportId}/dismiss`, { method: "PUT" });
            fetchReports();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AdminLayout>
            <div style={s.container}>
                <div style={s.header}>
                    <h1 style={s.title}>
                        <ShieldAlert size={28} color="#ef4444" />
                        Inappropriate Content Reports
                    </h1>
                    <div style={{ display: "flex", background: "#f1f5f9", padding: 4, borderRadius: 12 }}>
                        {["PENDING", "RESOLVED", "DISMISSED"].map(st => (
                            <button
                                key={st}
                                onClick={() => setFilter(st)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: 10,
                                    border: "none",
                                    background: filter === st ? "#fff" : "transparent",
                                    color: filter === st ? "#0f172a" : "#64748b",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: filter === st ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                                    transition: "all 0.2s"
                                }}
                            >{st}</button>
                        ))}
                    </div>
                </div>

                <div style={s.statsGrid}>
                    <div style={s.statCard}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <div style={{ background: "#fef2f2", color: "#ef4444", padding: 10, borderRadius: 12 }}><AlertTriangle size={20} /></div>
                            <div>
                                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Pending Reports</div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{reports.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "100px 0", color: "#94a3b8" }}>Loading reports...</div>
                ) : reports.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "100px 0", background: "#fff", borderRadius: 20, border: "1px dashed #cbd5e1" }}>
                        <CheckCircle size={48} color="#10b981" style={{ marginBottom: 16 }} />
                        <h3 style={{ margin: 0, color: "#0f172a" }}>No {filter.toLowerCase()} reports</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Everything looks clean!</p>
                    </div>
                ) : (
                    <div style={s.reportList}>
                        {reports.map(report => (
                            <div key={report.id} style={s.reportCard}>
                                <div style={s.cardHeader}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ background: "#ef4444", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 700 }}>
                                            {report.reason}
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                                            <Clock size={14} /> {new Date(report.reportedAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{
                                        ...s.badge,
                                        background: report.status === "PENDING" ? "#fef3c7" : report.status === "RESOLVED" ? "#d1fae5" : "#f1f5f9",
                                        color: report.status === "PENDING" ? "#d97706" : report.status === "RESOLVED" ? "#059669" : "#64748b"
                                    }}>
                                        {report.status}
                                    </div>
                                </div>
                                <div style={s.cardBody}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                                        <div>
                                            <span style={s.metaLabel}>Suspect</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ background: "#f1f5f9", padding: 8, borderRadius: "50%" }}><User size={16} /></div>
                                                <span style={{ fontWeight: 600 }}>{report.senderEmail}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span style={s.metaLabel}>Reporter</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ background: "#f1f5f9", padding: 8, borderRadius: "50%" }}><Eye size={16} /></div>
                                                <span style={{ fontWeight: 600 }}>{report.reporterEmail}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {report.detail && (
                                        <div style={{ marginTop: 20 }}>
                                            <span style={s.metaLabel}>Reporter's Details</span>
                                            <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>{report.detail}</p>
                                        </div>
                                    )}

                                    <div style={{ marginTop: 20 }}>
                                        <span style={s.metaLabel}>Reported Content</span>
                                        <div style={s.messageBox}>
                                            "{report.messageContent}"
                                        </div>
                                    </div>
                                </div>
                                {report.status === "PENDING" && (
                                    <div style={s.cardFooter}>
                                        <button
                                            style={s.dangerBtn}
                                            onMouseOver={(e) => e.currentTarget.style.background = "#fee2e2"}
                                            onMouseOut={(e) => e.currentTarget.style.background = "#fef2f2"}
                                            onClick={() => deleteMessage(report.messageId)}
                                        >
                                            <Trash2 size={18} />
                                            Delete Message
                                        </button>
                                        <button
                                            style={s.successBtn}
                                            onMouseOver={(e) => e.currentTarget.style.background = "#d1fae5"}
                                            onMouseOut={(e) => e.currentTarget.style.background = "#ecfdf5"}
                                            onClick={() => dismissReport(report.id)}
                                        >
                                            <XCircle size={18} />
                                            Dismiss Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle,
    XCircle,
    Users,
    MessageSquare,
    FileText,
    ArrowUpRight,
} from "lucide-react";

// ── Stat config ─────────────────────────────

interface StatCard {
    id: string;
    label: string;
    value: string;
    sub: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}

const recoveryStats: StatCard[] = [
    {
        id: "recovered",
        label: "Items Recovered",
        value: "120",
        sub: "Successfully returned",
        icon: <CheckCircle size={22} />,
        iconBg: "rgba(34,197,94,0.12)",
        iconColor: "#16a34a",
    },
    {
        id: "not-recovered",
        label: "Items Not Recovered",
        value: "30",
        sub: "Still searching",
        icon: <XCircle size={22} />,
        iconBg: "rgba(239,68,68,0.1)",
        iconColor: "#dc2626",
    },
];

const engagementStats: StatCard[] = [
    {
        id: "active-users",
        label: "Active Users",
        value: "150",
        sub: "+15% from last month",
        icon: <Users size={22} />,
        iconBg: "rgba(59,130,246,0.12)",
        iconColor: "#3b82f6",
    },
    {
        id: "messages",
        label: "Messages Sent",
        value: "1,240",
        sub: "+22% from last month",
        icon: <MessageSquare size={22} />,
        iconBg: "rgba(139,92,246,0.12)",
        iconColor: "#8b5cf6",
    },
    {
        id: "posts",
        label: "Posts Created",
        value: "248",
        sub: "+18% from last month",
        icon: <FileText size={22} />,
        iconBg: "rgba(245,158,11,0.12)",
        iconColor: "#d97706",
    },
];

const weeklyData = [
    { label: "Week 1", value: 65 },
    { label: "Week 2", value: 80 },
    { label: "Week 3", value: 55 },
    { label: "Week 4", value: 90 },
];

const categoryData = [
    { label: "Electronics", value: 45, color: "#6366f1" },
    { label: "Books", value: 28, color: "#3b82f6" },
    { label: "Clothing", value: 18, color: "#8b5cf6" },
    { label: "ID Cards", value: 22, color: "#06b6d4" },
    { label: "Keys", value: 15, color: "#f59e0b" },
    { label: "Other", value: 12, color: "#94a3b8" },
];

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: {
        maxWidth: 1100,
        margin: "0 auto",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 28,
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
    sectionTitle: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "1rem",
        fontWeight: 700,
        color: "#0f172a",
        marginBottom: 14,
        marginTop: 0,
    },
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 16,
        marginBottom: 28,
    },
    statsRowThree: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 28,
    },
    statCard: {
        background: "#fff",
        borderRadius: 14,
        padding: "22px 20px",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        transition: "all 0.25s ease",
    },
    statIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: 12,
        flexShrink: 0,
    },
    statInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    statLabel: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.75rem",
        fontWeight: 500,
        color: "#64748b",
    },
    statValue: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "1.8rem",
        fontWeight: 700,
        color: "#0f172a",
        lineHeight: 1.2,
    },
    statSub: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.7rem",
        color: "#94a3b8",
    },
    // ── Chart Card ─────
    chartCard: {
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        padding: "24px 24px 20px",
        marginBottom: 28,
    },
    chartHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    chartTitle: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 650,
        color: "#0f172a",
        margin: 0,
    },
    badge: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem",
        fontWeight: 600,
        color: "#16a34a",
        background: "rgba(34,197,94,0.1)",
        padding: "4px 10px",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        gap: 4,
    },
    chartBars: {
        display: "flex",
        alignItems: "flex-end",
        gap: 16,
        height: 160,
        paddingBottom: 8,
    },
    barWrap: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
    bar: {
        width: "100%",
        maxWidth: 56,
        borderRadius: "8px 8px 4px 4px",
        transition: "all 0.3s ease",
    },
    barLabel: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem",
        color: "#94a3b8",
        fontWeight: 500,
    },
    // ── Category breakdown ─────
    twoCol: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        marginBottom: 28,
    },
    categoryList: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    categoryItem: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    categoryDot: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        flexShrink: 0,
    },
    categoryLabel: {
        flex: 1,
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.82rem",
        color: "#334155",
    },
    categoryValue: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    categoryBarOuter: {
        flex: 2,
        height: 8,
        borderRadius: 10,
        background: "#f1f5f9",
        overflow: "hidden",
    },
    categoryBarInner: {
        height: "100%",
        borderRadius: 10,
        transition: "width 0.5s ease",
    },
};

// ── Component ───────────────────────────────

export default function AdminAnalytics() {
    const navigate = useNavigate();
    const [hoveredStat, setHoveredStat] = useState<string | null>(null);
    const [hoveredBack, setHoveredBack] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") navigate("/admin-login");
    }, [navigate]);

    const maxCategory = Math.max(...categoryData.map((c) => c.value));

    return (
        <AdminLayout>
            <div style={s.page} className="admin-analytics-anim">
                {/* Header */}
                <div style={s.header}>
                    <button
                        style={{
                            ...s.backBtn,
                            ...(hoveredBack ? { background: "#e2e8f0" } : {}),
                        }}
                        onClick={() => navigate("/admin-dashboard")}
                        onMouseEnter={() => setHoveredBack(true)}
                        onMouseLeave={() => setHoveredBack(false)}
                    >
                        ←
                    </button>
                    <h2 style={s.title}>Reporting & Analytics</h2>
                </div>

                {/* ── Item Recovery ────────────────────── */}
                <h3 style={s.sectionTitle}>Item Recovery</h3>
                <div style={s.statsRow} className="analytics-stats-row">
                    {recoveryStats.map((stat) => (
                        <div
                            key={stat.id}
                            style={{
                                ...s.statCard,
                                ...(hoveredStat === stat.id
                                    ? { transform: "translateY(-2px)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }
                                    : {}),
                            }}
                            onMouseEnter={() => setHoveredStat(stat.id)}
                            onMouseLeave={() => setHoveredStat(null)}
                        >
                            <div
                                style={{ ...s.statIcon, background: stat.iconBg, color: stat.iconColor }}
                            >
                                {stat.icon}
                            </div>
                            <div style={s.statInfo}>
                                <span style={s.statLabel}>{stat.label}</span>
                                <span style={s.statValue}>{stat.value}</span>
                                <span style={s.statSub}>{stat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── User Engagement ─────────────────── */}
                <h3 style={s.sectionTitle}>User Engagement</h3>
                <div style={s.statsRowThree} className="analytics-stats-three">
                    {engagementStats.map((stat) => (
                        <div
                            key={stat.id}
                            style={{
                                ...s.statCard,
                                ...(hoveredStat === stat.id
                                    ? { transform: "translateY(-2px)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }
                                    : {}),
                            }}
                            onMouseEnter={() => setHoveredStat(stat.id)}
                            onMouseLeave={() => setHoveredStat(null)}
                        >
                            <div
                                style={{ ...s.statIcon, background: stat.iconBg, color: stat.iconColor }}
                            >
                                {stat.icon}
                            </div>
                            <div style={s.statInfo}>
                                <span style={s.statLabel}>{stat.label}</span>
                                <span style={s.statValue}>{stat.value}</span>
                                <span style={s.statSub}>{stat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── User Activity Chart ─────────────── */}
                <div style={s.chartCard}>
                    <div style={s.chartHeader}>
                        <h4 style={s.chartTitle}>User Activity</h4>
                        <span style={s.badge}>
                            <TrendingUp size={12} /> +15%
                        </span>
                    </div>
                    <div style={s.chartBars} className="analytics-chart-bars">
                        {weeklyData.map((week, i) => (
                            <div key={i} style={s.barWrap}>
                                <div
                                    style={{
                                        ...s.bar,
                                        height: `${week.value}%`,
                                        background: i === weeklyData.length - 1 ? "#6366f1" : "#e2e8f0",
                                    }}
                                />
                                <span style={s.barLabel}>{week.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Category Breakdown ──────────────── */}
                <div style={s.chartCard}>
                    <div style={s.chartHeader}>
                        <h4 style={s.chartTitle}>Items by Category</h4>
                    </div>
                    <div style={s.categoryList}>
                        {categoryData.map((cat, i) => (
                            <div key={i} style={s.categoryItem}>
                                <div style={{ ...s.categoryDot, background: cat.color }} />
                                <span style={s.categoryLabel}>{cat.label}</span>
                                <div style={s.categoryBarOuter}>
                                    <div
                                        style={{
                                            ...s.categoryBarInner,
                                            width: `${(cat.value / maxCategory) * 100}%`,
                                            background: cat.color,
                                        }}
                                    />
                                </div>
                                <span style={s.categoryValue}>{cat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Animations + Responsive */}
            <style>{`
        .admin-analytics-anim {
          animation: analyticsIn 0.35s ease;
        }
        @keyframes analyticsIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .analytics-stats-row {
            grid-template-columns: 1fr !important;
          }
          .analytics-stats-three {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .analytics-chart-bars {
            height: 120px !important;
            gap: 10px !important;
          }
        }
      `}</style>
        </AdminLayout>
    );
}

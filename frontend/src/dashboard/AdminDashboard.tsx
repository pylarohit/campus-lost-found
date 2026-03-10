import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  FileText,
  Flag,
  Users,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Package,
  PackageOpen,
} from "lucide-react";
import SlidingBanner from "../components/SlidingBanner";

// ── Stat card config ────────────────────────

interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface DashboardStats {
  totalLostItems: number;
  totalFoundItems: number;
  totalUsers: number;
  flaggedLostItems: number;
  flaggedFoundItems: number;
  totalPosts: number;
}

function buildStatCards(stats: DashboardStats): StatCard[] {
  return [
    {
      id: "total-posts",
      label: "Total Posts",
      value: String(stats.totalPosts),
      icon: <FileText size={22} />,
      iconBg: "rgba(99,102,241,0.12)",
      iconColor: "#6366f1",
    },
    {
      id: "items-lost",
      label: "Items Lost",
      value: String(stats.totalLostItems),
      icon: <AlertTriangle size={22} />,
      iconBg: "rgba(239,68,68,0.1)",
      iconColor: "#dc2626",
    },
    {
      id: "items-found",
      label: "Items Found",
      value: String(stats.totalFoundItems),
      icon: <CheckCircle size={22} />,
      iconBg: "rgba(34,197,94,0.12)",
      iconColor: "#16a34a",
    },
    {
      id: "active-users",
      label: "Active Users",
      value: String(stats.totalUsers),
      icon: <Users size={22} />,
      iconBg: "rgba(59,130,246,0.12)",
      iconColor: "#3b82f6",
    },
  ];
}

// ── Feature card config ─────────────────────

interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  hoverShadow: string;
  iconBg: string;
  iconColor: string;
}

const featureCards: FeatureCard[] = [
  {
    id: "posts",
    title: "Lost & Found",
    desc: "View, approve, edit, or delete user-submitted lost & found posts. Moderate flagged content.",
    path: "/admin-posts",
    icon: <PackageOpen size={26} />,
    bg: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
    border: "1px solid #c7d2fe",
    hoverShadow: "0 8px 28px rgba(99,102,241,0.15)",
    iconBg: "rgba(99,102,241,0.15)",
    iconColor: "#6366f1",
  },
  {
    id: "flagged",
    title: "User Verification",
    desc: "Review and verify new student registrations flagged for admin approval.",
    path: "/admin-users",
    icon: <Flag size={26} />,
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a40 100%)",
    border: "1px solid #fde68a",
    hoverShadow: "0 8px 28px rgba(245,158,11,0.15)",
    iconBg: "rgba(245,158,11,0.15)",
    iconColor: "#d97706",
  },
];

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "20px 18px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    transition: "all 0.25s ease",
    cursor: "default",
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
    whiteSpace: "nowrap",
  },
  statValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.2,
  },
  statChange: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  sectionTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 16,
    marginTop: 8,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 18,
  },
  card: {
    padding: "24px 22px",
    borderRadius: 16,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  },
  cardIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 12,
    marginBottom: 14,
    transition: "transform 0.3s ease",
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 650,
    color: "#0f172a",
    marginBottom: 6,
    marginTop: 0,
  },
  cardDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.8rem",
    color: "#64748b",
    lineHeight: 1.5,
    margin: 0,
  },
  // ── User Activity Chart ────
  chartSection: {
    marginTop: 28,
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    padding: "24px 24px 20px",
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
  chartBadge: {
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
    gap: 12,
    height: 140,
    paddingBottom: 8,
  },
  chartBarWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  chartBar: {
    width: "100%",
    maxWidth: 48,
    borderRadius: "8px 8px 4px 4px",
    transition: "all 0.3s ease",
  },
  chartLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.72rem",
    color: "#94a3b8",
    fontWeight: 500,
  },
};

// ── Activity type ───────────────────────────

interface WeekActivity {
  label: string;
  lost: number;
  found: number;
  total: number;
}

// ── Component ───────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalLostItems: 0, totalFoundItems: 0, totalUsers: 0,
    flaggedLostItems: 0, flaggedFoundItems: 0, totalPosts: 0,
  });
  const [activity, setActivity] = useState<WeekActivity[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/admin-login");
      return;
    }
    // Fetch real stats from backend
    fetch("http://localhost:8080/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats:", err));
    // Fetch weekly activity
    fetch("http://localhost:8080/api/admin/activity")
      .then(res => res.json())
      .then(data => setActivity(data))
      .catch(err => console.error("Failed to fetch activity:", err));
  }, [navigate]);

  const statCards = buildStatCards(stats);

  return (
    <AdminLayout>
      <div style={s.page} className="admin-page-anim">

        {/* ── Sliding Banner ──────────────────── */}
        <SlidingBanner />

        {/* ── Stats Overview ──────────────────── */}
        <div style={s.statsGrid} className="admin-stats-grid">
          {statCards.map((stat) => (
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
                style={{
                  ...s.statIcon,
                  background: stat.iconBg,
                  color: stat.iconColor,
                }}
              >
                {stat.icon}
              </div>
              <div style={s.statInfo}>
                <span style={s.statLabel}>{stat.label}</span>
                <span style={s.statValue}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ───────────────────── */}
        <h3 style={s.sectionTitle}>Quick Actions</h3>
        <div style={s.cardsGrid} className="admin-cards-grid">
          {featureCards.map((card) => {
            const hovered = hoveredCard === card.id;
            return (
              <div
                key={card.id}
                style={{
                  ...s.card,
                  background: card.bg,
                  border: card.border,
                  ...(hovered
                    ? { transform: "translateY(-4px)", boxShadow: card.hoverShadow }
                    : {}),
                }}
                onClick={() => navigate(card.path)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  style={{
                    ...s.cardIcon,
                    background: card.iconBg,
                    color: card.iconColor,
                    ...(hovered ? { transform: "scale(1.1)" } : {}),
                  }}
                >
                  {card.icon}
                </div>
                <h3 style={s.cardTitle}>{card.title}</h3>
                <p style={s.cardDesc}>{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ── User Activity Chart ─────────────── */}
        <div style={s.chartSection}>
          <div style={s.chartHeader}>
            <h4 style={s.chartTitle}>User Activity</h4>
            <span style={s.chartBadge}>
              <TrendingUp size={12} /> {activity.reduce((sum, w) => sum + w.total, 0)} posts · Last 4 Weeks
            </span>
          </div>
          <div style={s.chartBars} className="admin-chart-bars">
            {activity.length === 0 ? (
              <div style={{ width: "100%", textAlign: "center", color: "#94a3b8", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", paddingTop: 40 }}>
                No activity data yet
              </div>
            ) : (
              activity.map((week, i) => {
                const maxTotal = Math.max(...activity.map(w => w.total), 1);
                const barHeight = Math.max((week.total / maxTotal) * 100, 5);
                const isLast = i === activity.length - 1;
                return (
                  <div key={i} style={s.chartBarWrap}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: `${barHeight}%`, gap: 0 }}>
                      {week.lost > 0 && (
                        <div style={{
                          ...s.chartBar,
                          flex: week.lost,
                          height: "auto",
                          background: isLast ? "#ef4444" : "#fca5a5",
                          borderRadius: week.found > 0 ? "8px 8px 0 0" : "8px 8px 4px 4px",
                        }} title={`${week.lost} lost`} />
                      )}
                      {week.found > 0 && (
                        <div style={{
                          ...s.chartBar,
                          flex: week.found,
                          height: "auto",
                          background: isLast ? "#10b981" : "#6ee7b7",
                          borderRadius: week.lost > 0 ? "0 0 4px 4px" : "8px 8px 4px 4px",
                        }} title={`${week.found} found`} />
                      )}
                      {week.total === 0 && (
                        <div style={{
                          ...s.chartBar,
                          flex: 1,
                          height: "auto",
                          background: "#e2e8f0",
                        }} />
                      )}
                    </div>
                    <span style={s.chartLabel}>{week.label}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}>
                      {week.total}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          {activity.length > 0 && (
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#64748b" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#ef4444", display: "inline-block" }} /> Lost
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#64748b" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#10b981", display: "inline-block" }} /> Found
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Animations + Responsive */}
      <style>{`
        .admin-page-anim {
          animation: adminPageIn 0.4s ease;
        }
        @keyframes adminPageIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .admin-chart-bars {
            height: 100px !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

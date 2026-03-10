import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { PackageOpen, Search, Eye, CalendarCheck, Clock, MapPin, ImageIcon, ArrowRight, ChevronDown } from "lucide-react";
import SlidingBanner from "../components/SlidingBanner";

// ── Card config ─────────────────────────────

interface CardConfig {
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

interface RecentItem {
  id: number;
  itemName: string;
  category: string;
  location: string;
  description: string;
  imageUrl: string | null;
  type: "lost" | "found";
  createdAt: string;
}

const cards: CardConfig[] = [
  {
    id: "lost",
    title: "Report Lost Item",
    desc: "Lost something on campus? Report it and let the community help you find it.",
    path: "/report-lost",
    icon: <PackageOpen size={26} />,
    bg: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
    border: "1px solid #bfdbfe",
    hoverShadow: "0 8px 28px rgba(59,130,246,0.15)",
    iconBg: "rgba(59,130,246,0.15)",
    iconColor: "#2563eb",
  },
  {
    id: "found",
    title: "Report Found Item",
    desc: "Found an item? Help a fellow student by reporting it here.",
    path: "/report-found",
    icon: <Search size={26} />,
    bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    border: "1px solid #6ee7b7",
    hoverShadow: "0 8px 28px rgba(16,185,129,0.15)",
    iconBg: "rgba(16,185,129,0.15)",
    iconColor: "#059669",
  },
  {
    id: "browse",
    title: "Browse All Items",
    desc: "View all lost & found items with smart matching suggestions.",
    path: "/lost-and-found",
    icon: <Eye size={26} />,
    bg: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)",
    border: "1px solid #c4b5fd",
    hoverShadow: "0 8px 28px rgba(139,92,246,0.15)",
    iconBg: "rgba(139,92,246,0.15)",
    iconColor: "#7c3aed",
  },
  {
    id: "booking",
    title: "Resource Booking",
    desc: "Reserve study rooms, equipment, and lab seats across campus.",
    path: "/booking",
    icon: <CalendarCheck size={26} />,
    bg: "linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%)",
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
  welcomeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  welcomeTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.55rem",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.02em",
    margin: 0,
  },
  welcomeName: {
    textTransform: "capitalize" as const,
  },
  welcomeActions: {
    display: "flex",
    gap: 10,
  },
  btnBase: {
    padding: "8px 20px",
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  btnQuiz: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
  },
  btnExplore: {
    background: "#fff",
    color: "#334155",
    border: "1.5px solid #e2e8f0",
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
};

// ── Component ───────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = userEmail ? userEmail.split("@")[0] : "User";

  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [hoveredRecent, setHoveredRecent] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Split cards: first 3 are static, rest in dropdown
  const topCards = cards.slice(0, 3);
  const dropdownCards = cards.slice(3);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          fetch("http://localhost:8080/api/lost/approved"),
          fetch("http://localhost:8080/api/found/approved")
        ]);

        if (lostRes.ok && foundRes.ok) {
          const lostData = await lostRes.json();
          const foundData = await foundRes.json();

          const allItems = [
            ...lostData.map((d: any) => ({ ...d, type: "lost" as const })),
            ...foundData.map((d: any) => ({ ...d, type: "found" as const }))
          ];

          // Sort by newest first by ID since createdAt might not exist on all older test objects
          allItems.sort((a, b) => b.id - a.id);

          setRecentItems(allItems.slice(0, 8)); // Grab top 8
        }
      } catch (e) {
        console.error("Failed to fetch recent items", e);
      }
    };
    fetchRecentItems();
  }, []);

  return (
    <DashboardLayout>
      <div style={s.page} className="dashboard-page-anim">

        {/* ── Sliding Banner ──────────────────── */}
        <SlidingBanner />

        {/* ── Welcome Section ────────── */}
        <div style={s.welcomeRow} className="dash-welcome-row">
          <h2 style={s.welcomeTitle} className="dash-welcome-title">
            Welcome, <span style={s.welcomeName}>{userName}</span>
          </h2>
        </div>


        {/* ── Dropdown Toggle Button (Above Cards) ──── */}
        {dropdownCards.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "transparent", border: "none",
                padding: "0 4px", cursor: "pointer"
              }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <h2 style={{
                fontFamily: "'Inter', sans-serif", fontSize: "1.2rem",
                fontWeight: 700, color: "#0f172a", margin: 0
              }}>
                Quick Actions
              </h2>
              <ChevronDown
                size={22}
                style={{
                  transform: showDropdown ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.3s ease",
                  color: "#3b82f6", strokeWidth: 2.5
                }}
              />
            </button>
          </div>
        )}

        {/* ── Static Main Cards ──────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
            marginTop: 10,
            marginBottom: 20
          }}
          className="dash-cards-grid"
        >
          {topCards.map((card, idx) => {
            const colors = [
              { border: "#3b82f6", icon: "#eff6ff", text: "#2563eb" }, // Blue
              { border: "#f59e0b", icon: "#fffbeb", text: "#d97706" }, // Orange
              { border: "#ec4899", icon: "#fdf2f8", text: "#db2777" }, // Pink
            ];
            const color = colors[idx % colors.length];
            const hovered = hoveredCard === card.id;

            return (
              <div
                key={card.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #f1f5f9",
                  borderLeft: `5px solid ${color.border}`,
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: hovered ? "0 10px 25px rgba(0,0,0,0.05)" : "0 2px 10px rgba(0,0,0,0.02)",
                  transform: hovered ? "translateY(-3px)" : "none",
                }}
                onClick={() => navigate(card.path)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  style={{
                    width: 54, height: 54, borderRadius: "50%",
                    background: color.icon, color: color.text,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "transform 0.3s ease",
                    transform: hovered ? "scale(1.1)" : "none"
                  }}
                >
                  {React.cloneElement(card.icon as React.ReactElement<any>, { size: 24 })}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: "'Inter', sans-serif", fontSize: "1.05rem",
                    fontWeight: 700, color: "#1e293b", margin: "0 0 6px 0"
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
                    color: "#64748b", margin: 0, lineHeight: 1.5
                  }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Additional Cards Row (Dropdown Content) ──── */}
        {showDropdown && dropdownCards.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
              marginBottom: 32,
              animation: "dropdownFadeIn 0.4s ease"
            }}
            className="dash-cards-grid"
          >
            {dropdownCards.map((card, idx) => {
              const colors = [
                { border: "#6366f1", icon: "#eef2ff", text: "#4f46e5" }  // Indigo
              ];
              const color = colors[idx % colors.length];
              const hovered = hoveredCard === card.id;

              return (
                <div
                  key={card.id}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #f1f5f9",
                    borderLeft: `5px solid ${color.border}`,
                    padding: "20px 24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: hovered ? "0 10px 25px rgba(0,0,0,0.05)" : "0 2px 10px rgba(0,0,0,0.02)",
                    transform: hovered ? "translateY(-3px)" : "none",
                  }}
                  onClick={() => navigate(card.path)}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    style={{
                      width: 54, height: 54, borderRadius: "50%",
                      background: color.icon, color: color.text,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "transform 0.3s ease",
                      transform: hovered ? "scale(1.1)" : "none"
                    }}
                  >
                    {React.cloneElement(card.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: "'Inter', sans-serif", fontSize: "1.05rem",
                      fontWeight: 700, color: "#1e293b", margin: "0 0 6px 0"
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
                      color: "#64748b", margin: 0, lineHeight: 1.5
                    }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* ── Recent Posts Scroll ──────────────── */}
        {
          recentItems.length > 0 && (
            <div style={{ marginTop: 40, paddingBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Recent Posts
                </h3>
                <button
                  onClick={() => navigate("/lost-and-found")}
                  style={{
                    background: "transparent", border: "none", color: "#6366f1",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 4, cursor: "pointer"
                  }}
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              <div
                style={{
                  display: "flex", overflowX: "auto", gap: 16, paddingBottom: 16,
                  scrollbarWidth: "none", msOverflowStyle: "none"
                }}
                className="recent-scroll-container"
              >
                {recentItems.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    style={{
                      minWidth: 260, maxWidth: 260, background: "#fff", borderRadius: 16,
                      border: "1px solid #eef0f4", overflow: "hidden", cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: hoveredRecent === item.id ? "translateY(-4px)" : "none",
                      boxShadow: hoveredRecent === item.id ? "0 12px 24px rgba(0,0,0,0.06)" : "none"
                    }}
                    onMouseEnter={() => setHoveredRecent(item.id)}
                    onMouseLeave={() => setHoveredRecent(null)}
                    onClick={() => navigate(`/lost-and-found?id=${item.id}&type=${item.type}`)}
                  >
                    <div style={{ position: "relative", height: 130, background: "#f8fafc", borderBottom: "1px solid #eef0f4" }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.itemName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}>
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <span style={{
                        position: "absolute", top: 10, left: 10,
                        padding: "4px 10px", borderRadius: 6,
                        background: item.type === "lost" ? "rgba(239, 68, 68, 0.9)" : "rgba(16, 185, 129, 0.9)",
                        backdropFilter: "blur(4px)", color: "#fff",
                        fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 700,
                        letterSpacing: "0.04em", textTransform: "uppercase"
                      }}>
                        {item.type}
                      </span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.itemName}
                      </h4>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#64748b", margin: "0 0 12px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.description || "No description provided."}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }}>
                        <MapPin size={12} style={{ color: item.type === "lost" ? "#ef4444" : "#10b981" }} />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.location || "Unknown location"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div >

      {/* Animations + Responsive */}
      < style > {`
        .dashboard-page-anim {
          animation: pageSlideIn 0.4s ease;
        }
        @keyframes pageSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        .recent-scroll-container::-webkit-scrollbar {
          height: 0px; /* Hide scrollbar for Chrome, Safari and Opera */
        }
        
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .dash-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dash-welcome-title {
            font-size: 1.35rem !important;
          }
        }

        /* Small tablet / large phone */
        @media (max-width: 768px) {
          .dash-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .dash-welcome-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .dash-welcome-title {
            font-size: 1.2rem !important;
          }
        }

        /* Phone */
        @media (max-width: 480px) {
          .dash-welcome-title {
            font-size: 1.1rem !important;
          }
          .dash-welcome-btns {
            width: 100% !important;
          }
          .dash-welcome-btns button {
            flex: 1 !important;
            text-align: center !important;
            justify-content: center !important;
          }
          .dash-cards-grid {
            gap: 12px !important;
          }
        }

        /* Very small phone */
        @media (max-width: 360px) {
          .dash-welcome-btns {
            flex-direction: column !important;
          }
          .dash-welcome-title {
            font-size: 1rem !important;
          }
        }
      `}</style >
    </DashboardLayout >
  );
}

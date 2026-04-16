import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Menu, Package, Loader2 } from "lucide-react";

interface TopHeaderProps {
    onToggleSidebar: () => void;
}

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 28px",
        background: "#f8fafc",
        borderBottom: "1px solid #eef0f4",
        position: "sticky",
        top: 0,
        zIndex: 50,
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
    },
    hamburger: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        border: "none",
        borderRadius: 8,
        background: "transparent",
        color: "#334155",
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
    },
    center: {
        display: "flex",
        alignItems: "center",
        gap: 32,
        flex: 1,
        justifyContent: "center",
        maxWidth: 800,
        margin: "0 auto",
    },
    greeting: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        fontWeight: 500,
        color: "#475569",
        whiteSpace: "nowrap",
    },
    sparkle: {
        color: "#6366f1",
    },
    search: {
        position: "relative",
        width: "100%",
        maxWidth: 450,
    },
    searchIcon: {
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
        pointerEvents: "none" as const,
        zIndex: 5,
    },
    searchInput: {
        width: "100%",
        padding: "10px 42px 10px 16px",
        border: "1.5px solid #e2e8f0",
        borderRadius: 12,
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        color: "#1e293b",
        background: "#fff",
        outline: "none",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 0.2s ease",
        flexShrink: 0,
    },
    searchDropdown: {
        position: "absolute",
        top: "120%",
        left: 0,
        right: 0,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        maxHeight: 450,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    resultSection: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    sectionLabel: {
        fontSize: "0.7rem",
        fontWeight: 700,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        padding: "0 8px",
        marginBottom: 4,
    },
    resultItem: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.2s ease",
        textDecoration: "none",
        color: "inherit",
    },
    resultImg: {
        width: 40,
        height: 40,
        borderRadius: 8,
        background: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        flexShrink: 0,
        fontSize: "12px",
        fontWeight: 600,
        overflow: "hidden"
    },
    resultTitle: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#1e293b",
        margin: 0,
    },
    resultDesc: {
        fontSize: "0.75rem",
        color: "#64748b",
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }
};

// ── Fuzzy Logic Helpers ──────────────────────

function fuzzyScore(query: string, target: string): number {
    if (!query || !target) return 0;
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    if (t.includes(q)) return 100;

    const qWords = q.split(/\s+/);
    const tWords = t.split(/\s+/);
    let score = 0;
    for (const qw of qWords) {
        if (qw.length < 2) continue;
        for (const tw of tWords) {
            if (tw.includes(qw)) score += 40;
        }
    }
    return Math.min(score, 90);
}

// ── Component ───────────────────────────────

export default function TopHeader({ onToggleSidebar }: TopHeaderProps) {
    const navigate = useNavigate();

    const role = sessionStorage.getItem("role");
    const userEmail = sessionStorage.getItem("userEmail") || "";
    const adminEmail = sessionStorage.getItem("adminEmail") || "";

    const displayEmail = role === "admin" ? adminEmail : (userEmail || "user@campus.edu");
    const userName = displayEmail.split("@")[0];
    const initials = userName
        .split(/[._-]/)
        .map((seg) => seg[0]?.toUpperCase())
        .join("")
        .slice(0, 2);

    const [hoveredHamburger, setHoveredHamburger] = useState(false);
    const [hoveredAvatar, setHoveredAvatar] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    // Global Search Logic
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                // Fetch lost/found from API
                const res = await fetch(`http://localhost:8080/api/search/items?q=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error("Search API failed");
                const apiData = await res.json();

                // Combine API items with safety checks
                const lostItems = Array.isArray(apiData?.lost) ? apiData.lost : [];
                const foundItems = Array.isArray(apiData?.found) ? apiData.found : [];

                const apiMatches = [
                    ...lostItems.map((it: any) => ({ ...it, type: "lost", score: fuzzyScore(query, it.itemName) })),
                    ...foundItems.map((it: any) => ({ ...it, type: "found", score: fuzzyScore(query, it.itemName) }))
                ];

                // Merge and Sort
                const merged = apiMatches.sort((a, b) => b.score - a.score);
                setSuggestions(merged);
            } catch (e) {
                console.error("Search error:", e);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleResultClick = (item: any) => {
        setSearchFocused(false);
        setQuery("");
        // Include both search query and ID for auto-opening/matching
        navigate(`/lost-and-found?search=${encodeURIComponent(item.itemName)}&id=${item.id}`);
    };

    return (
        <header style={s.header} className="top-header-responsive">
            {/* Left: Hamburger */}
            <div style={s.left}>
                <button
                    style={{
                        ...s.hamburger,
                        ...(hoveredHamburger ? { background: "#f1f5f9", color: "#0f172a" } : {}),
                    }}
                    onClick={onToggleSidebar}
                    onMouseEnter={() => setHoveredHamburger(true)}
                    onMouseLeave={() => setHoveredHamburger(false)}
                    aria-label="Toggle sidebar"
                >
                    <Menu size={15} />
                </button>
            </div>

            {/* Center: Greeting + Search */}
            <div style={s.center} className="top-header-center">
                <div style={s.greeting} className="top-header-greeting">
                    <Sparkles size={18} style={s.sparkle} className="top-header-sparkle" />
                    <span>How can I help today?</span>
                </div>
                <div style={s.search} className="top-header-search">
                    {loading ? (
                        <Loader2 size={18} style={s.searchIcon as any} className="animate-spin" />
                    ) : (
                        <Search size={20} style={s.searchIcon} />
                    )}
                    <input
                        type="text"
                        placeholder="Search for lost and found items..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            ...s.searchInput,
                            ...(searchFocused
                                ? {
                                    borderColor: "#3b82f6",
                                    background: "#fff",
                                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.08)",
                                }
                                : {}),
                        }}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    />

                    {/* Results Dropdown */}
                    {(searchFocused && (query.trim() || loading)) && (
                        <div style={s.searchDropdown}>
                            {loading ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
                                    <Loader2 size={24} style={{ color: "#3b82f6" }} className="animate-spin" />
                                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Finding matches...</span>
                                </div>
                            ) : suggestions.length === 0 && query.trim() ? (
                                <div style={{ textAlign: "center", padding: "12px", color: "#64748b", fontSize: "0.85rem" }}>
                                    No suggestions matching "{query}"
                                </div>
                            ) : suggestions.length > 0 && (
                                <div style={s.resultSection}>
                                    <span style={s.sectionLabel}>Suggested Matches</span>
                                    {suggestions.slice(0, 6).map((item: any, idx) => (
                                        <div
                                            key={item.id || idx}
                                            className="search-result-row"
                                            style={{
                                                ...s.resultItem,
                                                justifyContent: "space-between",
                                            }}
                                            onMouseDown={() => handleResultClick(item)}
                                        >
                                            <div style={{ flex: 1, paddingRight: 12 }}>
                                                <h4 style={s.resultTitle}>{item.itemName}</h4>
                                                <p style={{
                                                    ...s.resultDesc,
                                                    whiteSpace: "normal" as any,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}>
                                                    {item.description}
                                                </p>
                                                {item.type !== "resource" && (
                                                    <div style={{
                                                        marginTop: 4,
                                                        fontSize: "0.6rem",
                                                        fontWeight: 700,
                                                        padding: "2px 6px",
                                                        borderRadius: 4,
                                                        display: "inline-block",
                                                        background: item.type === "lost" ? "#fee2e2" : "#dcfce7",
                                                        color: item.type === "lost" ? "#ef4444" : "#16a34a"
                                                    }}>
                                                        {item.type.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{
                                                ...s.resultImg,
                                                width: 80,
                                                height: 55,
                                                borderRadius: 12,
                                                order: 2,
                                            }}>
                                                {item.imageUrl ? <img src={item.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Package size={20} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Profile */}
            <div style={s.right}>
                <div
                    style={{
                        ...s.avatar,
                        ...(hoveredAvatar ? { transform: "scale(1.08)" } : {}),
                    }}
                    onMouseEnter={() => setHoveredAvatar(true)}
                    onMouseLeave={() => setHoveredAvatar(false)}
                >
                    {initials}
                </div>
            </div>

            {/* Animations + Responsive */}
            <style>{`
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: translateY(-50%) rotate(0deg); }
            to { transform: translateY(-50%) rotate(360deg); }
        }
        .search-result-row:hover {
            background: #fff !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            transform: translateY(-1px);
        }
        .top-header-sparkle {
          animation: sparkleRotate 3s ease-in-out infinite;
        }
        @keyframes sparkleRotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(15deg) scale(1.1); }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .top-header-center {
            padding-left: 0 !important;
            gap: 20px !important;
          }
          .top-header-search {
            max-width: 350px !important;
          }
        }

        /* Small tablet / large phone */
        @media (max-width: 768px) {
          .top-header-responsive {
            padding: 10px 16px !important;
          }
          .top-header-center {
            gap: 12px !important;
            flex-direction: column !important;
          }
          .top-header-greeting {
            display: none !important;
          }
          .top-header-search {
            width: 100% !important;
            max-width: none !important;
          }
        }

        /* Phone */
        @media (max-width: 480px) {
          .top-header-responsive {
            padding: 8px 12px !important;
            gap: 8px !important;
          }
        }
      `}</style>
        </header>
    );
}

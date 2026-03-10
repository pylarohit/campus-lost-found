import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import {
    Search,
    MapPin,
    User,
    MessageCircle,
    X,
    PackageOpen,
    Clock,
    Calendar,
    AlertCircle,
    ArrowRight,
    Zap,
    Filter,
    Flag,
    Image as ImageIcon,
    ChevronDown,
    Sparkles,
    CalendarCheck,
    Phone,
    Mail,
    CheckCircle2,
} from "lucide-react";

// ── Types ───────────────────────────────────

interface LostItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    reportedBy: string;
    category: string;
    tags: string;
    imageUrl: string;
    status?: string;
    type: "lost";
}

interface FoundItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    foundBy: string;
    category: string;
    tags: string;
    imageUrl: string;
    status?: string;
    type: "found";
}

type CombinedItem = LostItem | FoundItem;

// ── Categories ──────────────────────────────

const categoryFilters = [
    "All",
    "Electronics",
    "Documents",
    "Clothing",
    "Accessories",
    "Books & Stationery",
    "Keys",
    "Bags & Wallets",
    "Sports Equipment",
    "Other",
];

const locationFilters = [
    "All Locations",
    "Library",
    "Cafeteria",
    "Main Building",
    "Science Block",
    "Sports Complex",
    "Parking Area",
    "Auditorium",
    "Lab",
    "Hostel",
];

// ── Card themes ─────────────────────────────

const lostThemes = [
    { headerBg: "linear-gradient(135deg, #ef4444, #f87171)", accent: "#dc2626", accentBg: "rgba(220,38,38,0.08)", tagBg: "#fee2e2", tagColor: "#991b1b", badgeBg: "rgba(239,68,68,0.12)", badgeColor: "#dc2626" },
    { headerBg: "linear-gradient(135deg, #f59e0b, #fbbf24)", accent: "#d97706", accentBg: "rgba(217,119,6,0.08)", tagBg: "#fef3c7", tagColor: "#92400e", badgeBg: "rgba(245,158,11,0.12)", badgeColor: "#d97706" },
    { headerBg: "linear-gradient(135deg, #ec4899, #f472b6)", accent: "#db2777", accentBg: "rgba(219,39,119,0.08)", tagBg: "#fce7f3", tagColor: "#9d174d", badgeBg: "rgba(236,72,153,0.12)", badgeColor: "#db2777" },
];

const foundThemes = [
    { headerBg: "linear-gradient(135deg, #10b981, #34d399)", accent: "#059669", accentBg: "rgba(5,150,105,0.08)", tagBg: "#d1fae5", tagColor: "#065f46", badgeBg: "rgba(16,185,129,0.12)", badgeColor: "#059669" },
    { headerBg: "linear-gradient(135deg, #3b82f6, #60a5fa)", accent: "#2563eb", accentBg: "rgba(37,99,235,0.08)", tagBg: "#dbeafe", tagColor: "#1d4ed8", badgeBg: "rgba(59,130,246,0.12)", badgeColor: "#2563eb" },
    { headerBg: "linear-gradient(135deg, #8b5cf6, #a78bfa)", accent: "#7c3aed", accentBg: "rgba(124,58,237,0.08)", tagBg: "#ede9fe", tagColor: "#5b21b6", badgeBg: "rgba(139,92,246,0.12)", badgeColor: "#7c3aed" },
];

// ── Fuzzy match helper ──────────────────────

function fuzzyScore(query: string, target: string): number {
    if (!query || !target) return 0;
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    if (t.includes(q)) return 100;
    // Simple word overlap
    const qWords = q.split(/\s+/);
    const tWords = t.split(/\s+/);
    let score = 0;
    for (const qw of qWords) {
        for (const tw of tWords) {
            if (tw.includes(qw) || qw.includes(tw)) score += 30;
            else if (levenshtein(qw, tw) <= 2) score += 15;
        }
    }
    return Math.min(score, 90);
}

function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
    return dp[m][n];
}

function getSuggestedMatches(lostItems: LostItem[], foundItems: FoundItem[]): { lost: LostItem; found: FoundItem; score: number }[] {
    const matches: { lost: LostItem; found: FoundItem; score: number }[] = [];
    for (const lost of lostItems) {
        for (const found of foundItems) {
            let score = 0;
            score += fuzzyScore(lost.itemName, found.itemName) * 0.4;
            score += fuzzyScore(lost.category || "", found.category || "") * 0.2;
            score += fuzzyScore(lost.tags || "", found.tags || "") * 0.15;
            score += fuzzyScore(lost.location || "", found.location || "") * 0.15;
            score += fuzzyScore(lost.description || "", found.description || "") * 0.1;
            if (score > 15) matches.push({ lost, found, score });
        }
    }
    return matches.sort((a, b) => b.score - a.score).slice(0, 8);
}

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: { maxWidth: 1100, margin: "0 auto" },

    /* Hero Banner */
    hero: {
        position: "relative", overflow: "hidden", borderRadius: 20,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        padding: "40px 36px", marginBottom: 28,
        border: "1px solid rgba(255,255,255,0.08)",
    },
    heroGlow1: {
        position: "absolute", top: -60, right: -40, width: 200, height: 200,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent)",
        filter: "blur(40px)", pointerEvents: "none",
    },
    heroGlow2: {
        position: "absolute", bottom: -40, left: -20, width: 160, height: 160,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent)",
        filter: "blur(40px)", pointerEvents: "none",
    },
    heroContent: { position: "relative", zIndex: 2 },
    heroTag: {
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 14px", borderRadius: 20,
        background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
        fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600,
        color: "#a5b4fc", marginBottom: 14,
    },
    heroTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.8rem", fontWeight: 800,
        color: "#f1f5f9", lineHeight: 1.2, letterSpacing: "-0.03em",
        margin: 0, marginBottom: 10,
    },
    heroDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#94a3b8",
        lineHeight: 1.6, maxWidth: 500, margin: 0,
    },

    /* Tabs & Filters */
    controlBar: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 12,
    },
    tabs: {
        display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4,
    },
    tab: {
        padding: "9px 20px", borderRadius: 10, border: "none",
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600,
        cursor: "pointer", transition: "all 0.25s ease",
        background: "transparent", color: "#64748b",
    },
    tabActive: {
        background: "#fff", color: "#0f172a",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    },
    filterRow: {
        display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
    },
    filterSelect: {
        padding: "8px 32px 8px 12px", borderRadius: 8,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.8rem", color: "#334155", background: "#fff",
        cursor: "pointer", outline: "none", appearance: "none" as const,
    },

    /* Search */
    searchWrap: { position: "relative", marginBottom: 20 },
    searchIcon: {
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: "#94a3b8", pointerEvents: "none",
    },
    searchInput: {
        width: "100%", padding: "12px 16px 12px 44px", borderRadius: 12,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", color: "#0f172a", background: "#fff", outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxSizing: "border-box" as const,
    },

    /* Matching Section */
    matchSection: {
        background: "linear-gradient(135deg, #faf5ff 0%, #eef2ff 100%)",
        borderRadius: 16, padding: "24px", marginBottom: 24,
        border: "1px solid #e0e7ff",
    },
    matchHeader: {
        display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
    },
    matchIcon: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 40, height: 40, borderRadius: 10,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff",
    },
    matchTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 700,
        color: "#0f172a", margin: 0,
    },
    matchSub: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#64748b",
        margin: 0,
    },
    matchGrid: {
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12,
    },
    matchCard: {
        display: "flex", gap: 12, padding: "14px", borderRadius: 12,
        background: "#fff", border: "1px solid #e2e8f0",
        transition: "all 0.2s ease", cursor: "pointer",
    },
    matchThumb: {
        width: 52, height: 52, borderRadius: 10, flexShrink: 0,
        overflow: "hidden", background: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    matchInfo: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 },
    matchName: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 650,
        color: "#0f172a", margin: 0, whiteSpace: "nowrap",
        overflow: "hidden", textOverflow: "ellipsis",
    },
    matchMeta: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "#64748b",
        margin: 0,
    },
    matchScore: {
        padding: "2px 8px", borderRadius: 6,
        fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", fontWeight: 700,
        background: "rgba(99,102,241,0.1)", color: "#6366f1",
        alignSelf: "flex-start",
    },

    /* Grid */
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },

    /* Card */
    card: {
        borderRadius: 14, background: "#fff", overflow: "hidden",
        border: "1px solid #e8ecf1", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
    },
    cardColorBar: { height: 6, width: "100%" },
    cardImgSection: {
        width: "100%", height: 130, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f8fafc",
    },
    cardImgActual: { width: "100%", height: "100%", objectFit: "cover" as const },
    cardImgPlaceholder: { display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" },
    cardBody: {
        padding: "14px 16px 16px", display: "flex", flexDirection: "column",
        gap: 6, flex: 1,
    },
    cardItemName: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 700,
        color: "#0f172a", margin: 0, lineHeight: 1.3,
    },
    cardDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.76rem", color: "#475569",
        lineHeight: 1.55, margin: 0, display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
    },
    cardTags: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 },
    cardTag: {
        padding: "2px 8px", borderRadius: 5, fontFamily: "'Inter', sans-serif",
        fontSize: "0.62rem", fontWeight: 600,
    },
    cardMeta: {
        display: "flex", flexDirection: "column", gap: 4, marginTop: "auto", paddingTop: 8,
    },
    cardMetaItem: {
        display: "flex", alignItems: "center", gap: 5,
        fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#64748b",
    },
    cardActions: {
        display: "flex", gap: 6, padding: "10px 14px", borderTop: "1px solid #f1f5f9",
    },
    cardBtn: {
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 5, padding: "7px 0", borderRadius: 7, border: "1.5px solid #e2e8f0",
        background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
        fontWeight: 600, color: "#475569", cursor: "pointer", transition: "all 0.2s ease",
    },
    cardBtnFlag: {
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 5, padding: "7px 0", borderRadius: 7,
        border: "1.5px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.05)",
        fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600,
        color: "#d97706", cursor: "pointer", transition: "all 0.2s ease",
    },

    /* Empty */
    empty: {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "60px 20px", gap: 14,
    },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 16,
        background: "rgba(99,102,241,0.1)", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#6366f1",
    },
    emptyTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.05rem",
        fontWeight: 600, color: "#0f172a", margin: 0,
    },
    emptyDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem",
        color: "#64748b", margin: 0, textAlign: "center", maxWidth: 360,
    },

    /* Modal */
    overlay: {
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)", zIndex: 1000, display: "flex",
        alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease",
    },
    modal: {
        background: "#fff", borderRadius: 16, width: "90%", maxWidth: 520,
        maxHeight: "90vh", overflowY: "auto", padding: "28px 28px 24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", position: "relative",
        animation: "modalSlideUp 0.3s ease",
    },
    modalHeader: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 22,
    },
    modalTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.15rem",
        fontWeight: 700, color: "#0f172a", margin: 0,
    },
    modalClose: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: 8, border: "none",
        background: "#f1f5f9", color: "#64748b", cursor: "pointer",
        transition: "all 0.2s ease",
    },
    detailImg: {
        width: "100%", height: 220, objectFit: "cover" as const,
        borderRadius: 10, marginBottom: 16,
    },
    detailRow: {
        display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#475569",
    },
    detailLabel: { fontWeight: 600, color: "#0f172a", minWidth: 80 },
};

// ── Component ───────────────────────────────

export default function LostAndFound() {
    const navigate = useNavigate();
    const location = useLocation();
    const [lostItems, setLostItems] = useState<LostItem[]>([]);
    const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Read search param from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get("search");
        const id = params.get("id");

        if (search) {
            setSearchQuery(search);
            // Reset filters to ensure the item is visible
            setActiveTab("all");
            setCategoryFilter("All");
            setLocationFilter("All Locations");
        }

        if (id && (lostItems.length > 0 || foundItems.length > 0)) {
            const all = [
                ...lostItems.map(i => ({ ...i, type: "lost" as const })),
                ...foundItems.map(i => ({ ...i, type: "found" as const }))
            ];
            const matched = all.find(i => String(i.id) === String(id));
            if (matched) {
                setViewItem(matched);
            }
        }
    }, [location.search, lostItems, foundItems]);

    const [activeTab, setActiveTab] = useState<"all" | "lost" | "found" | "matches">("all");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All Locations");
    const [viewItem, setViewItem] = useState<CombinedItem | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Booking modal state
    const [bookingItem, setBookingItem] = useState<CombinedItem | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        place: "",
        phone: "",
        email: localStorage.getItem("userEmail") || "",
    });

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [lostRes, foundRes] = await Promise.all([
                    fetch("http://localhost:8080/api/lost/approved"),
                    fetch("http://localhost:8080/api/found/approved"),
                ]);
                if (lostRes.ok) {
                    const data = await lostRes.json();
                    setLostItems(data.map((i: any) => ({ ...i, type: "lost" })));
                }
                if (foundRes.ok) {
                    const data = await foundRes.json();
                    setFoundItems(data.map((i: any) => ({ ...i, type: "found" })));
                }
            } catch (err) {
                console.error("Failed to fetch items:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Flag item
    const handleFlag = async (item: CombinedItem) => {
        const reason = window.prompt("Why are you flagging this item?");
        if (!reason) return;
        const type = item.type === "lost" ? "lost" : "found";
        try {
            await fetch(`http://localhost:8080/api/${type}/${item.id}/flag`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });
            alert("Item flagged for admin review ✓");
        } catch {
            alert("Failed to flag item.");
        }
    };

    // Booking submit
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingItem) return;
        try {
            const booking = {
                resourceId: bookingItem.id,
                userEmail: bookingForm.email,
                itemName: bookingItem.itemName,
                place: bookingForm.place,
                phone: bookingForm.phone,
                startTime: `${bookingForm.date}T${bookingForm.time}:00`,
                endTime: `${bookingForm.date}T${bookingForm.time}:00`,
                status: "confirmed",
            };
            const res = await fetch("http://localhost:8080/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(booking),
            });
            if (!res.ok) throw new Error("API error");
            setBookingSuccess(true);
            setTimeout(() => {
                setBookingItem(null);
                setBookingSuccess(false);
            }, 2500);
        } catch {
            alert("Failed to book. Please try again.");
        }
    };

    // Filter logic
    const filterItem = (item: CombinedItem) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query ||
            (item.itemName || "").toLowerCase().includes(query) ||
            (item.description || "").toLowerCase().includes(query) ||
            (item.category || "").toLowerCase().includes(query) ||
            (item.tags || "").toLowerCase().includes(query) ||
            ("location" in item && (item as any).location || "").toLowerCase().includes(query);
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchesLocation = locationFilter === "All Locations" ||
            (item.location || "").toLowerCase().includes(locationFilter.toLowerCase());
        return matchesSearch && matchesCategory && matchesLocation;
    };

    const allItems: CombinedItem[] = [
        ...lostItems.map(i => ({ ...i, type: "lost" as const })),
        ...foundItems.map(i => ({ ...i, type: "found" as const })),
    ];

    const displayItems = allItems
        .filter(filterItem)
        .filter(item => {
            if (activeTab === "lost") return item.type === "lost";
            if (activeTab === "found") return item.type === "found";
            return true;
        });

    const suggestedMatches = getSuggestedMatches(lostItems, foundItems);

    const getItemOwner = (item: CombinedItem) =>
        item.type === "lost" ? (item as LostItem).reportedBy : (item as FoundItem).foundBy;

    return (
        <DashboardLayout>
            <div style={s.page} className="lf-page-anim">

                {/* ── Hero Banner ──────────────────── */}
                <div style={s.hero as any} className="lf-hero">
                    <div style={s.heroGlow1 as any} />
                    <div style={s.heroGlow2 as any} />
                    <div style={s.heroContent as any}>
                        <div style={s.heroTag}>
                            <Sparkles size={13} /> Smart Matching
                        </div>
                        <h1 style={s.heroTitle} className="lf-hero-title">
                            Lost & Found Hub
                        </h1>
                        <p style={s.heroDesc} className="lf-hero-desc">
                            Browse all lost and found items on campus. Our matching algorithm
                            automatically suggests potential matches between lost and found items.
                        </p>
                    </div>
                </div>

                {/* ── Tabs & Filters ────────────────── */}
                <div style={s.controlBar} className="lf-control-bar">
                    <div style={s.tabs}>
                        {(["all", "lost", "found", "matches"] as const).map(tab => (
                            <button
                                key={tab}
                                style={{
                                    ...s.tab,
                                    ...(activeTab === tab ? s.tabActive : {}),
                                }}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "all" ? "All Items" :
                                    tab === "lost" ? "🔴 Lost" :
                                        tab === "found" ? "🟢 Found" : "✨ Matches"}
                            </button>
                        ))}
                    </div>
                    <div style={s.filterRow}>
                        <div style={{ position: "relative" }}>
                            <select
                                style={s.filterSelect}
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                            >
                                {categoryFilters.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ position: "relative" }}>
                            <select
                                style={s.filterSelect}
                                value={locationFilter}
                                onChange={e => setLocationFilter(e.target.value)}
                            >
                                {locationFilters.map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Suggested Matches ──────────────── */}
                {activeTab === "matches" && (
                    <div style={s.matchSection}>
                        <div style={s.matchHeader}>
                            <div style={s.matchIcon as any}>
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 style={s.matchTitle}>Suggested Matches</h3>
                                <p style={s.matchSub}>
                                    AI-powered matches between lost and found items using keyword similarity & location data
                                </p>
                            </div>
                        </div>
                        {suggestedMatches.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "20px 0", color: "#64748b", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
                                No matches found yet. More items will improve matching accuracy.
                            </div>
                        ) : (
                            <div style={s.matchGrid} className="lf-match-grid">
                                {suggestedMatches.map((match, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            ...s.matchCard,
                                            flexDirection: "column",
                                            gap: 14,
                                            ...(hoveredCard === `match-${i}` ? { transform: "translateY(-4px)", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" } : {}),
                                        }}
                                        onMouseEnter={() => setHoveredCard(`match-${i}`)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div style={{ display: "flex", gap: 12 }}>
                                            <div style={s.matchThumb as any}>
                                                {match.found.imageUrl ? (
                                                    <img src={match.found.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <PackageOpen size={20} style={{ color: "#94a3b8" }} />
                                                )}
                                            </div>
                                            <div style={s.matchInfo as any}>
                                                <p style={s.matchName}>
                                                    <span style={{ color: "#dc2626", fontWeight: 700 }}>Lost:</span> {match.lost.itemName}
                                                </p>
                                                <p style={s.matchName}>
                                                    <span style={{ color: "#059669", fontWeight: 700 }}>Found:</span> {match.found.itemName}
                                                </p>
                                                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                                                    <span style={s.matchScore}>
                                                        {Math.round(match.score)}% AI Match
                                                    </span>
                                                    <span style={{ ...s.matchMeta, fontSize: "0.62rem" }}>
                                                        📍 {match.found.location || "Unknown"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                                            <button
                                                style={{
                                                    ...s.cardBtn,
                                                    flex: 1,
                                                    padding: "8px 0",
                                                    fontSize: "0.72rem",
                                                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                                    color: "#fff",
                                                    border: "none"
                                                }}
                                                onClick={(e) => { e.stopPropagation(); setViewItem({ ...match.found, type: "found" }); }}
                                            >
                                                View Match Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Items Grid ──────────────────────── */}
                {activeTab !== "matches" && (
                    <>
                        {loading ? (
                            <div style={s.empty as any}>
                                <div style={{ ...s.emptyIcon, animation: "pulse 1.5s infinite" }}><Clock size={28} /></div>
                                <p style={s.emptyTitle}>Loading items…</p>
                            </div>
                        ) : displayItems.length === 0 ? (
                            <div style={s.empty as any}>
                                <div style={s.emptyIcon}><AlertCircle size={28} /></div>
                                <p style={s.emptyTitle}>No items found</p>
                                <p style={s.emptyDesc}>
                                    {searchQuery ? "Try adjusting your search or filters." : "No items have been posted yet."}
                                </p>
                            </div>
                        ) : (
                            <div style={s.grid} className="lf-cards-grid">
                                {displayItems.map((item, index) => {
                                    const isLost = item.type === "lost";
                                    const themes = isLost ? lostThemes : foundThemes;
                                    const theme = themes[index % themes.length];
                                    const hovered = hoveredCard === `${item.type}-${item.id}`;
                                    const itemTags = (item.tags || "").split(",").filter(Boolean);

                                    return (
                                        <div
                                            key={`${item.type}-${item.id}`}
                                            style={{
                                                ...s.card,
                                                ...(hovered ? { transform: "translateY(-4px)", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" } : {}),
                                            }}
                                            onMouseEnter={() => setHoveredCard(`${item.type}-${item.id}`)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            <div
                                                style={{ cursor: "pointer", flex: 1, display: "flex", flexDirection: "column" }}
                                                onClick={() => setViewItem(item)}
                                            >
                                                <div style={s.cardImgSection as any}>
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.itemName} style={s.cardImgActual} />
                                                    ) : (
                                                        <div style={s.cardImgPlaceholder}><ImageIcon size={36} /></div>
                                                    )}
                                                    {/* Type badge */}
                                                    <span style={{
                                                        position: "absolute", top: 8, left: 8,
                                                        padding: "3px 10px", borderRadius: 6,
                                                        background: theme.badgeBg,
                                                        fontFamily: "'Inter', sans-serif", fontSize: "0.62rem",
                                                        fontWeight: 700, color: theme.badgeColor,
                                                    }}>
                                                        {isLost ? "LOST" : "FOUND"}
                                                    </span>
                                                    {item.category && (
                                                        <span style={{
                                                            position: "absolute", top: 8, right: 8,
                                                            padding: "3px 10px", borderRadius: 6,
                                                            background: "rgba(255,255,255,0.92)",
                                                            backdropFilter: "blur(4px)",
                                                            fontFamily: "'Inter', sans-serif", fontSize: "0.62rem",
                                                            fontWeight: 700, color: theme.accent,
                                                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                                        }}>
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <div style={s.cardBody as any}>
                                                    <h4 style={s.cardItemName}>{item.itemName}</h4>
                                                    <p style={s.cardDesc}>{item.description || "No description provided."}</p>

                                                    {itemTags.length > 0 && (
                                                        <div style={s.cardTags}>
                                                            {itemTags.slice(0, 3).map(tag => (
                                                                <span key={tag} style={{
                                                                    ...s.cardTag, background: theme.tagBg, color: theme.tagColor,
                                                                }}>
                                                                    {tag.trim()}
                                                                </span>
                                                            ))}
                                                            {itemTags.length > 3 && (
                                                                <span style={{ ...s.cardTag, background: "#f1f5f9", color: "#64748b" }}>
                                                                    +{itemTags.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div style={s.cardMeta as any}>
                                                        <div style={s.cardMetaItem}>
                                                            <MapPin size={12} style={{ color: theme.accent }} />
                                                            <span>{item.location || "Unknown"}</span>
                                                        </div>
                                                        <div style={s.cardMetaItem}>
                                                            <User size={12} style={{ color: theme.accent }} />
                                                            <span>{getItemOwner(item)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={s.cardActions}>
                                                {getItemOwner(item) === localStorage.getItem("userEmail") ? (
                                                    <div style={{
                                                        flex: 1, padding: "8px", borderRadius: 12,
                                                        background: "#f1f5f9", color: "#64748b",
                                                        textAlign: "center", fontSize: "0.82rem", fontWeight: 700,
                                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                                                    }}>
                                                        <User size={14} /> Your Post
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            style={{
                                                                ...s.cardBtn,
                                                                background: "rgba(99, 102, 241, 0.08)",
                                                                color: "#4f46e5",
                                                                borderColor: "rgba(99, 102, 241, 0.2)",
                                                            }}
                                                            onClick={() => { setBookingItem(item); setBookingForm(f => ({ ...f, place: item.location || "" })); }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)"; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99, 102, 241, 0.08)"; }}
                                                        >
                                                            <CalendarCheck size={13} /> Booking
                                                        </button>
                                                        <button
                                                            style={s.cardBtnFlag}
                                                            onClick={() => handleFlag(item)}
                                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.12)"; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,158,11,0.05)"; }}
                                                        >
                                                            <Flag size={13} /> Report
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── View Detail Modal ─────────────────── */}
            {viewItem && (
                <div style={s.overlay as any} onClick={() => setViewItem(null)}>
                    <div style={s.modal as any} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h3 style={s.modalTitle}>
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    padding: "3px 10px", borderRadius: 6, marginRight: 8,
                                    background: viewItem.type === "lost" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                                    color: viewItem.type === "lost" ? "#dc2626" : "#059669",
                                    fontSize: "0.72rem", fontWeight: 700,
                                }}>
                                    {viewItem.type === "lost" ? "LOST" : "FOUND"}
                                </span>
                                {viewItem.itemName}
                            </h3>
                            <button
                                style={s.modalClose}
                                onClick={() => setViewItem(null)}
                                onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {viewItem.imageUrl && (
                            <img src={viewItem.imageUrl} alt={viewItem.itemName} style={s.detailImg} />
                        )}
                        <div style={s.detailRow}>
                            <span style={s.detailLabel}>Description</span>
                            <span>{viewItem.description || "—"}</span>
                        </div>
                        <div style={s.detailRow}>
                            <span style={s.detailLabel}>Category</span>
                            <span>{viewItem.category || "—"}</span>
                        </div>
                        <div style={s.detailRow}>
                            <span style={s.detailLabel}>Tags</span>
                            <span>{viewItem.tags ? viewItem.tags.split(",").join(", ") : "—"}</span>
                        </div>
                        <div style={s.detailRow}>
                            <span style={s.detailLabel}>Location</span>
                            <span>{viewItem.location || "—"}</span>
                        </div>
                        <div style={s.detailRow}>
                            <span style={s.detailLabel}>{viewItem.type === "lost" ? "Reported By" : "Found By"}</span>
                            <span>{getItemOwner(viewItem)}</span>
                        </div>

                        {/* Modal Actions */}
                        <div style={{ ...s.cardActions, marginTop: 24, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                            {getItemOwner(viewItem) === localStorage.getItem("userEmail") ? (
                                <div style={{
                                    flex: 1, padding: "12px", borderRadius: 12,
                                    background: "#f1f5f9", color: "#64748b",
                                    textAlign: "center", fontSize: "0.9rem", fontWeight: 700,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                }}>
                                    <User size={16} /> Your Post
                                </div>
                            ) : (
                                <>
                                    <button
                                        style={{
                                            ...s.cardBtn,
                                            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                            color: "#fff",
                                            border: "none",
                                            flex: 1,
                                            padding: "12px 0",
                                        }}
                                        onClick={() => navigate("/chat", { state: { targetEmail: getItemOwner(viewItem) } })}
                                    >
                                        <MessageCircle size={15} /> Connect
                                    </button>
                                    <button
                                        style={{ ...s.cardBtnFlag, flex: 1, padding: "12px 0" }}
                                        onClick={() => handleFlag(viewItem)}
                                    >
                                        <Flag size={15} /> Report
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Booking Modal ──────────────────── */}
            {bookingItem && (
                <div
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)",
                        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 20, animation: "fadeIn 0.25s ease",
                    }}
                    onClick={() => !bookingSuccess && setBookingItem(null)}
                >
                    <div
                        style={{
                            background: "#fff", borderRadius: 24, width: "100%", maxWidth: 480,
                            padding: 32, boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                            position: "relative", animation: "modalSlideUp 0.3s ease",
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setBookingItem(null)}
                            style={{
                                position: "absolute", top: 20, right: 20, width: 36, height: 36,
                                borderRadius: "50%", background: "#f1f5f9", border: "none",
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#64748b", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}
                        >
                            <X size={18} />
                        </button>

                        {bookingSuccess ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                                <div style={{
                                    width: 72, height: 72, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                    color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 20px", animation: "modalSlideUp 0.4s ease",
                                }}>
                                    <CheckCircle2 size={36} />
                                </div>
                                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Booking Confirmed!</h3>
                                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>Details have been sent to your email.</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", flexShrink: 0,
                                    }}>
                                        <CalendarCheck size={24} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Book a Slot</h2>
                                        <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>{bookingItem.itemName}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 650, color: "#334155", marginBottom: 6 }}>
                                                <Calendar size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Date
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={bookingForm.date}
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                                                style={{
                                                    width: "100%", padding: "11px 14px", borderRadius: 12,
                                                    border: "1.5px solid #e2e8f0", fontSize: "0.88rem",
                                                    fontFamily: "'Inter', sans-serif", outline: "none",
                                                    transition: "border-color 0.2s",
                                                }}
                                                onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 650, color: "#334155", marginBottom: 6 }}>
                                                <Clock size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Time
                                            </label>
                                            <input
                                                type="time"
                                                required
                                                value={bookingForm.time}
                                                onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                                                style={{
                                                    width: "100%", padding: "11px 14px", borderRadius: 12,
                                                    border: "1.5px solid #e2e8f0", fontSize: "0.88rem",
                                                    fontFamily: "'Inter', sans-serif", outline: "none",
                                                    transition: "border-color 0.2s",
                                                }}
                                                onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 650, color: "#334155", marginBottom: 6 }}>
                                            <MapPin size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Place
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Library, Main Gate"
                                            value={bookingForm.place}
                                            onChange={e => setBookingForm({ ...bookingForm, place: e.target.value })}
                                            style={{
                                                width: "100%", padding: "11px 14px", borderRadius: 12,
                                                border: "1.5px solid #e2e8f0", fontSize: "0.88rem",
                                                fontFamily: "'Inter', sans-serif", outline: "none",
                                                transition: "border-color 0.2s", boxSizing: "border-box",
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 650, color: "#334155", marginBottom: 6 }}>
                                            <Phone size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+91 XXXXX XXXXX"
                                            value={bookingForm.phone}
                                            onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                            style={{
                                                width: "100%", padding: "11px 14px", borderRadius: 12,
                                                border: "1.5px solid #e2e8f0", fontSize: "0.88rem",
                                                fontFamily: "'Inter', sans-serif", outline: "none",
                                                transition: "border-color 0.2s", boxSizing: "border-box",
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 650, color: "#334155", marginBottom: 6 }}>
                                            <Mail size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="your@campus.edu"
                                            value={bookingForm.email}
                                            onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
                                            style={{
                                                width: "100%", padding: "11px 14px", borderRadius: 12,
                                                border: "1.5px solid #e2e8f0", fontSize: "0.88rem",
                                                fontFamily: "'Inter', sans-serif", outline: "none",
                                                transition: "border-color 0.2s", boxSizing: "border-box",
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            padding: "14px", borderRadius: 14, border: "none",
                                            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                            color: "#fff", fontFamily: "'Inter', sans-serif",
                                            fontSize: "0.92rem", fontWeight: 700, cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                            transition: "all 0.2s ease", marginTop: 4,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.3)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                                    >
                                        <CalendarCheck size={18} /> Confirm Booking
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Animations + Responsive */}
            <style>{`
                .lf-page-anim {
                    animation: lfPageIn 0.4s ease;
                }
                @keyframes lfPageIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @media (max-width: 1024px) {
                    .lf-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .lf-match-grid { grid-template-columns: 1fr !important; }
                    .lf-hero-title { font-size: 1.5rem !important; }
                }
                @media (max-width: 768px) {
                    .lf-cards-grid { grid-template-columns: 1fr !important; }
                    .lf-control-bar { flex-direction: column !important; align-items: stretch !important; }
                    .lf-hero-title { font-size: 1.3rem !important; }
                    .lf-hero-desc { font-size: 0.82rem !important; }
                }
                @media (max-width: 480px) {
                    .lf-hero-title { font-size: 1.15rem !important; }
                }
            `}</style>
        </DashboardLayout>
    );
}

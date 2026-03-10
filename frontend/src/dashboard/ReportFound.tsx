import React, { useState, useEffect, CSSProperties, useRef } from "react";
import DashboardLayout from "./DashboardLayout";
import {
    Search as SearchIcon,
    Plus,
    MapPin,
    User,
    X,
    ArrowRight,
    AlertCircle,
    Clock,
    Upload,
    Image as ImageIcon,
    ChevronDown,
    Trash2,
    Eye,
    History,
    PackageOpen,
    CheckCircle,
} from "lucide-react";

// ── Types ───────────────────────────────────

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
}

const categories = [
    "Electronics", "Documents", "Clothing", "Accessories",
    "Books & Stationery", "Keys", "Bags & Wallets",
    "Sports Equipment", "Other",
];

const tagOptions = [
    "electronics", "documents", "clothing", "accessories",
    "books", "keys", "wallet", "phone", "laptop", "charger",
    "id-card", "glasses", "jewelry", "sports", "water-bottle",
    "headphones", "umbrella", "other",
];

const cardThemes = [
    { headerBg: "linear-gradient(135deg, #10b981, #34d399)", accent: "#059669", accentBg: "rgba(5,150,105,0.1)", tagBg: "#d1fae5", tagColor: "#065f46" },
    { headerBg: "linear-gradient(135deg, #3b82f6, #60a5fa)", accent: "#2563eb", accentBg: "rgba(37,99,235,0.1)", tagBg: "#dbeafe", tagColor: "#1d4ed8" },
    { headerBg: "linear-gradient(135deg, #8b5cf6, #a78bfa)", accent: "#7c3aed", accentBg: "rgba(124,58,237,0.1)", tagBg: "#ede9fe", tagColor: "#5b21b6" },
    { headerBg: "linear-gradient(135deg, #06b6d4, #22d3ee)", accent: "#0891b2", accentBg: "rgba(8,145,178,0.1)", tagBg: "#cffafe", tagColor: "#155e75" },
    { headerBg: "linear-gradient(135deg, #f59e0b, #fbbf24)", accent: "#d97706", accentBg: "rgba(217,119,6,0.1)", tagBg: "#fef3c7", tagColor: "#92400e" },
    { headerBg: "linear-gradient(135deg, #14b8a6, #2dd4bf)", accent: "#0d9488", accentBg: "rgba(13,148,136,0.1)", tagBg: "#ccfbf1", tagColor: "#134e4a" },
];

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: { maxWidth: 1100, margin: "0 auto" },

    banner: {
        position: "relative", overflow: "hidden", borderRadius: 16,
        border: "1px solid #d1fae5", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        background: "#fff", display: "flex", alignItems: "center",
        height: 220, marginBottom: 28,
    },
    bannerBlob: {
        position: "absolute", top: -50, left: -30, width: 140, height: 160,
        borderRadius: "50%", background: "linear-gradient(135deg, #6ee7b7, #34d399)",
        filter: "blur(50px)", opacity: 0.3, pointerEvents: "none", zIndex: 0,
    },
    bannerContent: {
        flex: 1, padding: "32px 36px", position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 10,
    },
    bannerTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.55rem", fontWeight: 700,
        color: "#0f172a", lineHeight: 1.25, letterSpacing: "-0.02em", margin: 0,
    },
    bannerDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "#475569",
        lineHeight: 1.55, maxWidth: 400, margin: 0,
    },
    bannerBtn: {
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "10px 22px", borderRadius: 8, fontFamily: "'Inter', sans-serif",
        fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
        transition: "all 0.25s ease", border: "none",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "#fff", boxShadow: "0 2px 10px rgba(16,185,129,0.3)",
        marginTop: 6, width: "fit-content",
    },
    bannerVisual: {
        flex: 1, height: "100%", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    bannerGradient: {
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
        opacity: 0.4, zIndex: 1,
    },
    bannerImg: {
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover" as const, zIndex: 2,
    },

    titleRow: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 12,
    },
    titleLeft: { display: "flex", flexDirection: "column", gap: 4 },
    titleMain: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.4rem", fontWeight: 700,
        color: "#0f172a", letterSpacing: "-0.02em", margin: 0,
    },
    titleSub: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#64748b", margin: 0,
    },
    titleBtns: { display: "flex", gap: 10, flexWrap: "wrap" },
    reportBtn: {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 22px", borderRadius: 10, fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
        transition: "all 0.25s ease", border: "none",
        background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff",
        boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
    },
    historyBtn: {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 22px", borderRadius: 10, fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
        transition: "all 0.25s ease", border: "1.5px solid #e2e8f0",
        background: "#fff", color: "#334155",
    },

    searchWrap: { position: "relative", marginBottom: 20 },
    searchIcon: {
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: "#94a3b8", pointerEvents: "none",
    },
    searchInput: {
        width: "100%", padding: "11px 16px 11px 42px", borderRadius: 10,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", color: "#0f172a", background: "#fff", outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxSizing: "border-box" as const,
    },

    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },

    card: {
        borderRadius: 14, background: "#fff", overflow: "hidden",
        border: "1px solid #e8ecf1", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
    },
    cardColorBar: { height: 8, width: "100%" },
    cardImgSection: {
        width: "100%", height: 130, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f1f5f9",
    },
    cardImgActual: { width: "100%", height: "100%", objectFit: "cover" as const },
    cardImgPlaceholder: { display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" },
    cardBody: {
        padding: "14px 16px 16px", display: "flex", flexDirection: "column",
        gap: 6, flex: 1,
    },
    cardItemName: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", fontWeight: 700,
        color: "#0f172a", margin: 0, lineHeight: 1.3,
    },
    cardDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#475569",
        lineHeight: 1.55, margin: 0, display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
    },
    cardTags: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 },
    cardTag: {
        padding: "2px 8px", borderRadius: 5, fontFamily: "'Inter', sans-serif",
        fontSize: "0.63rem", fontWeight: 600,
    },
    cardMeta: {
        display: "flex", flexDirection: "column", gap: 4, marginTop: "auto", paddingTop: 8,
    },
    cardMetaItem: {
        display: "flex", alignItems: "center", gap: 5,
        fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#64748b",
    },
    cardActions: {
        display: "flex", gap: 8, padding: "12px 16px",
        borderTop: "1px solid #f1f5f9",
    },
    cardBtn: {
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 5, padding: "7px 0", borderRadius: 7, border: "1.5px solid #e2e8f0",
        background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
        fontWeight: 600, color: "#475569", cursor: "pointer", transition: "all 0.2s ease",
    },
    cardBtnDanger: {
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 5, padding: "7px 0", borderRadius: 7,
        border: "1.5px solid rgba(239,68,68,0.2)",
        background: "rgba(239,68,68,0.05)", fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem", fontWeight: 600, color: "#ef4444",
        cursor: "pointer", transition: "all 0.2s ease",
    },

    empty: {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "60px 20px", gap: 14,
    },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 16,
        background: "rgba(16,185,129,0.1)", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#10b981",
    },
    emptyTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.1rem",
        fontWeight: 600, color: "#0f172a", margin: 0,
    },
    emptyDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.84rem",
        color: "#64748b", margin: 0, textAlign: "center", maxWidth: 360,
    },

    overlay: {
        position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)",
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
    formGroup: { marginBottom: 16 },
    formLabel: {
        display: "block", fontFamily: "'Inter', sans-serif",
        fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: 6,
    },
    formInput: {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", color: "#0f172a", outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxSizing: "border-box" as const, background: "#fff",
    },
    formTextarea: {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", color: "#0f172a", outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" as const,
    },
    formSelect: {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem", color: "#0f172a", outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxSizing: "border-box" as const, background: "#fff",
        cursor: "pointer", appearance: "none" as const,
    },
    selectWrap: { position: "relative" },
    selectArrow: {
        position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8",
    },
    uploadArea: {
        width: "100%", padding: "28px 20px", borderRadius: 10,
        border: "2px dashed #d1fae5", background: "#f0fdf4",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 8, cursor: "pointer",
        transition: "all 0.2s ease", boxSizing: "border-box" as const,
    },
    uploadTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
        fontWeight: 600, color: "#0f172a", margin: 0,
    },
    uploadDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
        color: "#94a3b8", margin: 0, textAlign: "center",
    },
    uploadBtn: {
        padding: "6px 16px", borderRadius: 6, border: "1.5px solid #d1fae5",
        background: "#fff", fontFamily: "'Inter', sans-serif",
        fontSize: "0.78rem", fontWeight: 600, color: "#059669",
        cursor: "pointer", transition: "all 0.2s ease", marginTop: 4,
    },
    uploadPreview: {
        width: "100%", borderRadius: 10, overflow: "hidden",
        position: "relative", border: "1.5px solid #d1fae5",
    },
    uploadPreviewImg: {
        width: "100%", height: 160, objectFit: "cover" as const, display: "block",
    },
    uploadRemove: {
        position: "absolute", top: 8, right: 8, width: 28, height: 28,
        borderRadius: 6, border: "none", background: "rgba(0,0,0,0.5)",
        color: "#fff", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center",
        transition: "background 0.2s ease",
    },
    submitBtn: {
        width: "100%", padding: "12px", borderRadius: 10, border: "none",
        fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 600,
        cursor: "pointer", transition: "all 0.25s ease",
        background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff",
        boxShadow: "0 4px 14px rgba(16,185,129,0.35)", marginTop: 4,
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

const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#10b981";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)";
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.boxShadow = "none";
};

// ── Component ───────────────────────────────

export default function ReportFound() {
    const [items, setItems] = useState<FoundItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [viewItem, setViewItem] = useState<FoundItem | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [hoveredBannerBtn, setHoveredBannerBtn] = useState(false);
    const [hoveredReportBtn, setHoveredReportBtn] = useState(false);
    const [hoveredHistoryBtn, setHoveredHistoryBtn] = useState(false);
    const [hoveredSubmit, setHoveredSubmit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userEmail = localStorage.getItem("userEmail") || "anonymous";

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/found/my?email=${encodeURIComponent(userEmail)}`);
            if (res.ok) setItems(await res.json());
        } catch (err) {
            console.error("Failed to fetch found items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const compressImage = (file: File, maxWidth = 600): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let w = img.width, h = img.height;
                    if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext("2d")!;
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL("image/jpeg", 0.7));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImagePreview(await compressImage(file));
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = async () => {
        if (!itemName.trim() || !location.trim()) return;
        try {
            const res = await fetch("http://localhost:8080/api/found/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemName, description, location, foundBy: userEmail,
                    category, tags: selectedTags.join(","),
                    imageUrl: imagePreview || "",
                }),
            });
            if (res.ok) {
                setItemName(""); setDescription(""); setLocation("");
                setCategory(""); setSelectedTags([]); setImagePreview(null);
                setShowModal(false); fetchItems();
            } else {
                alert("Error submitting found item ❌");
            }
        } catch {
            alert("Network error. Please try again.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this found item?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/found/${id}`, { method: "DELETE" });
            if (res.ok) fetchItems();
            else alert("Failed to delete item.");
        } catch {
            alert("Network error.");
        }
    };

    const filteredItems = items.filter(item =>
        (item.itemName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // All items are already the user's own
    const myItems = items;

    return (
        <DashboardLayout>
            <div style={s.page} className="found-page-anim">

                {/* Banner */}
                <div style={s.banner as any} className="found-banner">
                    <div style={s.bannerBlob as any} />
                    <div style={s.bannerContent as any} className="found-banner-content">
                        <h2 style={s.bannerTitle} className="found-banner-title">
                            Found Something on Campus?
                        </h2>
                        <p style={s.bannerDesc} className="found-banner-desc">
                            Report found items and help fellow students reunite with their belongings.
                            Together we can build a helpful campus community.
                        </p>
                        <button
                            style={{
                                ...s.bannerBtn,
                                ...(hoveredBannerBtn ? { transform: "translateY(-1px)", boxShadow: "0 4px 16px rgba(16,185,129,0.4)" } : {}),
                            }}
                            onClick={() => setShowModal(true)}
                            onMouseEnter={() => setHoveredBannerBtn(true)}
                            onMouseLeave={() => setHoveredBannerBtn(false)}
                            className="found-banner-btn"
                        >
                            Report Found Item <ArrowRight size={16} />
                        </button>
                    </div>
                    <div style={s.bannerVisual as any} className="found-banner-visual">
                        <div style={s.bannerGradient as any} />
                        <img
                            src="/found.png" alt="Found items" style={s.bannerImg as any}
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    </div>
                </div>

                {/* Title Row */}
                <div style={s.titleRow as any} className="found-title-row">
                    <div style={s.titleLeft as any}>
                        <h3 style={s.titleMain}>My Found Items</h3>
                        <p style={s.titleSub}>{filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} reported by you</p>
                    </div>
                    <div style={s.titleBtns as any}>
                        <button
                            style={{
                                ...s.historyBtn,
                                ...(hoveredHistoryBtn ? { background: "#f8fafc", borderColor: "#cbd5e1" } : {}),
                            }}
                            onClick={() => setShowHistoryModal(true)}
                            onMouseEnter={() => setHoveredHistoryBtn(true)}
                            onMouseLeave={() => setHoveredHistoryBtn(false)}
                        >
                            <History size={16} /> My Reports
                        </button>
                        <button
                            style={{
                                ...s.reportBtn,
                                ...(hoveredReportBtn ? { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(16,185,129,0.4)" } : {}),
                            }}
                            onClick={() => setShowModal(true)}
                            onMouseEnter={() => setHoveredReportBtn(true)}
                            onMouseLeave={() => setHoveredReportBtn(false)}
                        >
                            <Plus size={18} /> Report Found Item
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div style={s.searchWrap as any}>
                    <SearchIcon size={18} style={s.searchIcon as any} />
                    <input
                        type="text"
                        placeholder="Search found items..."
                        style={s.searchInput}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={s.empty as any}>
                        <div style={{ ...s.emptyIcon, animation: "pulse 1.5s infinite" }}><Clock size={28} /></div>
                        <p style={s.emptyTitle}>Loading items…</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div style={s.empty as any}>
                        <div style={s.emptyIcon}><AlertCircle size={28} /></div>
                        <p style={s.emptyTitle}>No found items reported yet</p>
                        <p style={s.emptyDesc}>
                            {searchQuery ? "Try adjusting your search." : "You haven't reported any found items yet. Click 'Report Found Item' to get started!"}
                        </p>
                    </div>
                ) : (
                    <div style={s.grid} className="found-cards-grid">
                        {filteredItems.map((item, index) => {
                            const theme = cardThemes[index % cardThemes.length];
                            const hovered = hoveredCard === item.id;
                            const itemTags = (item.tags || "").split(",").filter(Boolean);
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        ...s.card,
                                        ...(hovered ? { transform: "translateY(-4px)", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" } : {}),
                                    }}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div style={{ ...s.cardColorBar, background: theme.headerBg }} />
                                    <div style={s.cardImgSection as any}>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.itemName} style={s.cardImgActual} />
                                        ) : (
                                            <div style={s.cardImgPlaceholder}><ImageIcon size={36} /></div>
                                        )}
                                        {item.category && (
                                            <span style={{
                                                position: "absolute", top: 8, right: 8,
                                                padding: "3px 10px", borderRadius: 6,
                                                background: "rgba(255,255,255,0.92)",
                                                backdropFilter: "blur(4px)",
                                                fontFamily: "'Inter', sans-serif", fontSize: "0.63rem",
                                                fontWeight: 700, color: theme.accent,
                                                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                            }}>{item.category}</span>
                                        )}
                                        <span style={{
                                            position: "absolute", top: 8, left: 8,
                                            padding: "3px 10px", borderRadius: 6,
                                            background: (item.status || "pending") === "active"
                                                ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                                            fontFamily: "'Inter', sans-serif", fontSize: "0.62rem",
                                            fontWeight: 700,
                                            color: (item.status || "pending") === "active" ? "#059669" : "#d97706",
                                        }}>
                                            {(item.status || "pending") === "active" ? "✓ Approved" : "⏳ Pending"}
                                        </span>
                                    </div>
                                    <div style={s.cardBody as any}>
                                        <h4 style={s.cardItemName}>{item.itemName}</h4>
                                        <p style={s.cardDesc}>{item.description || "No description provided."}</p>
                                        {itemTags.length > 0 && (
                                            <div style={s.cardTags}>
                                                {itemTags.slice(0, 4).map(tag => (
                                                    <span key={tag} style={{ ...s.cardTag, background: theme.tagBg, color: theme.tagColor }}>{tag.trim()}</span>
                                                ))}
                                                {itemTags.length > 4 && (
                                                    <span style={{ ...s.cardTag, background: "#f1f5f9", color: "#64748b" }}>+{itemTags.length - 4}</span>
                                                )}
                                            </div>
                                        )}
                                        <div style={s.cardMeta as any}>
                                            <div style={s.cardMetaItem}>
                                                <MapPin size={12} style={{ color: theme.accent }} />
                                                <span>{item.location}</span>
                                            </div>
                                            <div style={s.cardMetaItem}>
                                                <User size={12} style={{ color: theme.accent }} />
                                                <span>{item.foundBy}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={s.cardActions}>
                                        <button
                                            style={s.cardBtn}
                                            onClick={() => setViewItem(item)}
                                            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                                        >
                                            <Eye size={13} /> View
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* View Detail Modal */}
            {viewItem && (
                <div style={s.overlay as any} onClick={() => setViewItem(null)}>
                    <div style={s.modal as any} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h3 style={s.modalTitle}>{viewItem.itemName}</h3>
                            <button style={s.modalClose} onClick={() => setViewItem(null)}
                                onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}
                            ><X size={18} /></button>
                        </div>
                        {viewItem.imageUrl && <img src={viewItem.imageUrl} alt={viewItem.itemName} style={s.detailImg} />}
                        <div style={s.detailRow}><span style={s.detailLabel}>Description</span><span>{viewItem.description || "—"}</span></div>
                        <div style={s.detailRow}><span style={s.detailLabel}>Category</span><span>{viewItem.category || "—"}</span></div>
                        <div style={s.detailRow}><span style={s.detailLabel}>Tags</span><span>{viewItem.tags ? viewItem.tags.split(",").join(", ") : "—"}</span></div>
                        <div style={s.detailRow}><span style={s.detailLabel}>Location</span><span>{viewItem.location}</span></div>
                        <div style={s.detailRow}><span style={s.detailLabel}>Found By</span><span>{viewItem.foundBy}</span></div>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {showHistoryModal && (
                <div style={s.overlay as any} onClick={() => setShowHistoryModal(false)}>
                    <div style={{ ...(s.modal as any), maxWidth: 600 }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h3 style={s.modalTitle}>My Found Reports</h3>
                            <button style={s.modalClose} onClick={() => setShowHistoryModal(false)}
                                onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}
                            ><X size={18} /></button>
                        </div>
                        {myItems.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "30px 0" }}>
                                <div style={{ ...s.emptyIcon, margin: "0 auto 12px" }}><CheckCircle size={26} /></div>
                                <p style={{ ...s.emptyTitle, fontSize: "0.95rem" }}>No items reported yet</p>
                                <p style={{ ...s.emptyDesc, fontSize: "0.78rem", marginTop: 4 }}>Items you report will appear here.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {myItems.map((item, i) => {
                                    const theme = cardThemes[i % cardThemes.length];
                                    return (
                                        <div key={item.id} style={{
                                            display: "flex", alignItems: "center", gap: 14,
                                            padding: "12px 14px", borderRadius: 10,
                                            border: "1px solid #e8ecf1", background: "#fff",
                                        }}>
                                            <div style={{
                                                width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                                                overflow: "hidden", background: "#f1f5f9",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                border: `2px solid ${theme.accent}20`,
                                            }}>
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <PackageOpen size={22} style={{ color: theme.accent }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h4 style={{
                                                    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
                                                    fontWeight: 650, color: "#0f172a", margin: 0,
                                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                }}>{item.itemName}</h4>
                                                <div style={{ display: "flex", gap: 12, marginTop: 3 }}>
                                                    {item.category && (
                                                        <span style={{
                                                            fontFamily: "'Inter', sans-serif", fontSize: "0.68rem",
                                                            color: theme.accent, fontWeight: 600,
                                                        }}>{item.category}</span>
                                                    )}
                                                    <span style={{
                                                        fontFamily: "'Inter', sans-serif", fontSize: "0.68rem",
                                                        color: "#94a3b8",
                                                    }}>📍 {item.location}</span>
                                                </div>
                                            </div>
                                            <button
                                                style={s.cardBtnDanger}
                                                onClick={() => handleDelete(item.id)}
                                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showModal && (
                <div style={s.overlay as any} onClick={() => setShowModal(false)}>
                    <div style={s.modal as any} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <h3 style={s.modalTitle}>Report Found Item</h3>
                            <button style={s.modalClose} onClick={() => setShowModal(false)}
                                onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}
                            ><X size={18} /></button>
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Item Name *</label>
                            <input style={s.formInput} placeholder="e.g. Blue water bottle" value={itemName}
                                onChange={e => setItemName(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Description</label>
                            <textarea style={s.formTextarea as any} placeholder="Describe the item in detail..."
                                value={description} onChange={e => setDescription(e.target.value)}
                                onFocus={focusStyle as any} onBlur={blurStyle as any} />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Where did you find it? *</label>
                            <input style={s.formInput} placeholder="e.g. Library 2nd floor" value={location}
                                onChange={e => setLocation(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Category</label>
                            <div style={s.selectWrap as any}>
                                <select style={s.formSelect} value={category}
                                    onChange={e => setCategory(e.target.value)} onFocus={focusStyle as any} onBlur={blurStyle as any}>
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={16} style={s.selectArrow as any} />
                            </div>
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Tags</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {tagOptions.map(tag => (
                                    <button key={tag} onClick={() => toggleTag(tag)} style={{
                                        padding: "4px 10px", borderRadius: 6,
                                        border: selectedTags.includes(tag) ? "1.5px solid #10b981" : "1.5px solid #e2e8f0",
                                        background: selectedTags.includes(tag) ? "#d1fae5" : "#fff",
                                        color: selectedTags.includes(tag) ? "#065f46" : "#64748b",
                                        fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
                                        fontWeight: 500, cursor: "pointer", transition: "all 0.15s ease",
                                    }}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.formLabel}>Photo</label>
                            {!imagePreview ? (
                                <div style={s.uploadArea as any} onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={24} style={{ color: "#10b981" }} />
                                    <p style={s.uploadTitle}>Upload item photo</p>
                                    <p style={s.uploadDesc}>Drag & drop or click to browse · JPG, PNG</p>
                                    <button style={s.uploadBtn} type="button">Choose File</button>
                                </div>
                            ) : (
                                <div style={s.uploadPreview as any}>
                                    <img src={imagePreview} alt="Preview" style={s.uploadPreviewImg} />
                                    <button style={s.uploadRemove as any} onClick={() => setImagePreview(null)}>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                                onChange={handleImageChange} />
                        </div>
                        <button
                            style={{
                                ...s.submitBtn,
                                ...(hoveredSubmit ? { transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(16,185,129,0.4)" } : {}),
                            }}
                            onClick={handleSubmit}
                            onMouseEnter={() => setHoveredSubmit(true)}
                            onMouseLeave={() => setHoveredSubmit(false)}
                        >
                            Submit Found Item
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .found-page-anim { animation: foundPageIn 0.4s ease; }
                @keyframes foundPageIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                @media (max-width: 1024px) {
                    .found-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 768px) {
                    .found-cards-grid { grid-template-columns: 1fr !important; }
                    .found-title-row { flex-direction: column !important; align-items: flex-start !important; }
                    .found-banner { flex-direction: column !important; height: auto !important; }
                    .found-banner-visual { display: none !important; }
                    .found-banner-content { padding: 24px 20px !important; }
                    .found-banner-title { font-size: 1.2rem !important; }
                }
                @media (max-width: 480px) {
                    .found-banner-title { font-size: 1.1rem !important; }
                }
            `}</style>
        </DashboardLayout>
    );
}

import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import {
    ArrowLeft,
    Search,
    PackageOpen,
    Zap,
    MapPin,
    Building2,
    Calendar,
    ChevronRight,
    Sparkles,
} from "lucide-react";

// ── Types ────────────────────────────────────

interface LostItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    category: string;
    imageUrl: string;
    type: "lost";
}

interface FoundItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    category: string;
    imageUrl: string;
    type: "found";
}

interface CampusResource {
    id: string;
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    type: "resource";
}

type UnifiedMatch = {
    title: string;
    description: string;
    location: string;
    image: string;
    type: "lost-match" | "resource" | "found-match";
    score?: number;
};

// ── Styles ───────────────────────────────────

const s: Record<string, CSSProperties> = {
    container: {
        maxWidth: 700,
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
    },
    backBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    title: {
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#1e293b",
        margin: 0,
    },
    searchSection: {
        position: "relative",
        marginBottom: 32,
    },
    searchIcon: {
        position: "absolute",
        left: 14,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
        pointerEvents: "none",
    },
    searchInput: {
        width: "100%",
        padding: "12px 16px 12px 42px",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "#f1f5f9",
        fontSize: "0.9rem",
        color: "#1e293b",
        outline: "none",
        transition: "all 0.2s ease",
    },
    sectionTitle: {
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 20,
    },
    matchList: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    matchCard: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        borderRadius: 20,
        background: "#fff",
        border: "1px solid #f1f5f9",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    matchInfo: {
        flex: 1,
        paddingRight: 20,
    },
    matchTitle: {
        fontSize: "0.95rem",
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 4,
        margin: 0,
    },
    matchDesc: {
        fontSize: "0.82rem",
        color: "#64748b",
        lineHeight: 1.4,
        margin: 0,
    },
    matchImg: {
        width: 100,
        height: 70,
        borderRadius: 16,
        objectFit: "cover",
        flexShrink: 0,
        backgroundColor: "#f1f5f9",
    },
    filterBar: {
        display: "flex",
        gap: 8,
        marginBottom: 24,
        overflowX: "auto",
        paddingBottom: 4,
    },
    filterBadge: {
        padding: "6px 14px",
        borderRadius: 10,
        fontSize: "0.78rem",
        fontWeight: 600,
        background: "#fff",
        border: "1px solid #e2e8f0",
        color: "#64748b",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
    },
    filterBadgeActive: {
        background: "#1e293b",
        color: "#fff",
        borderColor: "#1e293b",
    },
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

export default function MatchingAlgorithm() {
    const navigate = useNavigate();
    const [lostItems, setLostItems] = useState<LostItem[]>([]);
    const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
    const [query, setQuery] = useState("");
    const [activeZone, setActiveZone] = useState("All Zones");
    const [loading, setLoading] = useState(true);

    const zones = ["All Zones", "Library", "Cafeteria", "Main Building", "Sports Complex", "Auditorium", "AV Department"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lRes, fRes] = await Promise.all([
                    fetch("http://localhost:8080/api/lost/approved"),
                    fetch("http://localhost:8080/api/found/approved")
                ]);
                if (lRes.ok) setLostItems(await lRes.json());
                if (fRes.ok) setFoundItems(await fRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Mock Campus Resources to match the image precisely
    const campusResources: CampusResource[] = [
        {
            id: "res-1",
            title: "Study Room Booking",
            description: "Available study room in the main building",
            location: "Main Building",
            imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=300&h=200&auto=format&fit=crop",
            type: "resource"
        },
        {
            id: "res-2",
            title: "Projector Rental",
            description: "Projector available for rental in the AV department",
            location: "AV Department",
            imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed0963c?q=80&w=300&h=200&auto=format&fit=crop",
            type: "resource"
        }
    ];

    const generateMatches = (): UnifiedMatch[] => {
        let results: UnifiedMatch[] = [];

        // 1. Cross-match Lost and Found
        lostItems.forEach(lost => {
            foundItems.forEach(found => {
                let score = fuzzyScore(lost.itemName, found.itemName);
                score += fuzzyScore(lost.location, found.location) * 0.5;

                if (score > 30) {
                    results.push({
                        title: `Match: ${lost.itemName}`,
                        description: `Found near the ${found.location}, matches your reported lost item`,
                        location: found.location,
                        image: found.imageUrl || "",
                        type: "lost-match",
                        score
                    });
                }
            });
        });

        // 2. Add Found items as generic suggestions
        foundItems.forEach(found => {
            results.push({
                title: `Found ${found.itemName}`,
                description: `${found.itemName} found near the ${found.location}, contains unique identifying features`,
                location: found.location,
                image: found.imageUrl || "",
                type: "found-match",
                score: 10 // baseline
            });
        });

        // 3. Add Resources
        campusResources.forEach(res => {
            results.push({
                title: res.title,
                description: res.description,
                location: res.location,
                image: res.imageUrl,
                type: "resource",
                score: 5 // baseline
            });
        });

        // Filter based on query and zone
        return results
            .filter(r => {
                const matchesZone = activeZone === "All Zones" ||
                    r.location.toLowerCase().includes(activeZone.toLowerCase());
                const matchesQuery = !query ||
                    r.title.toLowerCase().includes(query.toLowerCase()) ||
                    r.description.toLowerCase().includes(query.toLowerCase());
                return matchesZone && matchesQuery;
            })
            .sort((a, b) => (b.score || 0) - (a.score || 0));
    };

    const sortedResults = generateMatches();

    return (
        <DashboardLayout>
            <div style={s.container} className="match-page-anim">
                {/* Header */}
                <div style={s.header}>
                    <button style={s.backBtn} onClick={() => navigate(-1)}>
                        <ArrowLeft size={22} />
                    </button>
                    <h1 style={s.title}>Matching Algorithm</h1>
                </div>

                {/* Search Bar */}
                <div style={s.searchSection}>
                    <Search size={18} style={s.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search for resources or items..."
                        style={s.searchInput}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Zone Filters */}
                <div style={s.filterBar}>
                    {zones.map(zone => (
                        <button
                            key={zone}
                            style={{
                                ...s.filterBadge,
                                ...(activeZone === zone ? s.filterBadgeActive : {})
                            }}
                            onClick={() => setActiveZone(zone)}
                        >
                            {zone}
                        </button>
                    ))}
                </div>

                {/* Suggested Matches */}
                <h2 style={s.sectionTitle}>Suggested Matches</h2>

                <div style={s.matchList}>
                    {loading ? (
                        <p style={{ textAlign: "center", color: "#64748b" }}>Analyzing campus data...</p>
                    ) : sortedResults.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#64748b" }}>No matches found for your current criteria.</p>
                    ) : (
                        sortedResults.map((item, idx) => (
                            <div
                                key={idx}
                                style={s.matchCard}
                                className="match-card-hover"
                                onClick={() => item.type !== "resource" && navigate("/lost-and-found")}
                            >
                                <div style={s.matchInfo}>
                                    <h3 style={s.matchTitle}>{item.title}</h3>
                                    <p style={s.matchDesc}>{item.description}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                                        <MapPin size={12} style={{ color: "#94a3b8" }} />
                                        <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500 }}>{item.location}</span>
                                    </div>
                                </div>
                                {item.image ? (
                                    <img src={item.image} alt={item.title} style={s.matchImg} />
                                ) : (
                                    <div style={{ ...s.matchImg, display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}>
                                        <PackageOpen size={24} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .match-page-anim {
                    animation: slideUp 0.4s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .match-card-hover:hover {
                    border-color: #cbd5e1 !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                    transform: translateY(-2px);
                }
                .match-card-hover:active {
                    transform: scale(0.98);
                }
            `}</style>
        </DashboardLayout>
    );
}

import React, { useState, useEffect, CSSProperties } from "react";
import DashboardLayout from "./DashboardLayout";
import {
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    X,
    History,
    CalendarCheck,
    Phone,
    Mail,
    Edit3,
    Trophy,
    Package,
    AlertCircle,
} from "lucide-react";

// ── Types ───────────────────────────────────

interface BookingData {
    id: number;
    resourceId: number;
    userEmail: string;
    ownerEmail: string;
    itemName: string;
    place: string;
    phone: string;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: string;
}

// ── Styles ──────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: { maxWidth: 1100, margin: "0 auto", padding: "20px" },

    /* Hero */
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
    heroTitle: {
        fontFamily: "'Inter', sans-serif", fontSize: "1.8rem", fontWeight: 800,
        color: "#f1f5f9", lineHeight: 1.2, letterSpacing: "-0.03em",
        margin: 0, marginBottom: 10,
    },
    heroDesc: {
        fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#94a3b8",
        lineHeight: 1.6, maxWidth: 500, margin: 0,
    },

    /* Cards */
    list: { display: "flex", flexDirection: "column", gap: 16 },
    card: {
        background: "#fff", borderRadius: 20, border: "1px solid #eef0f4",
        overflow: "hidden", transition: "all 0.3s ease",
    },
    cardInner: {
        display: "flex", alignItems: "stretch", gap: 0,
    },
    cardLeft: {
        width: 6, flexShrink: 0,
    },
    cardBody: {
        flex: 1, padding: "20px 24px", display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 16,
    },
    cardInfo: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 200 },
    cardTitle: { fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: 0 },
    cardMeta: {
        display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "#64748b",
    },
    cardActions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },

    statusBadge: {
        fontSize: "0.65rem", fontWeight: 700, padding: "5px 12px", borderRadius: 8,
        textTransform: "uppercase", letterSpacing: "0.04em",
    },
    actionBtn: {
        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
        borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff",
        fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600,
        color: "#475569", cursor: "pointer", transition: "all 0.2s ease",
    },
    successBtn: {
        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
        borderRadius: 10, border: "none",
        background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff",
        fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s ease",
    },
    cancelBtn: {
        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
        borderRadius: 10, border: "1.5px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)",
        fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600,
        color: "#dc2626", cursor: "pointer", transition: "all 0.2s ease",
    },

    /* Modal */
    overlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    },
    modal: {
        background: "#fff", borderRadius: 24, width: "100%", maxWidth: 480,
        padding: 32, boxShadow: "0 25px 60px rgba(0,0,0,0.18)", position: "relative",
    },
    modalClose: {
        position: "absolute", top: 20, right: 20, width: 36, height: 36,
        borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b",
    },
    label: {
        display: "block", fontSize: "0.78rem", fontWeight: 650, color: "#334155", marginBottom: 6,
    },
    input: {
        width: "100%", padding: "11px 14px", borderRadius: 12,
        border: "1.5px solid #e2e8f0", fontSize: "0.88rem",
        fontFamily: "'Inter', sans-serif", outline: "none",
        transition: "border-color 0.2s", boxSizing: "border-box",
    },
    empty: {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "60px 20px", gap: 14,
    },
    emptyIcon: {
        width: 72, height: 72, borderRadius: 18,
        background: "rgba(99,102,241,0.08)", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#6366f1",
    },
};

// ── Component ───────────────────────────────

export default function BookingPage() {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBooking, setEditBooking] = useState<BookingData | null>(null);
    const [editForm, setEditForm] = useState({ date: "", time: "", place: "", phone: "", email: "" });
    const [editSuccess, setEditSuccess] = useState(false);

    const userEmail = sessionStorage.getItem("userEmail") || "";

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        if (!userEmail) { setLoading(false); return; }
        try {
            const res = await fetch(`http://localhost:8080/api/bookings/user/${userEmail}`);
            const data = await res.json();
            setBookings(Array.isArray(data) ? data.sort((a: any, b: any) =>
                new Date(b.createdAt || b.startTime).getTime() - new Date(a.createdAt || a.startTime).getTime()
            ) : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const openEdit = (b: BookingData) => {
        const dt = b.startTime ? new Date(b.startTime) : new Date();
        setEditForm({
            date: dt.toISOString().split("T")[0],
            time: dt.toTimeString().slice(0, 5),
            place: b.place || "",
            phone: b.phone || "",
            email: b.userEmail || "",
        });
        setEditBooking(b);
        setEditSuccess(false);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editBooking) return;
        try {
            const res = await fetch(`http://localhost:8080/api/bookings/${editBooking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startTime: `${editForm.date}T${editForm.time}:00`,
                    endTime: `${editForm.date}T${editForm.time}:00`,
                    place: editForm.place,
                    phone: editForm.phone,
                    userEmail: editForm.email,
                }),
            });
            if (res.ok) {
                setEditSuccess(true);
                fetchBookings();
                setTimeout(() => { setEditBooking(null); setEditSuccess(false); }, 2000);
            }
        } catch (e) { console.error(e); alert("Failed to update."); }
    };

    const markSuccessful = async (id: number) => {
        try {
            await fetch(`http://localhost:8080/api/bookings/${id}/complete`, { method: "PUT" });
            fetchBookings();
        } catch (e) { console.error(e); }
    };

    const cancelBooking = async (id: number) => {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await fetch(`http://localhost:8080/api/bookings/${id}`, { method: "DELETE" });
            fetchBookings();
        } catch (e) { console.error(e); }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "confirmed":
                return { background: "#dbeafe", color: "#1e40af" };
            case "completed":
                return { background: "#dcfce7", color: "#166534" };
            default:
                return { background: "#f1f5f9", color: "#64748b" };
        }
    };

    const getBarColor = (status: string) => {
        switch (status) {
            case "confirmed": return "linear-gradient(to bottom, #3b82f6, #6366f1)";
            case "completed": return "linear-gradient(to bottom, #10b981, #059669)";
            default: return "#e2e8f0";
        }
    };

    const confirmed = bookings.filter(b => b.status === "confirmed");
    const completed = bookings.filter(b => b.status === "completed");

    return (
        <DashboardLayout>
            <div style={s.page} className="bp-anim">

                {/* Hero */}
                <div style={s.hero as any}>
                    <div style={s.heroGlow1 as any} />
                    <div style={s.heroGlow2 as any} />
                    <div style={s.heroContent as any}>
                        <h1 style={s.heroTitle}>My Bookings</h1>
                        <p style={s.heroDesc}>
                            Manage all your meet-up bookings for lost & found items. Edit details or mark successful handovers.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 180, background: "#fff", borderRadius: 16, padding: "18px 22px", border: "1px solid #eef0f4", display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                            <CalendarCheck size={22} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>{confirmed.length}</p>
                            <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>Active Bookings</p>
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 180, background: "#fff", borderRadius: 16, padding: "18px 22px", border: "1px solid #eef0f4", display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                            <Trophy size={22} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>{completed.length}</p>
                            <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>Completed</p>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div style={s.empty as any}>
                        <div style={{ ...s.emptyIcon, animation: "pulse 1.5s infinite" }}><Clock size={28} /></div>
                        <p style={{ color: "#64748b" }}>Loading bookings…</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div style={s.empty as any}>
                        <div style={s.emptyIcon as any}><Package size={32} /></div>
                        <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>No bookings yet</p>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, textAlign: "center" }}>
                            When you book a meet-up from the Lost & Found page, it will appear here.
                        </p>
                    </div>
                ) : (
                    <div style={s.list as any}>
                        {bookings.map(b => (
                            <div key={b.id} style={s.card} className="booking-card">
                                <div style={s.cardInner as any}>
                                    <div style={{ ...s.cardLeft, background: getBarColor(b.status) }} />
                                    <div style={s.cardBody as any}>
                                        <div style={s.cardInfo as any}>
                                            <h4 style={s.cardTitle}>{b.itemName || "Booking"}</h4>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                                                <span style={s.cardMeta}>
                                                    <Calendar size={13} />
                                                    {b.startTime ? new Date(b.startTime).toLocaleDateString() : "—"}
                                                </span>
                                                <span style={s.cardMeta}>
                                                    <Clock size={13} />
                                                    {b.startTime ? new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                                                </span>
                                                <span style={s.cardMeta}>
                                                    <MapPin size={13} />
                                                    {b.place || "—"}
                                                </span>
                                                <span style={s.cardMeta}>
                                                    <Phone size={13} />
                                                    {b.phone || "—"}
                                                </span>
                                                <span style={s.cardMeta}>
                                                    <Mail size={13} />
                                                    {b.userEmail === userEmail ? `To: ${b.ownerEmail}` : `From: ${b.userEmail}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={s.cardActions as any}>
                                            {b.ownerEmail === userEmail && b.status === "confirmed" && (
                                                <span style={{ fontSize: "0.72rem", color: "#3b82f6", fontWeight: 700, background: "rgba(59,130,246,0.1)", padding: "4px 8px", borderRadius: 6 }}>
                                                    Incoming Request
                                                </span>
                                            )}
                                            <span style={{ ...s.statusBadge, ...getStatusStyle(b.status) }}>
                                                {b.status}
                                            </span>
                                            {b.status === "confirmed" && (
                                                <>
                                                    {b.userEmail === userEmail && (
                                                        <button
                                                            style={s.actionBtn}
                                                            onClick={() => openEdit(b)}
                                                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#4f46e5"; }}
                                                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
                                                        >
                                                            <Edit3 size={14} /> Edit
                                                        </button>
                                                    )}
                                                    <button
                                                        style={s.successBtn}
                                                        onClick={() => markSuccessful(b.id)}
                                                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                                                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                                    >
                                                        <Trophy size={14} /> Successful
                                                    </button>
                                                    <button
                                                        style={s.cancelBtn}
                                                        onClick={() => cancelBooking(b.id)}
                                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
                                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                </>
                                            )}
                                            {b.status === "completed" && (
                                                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "#059669" }}>
                                                    <CheckCircle2 size={14} /> Handover Done
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {editBooking && (
                    <div style={s.overlay as any} onClick={() => !editSuccess && setEditBooking(null)}>
                        <div style={s.modal as any} onClick={e => e.stopPropagation()}>
                            <button style={s.modalClose as any} onClick={() => setEditBooking(null)}>
                                <X size={18} />
                            </button>

                            {editSuccess ? (
                                <div style={{ textAlign: "center", padding: "24px 0" }}>
                                    <div style={{
                                        width: 72, height: 72, borderRadius: "50%",
                                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                        color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center",
                                        margin: "0 auto 20px",
                                    }}>
                                        <CheckCircle2 size={36} />
                                    </div>
                                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                                        Booking Updated!
                                    </h3>
                                    <p style={{ fontSize: "0.9rem", color: "#64748b" }}>Your changes have been saved.</p>
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
                                            <Edit3 size={22} />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Edit Booking</h2>
                                            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>{editBooking.itemName}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        <div style={{ display: "flex", gap: 12 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={s.label}>
                                                    <Calendar size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Date
                                                </label>
                                                <input type="date" required style={s.input as any}
                                                    value={editForm.date}
                                                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                                    onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                                    onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={s.label}>
                                                    <Clock size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Time
                                                </label>
                                                <input type="time" required style={s.input as any}
                                                    value={editForm.time}
                                                    onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                                                    onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                                    onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={s.label}>
                                                <MapPin size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Place
                                            </label>
                                            <input type="text" required style={s.input as any}
                                                value={editForm.place}
                                                onChange={e => setEditForm({ ...editForm, place: e.target.value })}
                                                onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                            />
                                        </div>
                                        <div>
                                            <label style={s.label}>
                                                <Phone size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Phone
                                            </label>
                                            <input type="tel" required style={s.input as any}
                                                value={editForm.phone}
                                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                            />
                                        </div>
                                        <div>
                                            <label style={s.label}>
                                                <Mail size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Email
                                            </label>
                                            <input type="email" required style={s.input as any}
                                                value={editForm.email}
                                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                            />
                                        </div>

                                        <button type="submit" style={{
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
                                            <CheckCircle2 size={18} /> Save Changes
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <style>{`
                    .bp-anim { animation: bpIn 0.4s ease; }
                    @keyframes bpIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                    .booking-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.06); }
                `}</style>
            </div>
        </DashboardLayout>
    );
}

import React, { useState, useEffect, useRef, CSSProperties } from "react";
import AdminLayout from "./AdminLayout";
import {
    MessageCircle,
    Send,
    Search,
    ArrowLeft,
    ShieldCheck,
    Check,
    CheckCheck,
    Smile,
    Headphones,
} from "lucide-react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

const API = "http://localhost:8080/api/chat";

// ── Types ────────────────────────────────────

interface ChatRoom {
    id: number;
    roomId: string;
    participantOne: string;
    participantTwo: string;
    roomType: string;
    lastMessage: string | null;
    lastMessageAt: string | null;
    unreadCountOne: number;
    unreadCountTwo: number;
}

interface Message {
    id: number;
    roomId: string;
    senderEmail: string;
    senderName: string;
    content: string;
    messageType: string;
    sentAt: string;
    read: boolean;
}

// ── Styles ───────────────────────────────────

const s: Record<string, CSSProperties> = {
    page: {
        display: "flex",
        height: "calc(100vh - 100px)",
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
    },
    leftPanel: {
        width: 360,
        minWidth: 360,
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        background: "#fafbfc",
    },
    leftHeader: {
        padding: "20px 20px 14px",
        borderBottom: "1px solid #f1f5f9",
    },
    leftTitle: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "1.2rem",
        fontWeight: 700,
        color: "#0f172a",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    leftSubtitle: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.75rem",
        color: "#94a3b8",
        marginTop: 6,
        fontWeight: 500,
    },
    searchWrap: {
        marginTop: 12,
        position: "relative",
    },
    searchInput: {
        width: "100%",
        padding: "9px 12px 9px 36px",
        borderRadius: 10,
        border: "1.5px solid #e2e8f0",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.82rem",
        outline: "none",
        background: "#fff",
        color: "#334155",
    },
    searchIcon: {
        position: "absolute",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
    },
    convList: {
        flex: 1,
        overflowY: "auto",
        padding: "8px 8px",
    },
    convItem: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginBottom: 2,
        position: "relative",
    },
    convAvatar: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.78rem",
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
    },
    convInfo: {
        flex: 1,
        overflow: "hidden",
    },
    convName: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        fontWeight: 600,
        color: "#1e293b",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    convEmail: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.68rem",
        color: "#94a3b8",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    convLast: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.75rem",
        color: "#94a3b8",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: 2,
    },
    convTime: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.65rem",
        color: "#94a3b8",
        whiteSpace: "nowrap",
    },
    convBadge: {
        background: "#6366f1",
        color: "#fff",
        fontSize: "0.62rem",
        fontWeight: 700,
        borderRadius: "50%",
        width: 20,
        height: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    rightPanel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
    },
    chatHeader: {
        padding: "16px 24px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#fff",
    },
    chatHeaderAvatar: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.72rem",
        fontWeight: 700,
        color: "#fff",
    },
    chatHeaderInfo: { flex: 1 },
    chatHeaderName: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 650,
        color: "#0f172a",
    },
    chatHeaderEmail: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem",
        color: "#94a3b8",
        fontWeight: 500,
    },
    messagesArea: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)",
    },
    msgRow: { display: "flex", marginBottom: 4 },
    msgBubble: {
        maxWidth: "70%",
        padding: "10px 16px",
        borderRadius: 16,
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem",
        lineHeight: 1.5,
        wordBreak: "break-word",
    },
    msgSent: {
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff",
        borderBottomRightRadius: 4,
        marginLeft: "auto",
    },
    msgReceived: {
        background: "#f1f5f9",
        color: "#1e293b",
        borderBottomLeftRadius: 4,
    },
    msgTime: { fontSize: "0.62rem", marginTop: 4, opacity: 0.7 },
    inputArea: {
        padding: "14px 20px",
        borderTop: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#fff",
    },
    textInput: {
        flex: 1,
        padding: "12px 18px",
        borderRadius: 14,
        border: "1.5px solid #e2e8f0",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        outline: "none",
        background: "#fafbfc",
        color: "#334155",
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "none",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    emptyState: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "#94a3b8",
    },
    dateDivider: { textAlign: "center", padding: "8px 0" },
    dateDividerLabel: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.68rem",
        color: "#94a3b8",
        background: "#f1f5f9",
        padding: "4px 14px",
        borderRadius: 20,
    },
    backBtn: { background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4, borderRadius: 8, display: "none" },
};

// ── Helpers ──────────────────────────────────

function getInitials(email: string): string {
    const name = email.split("@")[0];
    return name.split(/[._-]/).map((seg) => seg[0]?.toUpperCase()).join("").slice(0, 2);
}

function getAvatarColor(email: string): string {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];
    let hash = 0;
    for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatMsgTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function groupByDate(messages: Message[]): { date: string; msgs: Message[] }[] {
    const groups: { date: string; msgs: Message[] }[] = [];
    let currentDate = "";
    for (const msg of messages) {
        const d = new Date(msg.sentAt).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
        if (d !== currentDate) {
            currentDate = d;
            groups.push({ date: d, msgs: [] });
        }
        groups[groups.length - 1].msgs.push(msg);
    }
    return groups;
}

// ── Component ────────────────────────────────

export default function AdminChat() {
    const adminEmail = localStorage.getItem("adminEmail") || "";
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileShowChat, setMobileShowChat] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const stompRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<any>(null);

    useEffect(() => {
        fetch(`${API}/rooms/admin`)
            .then((r) => r.json())
            .then(setRooms)
            .catch(console.error);
    }, []);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            onConnect: () => console.log("✅ Admin WebSocket connected"),
        });
        client.activate();
        stompRef.current = client;
        return () => { client.deactivate(); };
    }, []);

    useEffect(() => {
        if (!activeRoom || !stompRef.current?.connected) return;
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

        subscriptionRef.current = stompRef.current.subscribe(`/topic/room.${activeRoom.roomId}`, (msg: IMessage) => {
            const newMsg: Message = JSON.parse(msg.body);
            setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
        });

        fetch(`${API}/read`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId: activeRoom.roomId, email: adminEmail }),
        }).catch(console.error);

        return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
    }, [activeRoom, adminEmail]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const selectRoom = async (room: ChatRoom) => {
        setActiveRoom(room);
        setMobileShowChat(true);
        try {
            const res = await fetch(`${API}/messages/${room.roomId}`);
            const msgs: Message[] = await res.json();
            setMessages(msgs);
        } catch (e) { console.error(e); }
    };

    const sendMessage = () => {
        if (!input.trim() || !activeRoom || !stompRef.current?.connected) return;
        stompRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify({
                roomId: activeRoom.roomId,
                senderEmail: adminEmail,
                senderName: "Admin",
                content: input.trim(),
            }),
        });
        setInput("");
        setRooms((prev) => prev.map((r) => r.roomId === activeRoom.roomId ? { ...r, lastMessage: input.trim(), lastMessageAt: new Date().toISOString() } : r));
    };

    const getUserEmail = (room: ChatRoom): string => {
        // Since these are support rooms, the user is whoever is NOT the admin email we have record for.
        // Actually, it is safer to check against common admin prefixes or the one in the room.
        // In USER_ADMIN rooms, participantTwo is usually the admin.
        return room.roomType === "USER_ADMIN" ? room.participantOne :
            room.participantOne === adminEmail ? room.participantTwo : room.participantOne;
    };

    const getUnread = (room: ChatRoom): number => {
        return room.participantOne === adminEmail ? room.unreadCountOne : room.unreadCountTwo;
    };

    const filteredRooms = rooms.filter((room) => {
        const user = getUserEmail(room);
        return user.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const grouped = groupByDate(messages);

    return (
        <AdminLayout>
            <div style={s.page}>
                <div style={s.leftPanel} className={mobileShowChat ? "admin-chat-left-hide" : ""}>
                    <div style={s.leftHeader}>
                        <h2 style={s.leftTitle}><Headphones size={22} color="#6366f1" /> Support Chat</h2>
                        <p style={s.leftSubtitle}>{rooms.length} active tickets</p>
                        <div style={s.searchWrap as any}>
                            <Search size={16} style={s.searchIcon as any} />
                            <input style={s.searchInput} placeholder="Search user..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div style={s.convList}>
                        {filteredRooms.map((room) => {
                            const userEmail = getUserEmail(room);
                            const unread = getUnread(room);
                            const isActive = activeRoom?.roomId === room.roomId;
                            return (
                                <div key={room.roomId} style={{ ...s.convItem, background: isActive ? "#f5f3ff" : "transparent" }} onClick={() => selectRoom(room)}>
                                    <div style={{ ...s.convAvatar, background: getAvatarColor(userEmail) }}>{getInitials(userEmail)}</div>
                                    <div style={s.convInfo}>
                                        <div style={s.convName}>{userEmail.split("@")[0]}</div>
                                        <div style={s.convEmail}>{userEmail}</div>
                                        <div style={{ ...s.convLast, fontWeight: unread > 0 ? 600 : 400 }}>{room.lastMessage || "No messages"}</div>
                                    </div>
                                    {unread > 0 && <div style={s.convBadge}>{unread}</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={s.rightPanel} className={mobileShowChat ? "admin-chat-right-show" : ""}>
                    {activeRoom ? (
                        <>
                            <div style={s.chatHeader}>
                                <button style={s.backBtn} onClick={() => setMobileShowChat(false)}><ArrowLeft size={20} /></button>
                                <div style={{ ...s.chatHeaderAvatar, background: getAvatarColor(getUserEmail(activeRoom)) }}>
                                    {getInitials(getUserEmail(activeRoom))}
                                </div>
                                <div style={s.chatHeaderInfo}>
                                    <div style={s.chatHeaderName}>{getUserEmail(activeRoom).split("@")[0]}</div>
                                    <div style={s.chatHeaderEmail}>{getUserEmail(activeRoom)}</div>
                                </div>
                            </div>
                            <div style={s.messagesArea as any}>
                                {grouped.map((group, gi) => (
                                    <React.Fragment key={gi}>
                                        <div style={s.dateDivider as any}><span style={s.dateDividerLabel}>{group.date}</span></div>
                                        {group.msgs.map((msg) => (
                                            <div key={msg.id} style={{ ...s.msgRow, justifyContent: msg.senderEmail === adminEmail ? "flex-end" : "flex-start" }}>
                                                <div style={{ ...s.msgBubble, ...(msg.senderEmail === adminEmail ? s.msgSent : s.msgReceived) } as any}>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 700, marginBottom: 2, opacity: 0.8 }}>
                                                        {msg.senderEmail === adminEmail ? "Support (You)" : msg.senderName}
                                                    </div>
                                                    <div>{msg.content}</div>
                                                    <div style={s.msgTime}>{formatMsgTime(msg.sentAt)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div style={s.inputArea}>
                                <input style={s.textInput} placeholder="Reply..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                                <button style={s.sendBtn} onClick={sendMessage}><Send size={19} /></button>
                            </div>
                        </>
                    ) : (
                        <div style={s.emptyState as any}>
                            <Headphones size={48} color="#cbd5e1" />
                            <div style={s.emptyTitle}>Select a ticket</div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @media (max-width: 700px) {
                    .admin-chat-left-hide { display: none !important; }
                    .admin-chat-right-show { display: flex !important; }
                }
            `}</style>
        </AdminLayout>
    );
}

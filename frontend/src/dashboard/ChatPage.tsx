import React, { useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import {
    MessageCircle,
    Send,
    Search,
    Plus,
    ArrowLeft,
    ShieldCheck,
    Smile,
    Check,
    CheckCheck,
    X,
    User as UserIcon,
    AlertTriangle,
    Flag,
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
        width: 340,
        minWidth: 340,
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
        border: "1px solid transparent",
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
        textTransform: "capitalize" as const,
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
        flexShrink: 0,
    },
    convBadge: {
        background: "#3b82f6",
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
        textTransform: "capitalize" as const,
    },
    chatHeaderStatus: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem",
        color: "#22c55e",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 4,
    },
    messagesArea: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
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
        position: "relative",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    msgSent: {
        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "#fff",
        borderBottomRightRadius: 4,
        marginLeft: "auto",
    },
    msgReceived: {
        background: "#f1f5f9",
        color: "#1e293b",
        borderBottomLeftRadius: 4,
    },
    msgSenderName: {
        fontSize: "0.65rem",
        fontWeight: 700,
        marginBottom: 2,
        opacity: 0.8,
        textTransform: "capitalize" as any,
    },
    msgTime: {
        fontSize: "0.62rem",
        marginTop: 4,
        opacity: 0.7,
        textAlign: "right" as any,
    },
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
        transition: "all 0.2s",
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "none",
        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "opacity 0.2s",
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
    dateDivider: { textAlign: "center", padding: "12px 0" },
    dateDividerLabel: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.68rem",
        color: "#94a3b8",
        background: "#f1f5f9",
        padding: "4px 14px",
        borderRadius: 20,
        fontWeight: 600,
    },
    backBtn: { background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4, borderRadius: 8 },
    adminBtnWrap: {
        padding: "16px",
        borderTop: "1px solid #f1f5f9",
        background: "#fff",
    },
    adminBtn: {
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
    },
    reportOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)"
    },
    reportModal: {
        background: "#fff",
        padding: "24px",
        borderRadius: 20,
        width: "90%",
        maxWidth: 400,
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        fontFamily: "'Inter', sans-serif"
    },
    reportBtn: {
        position: "absolute",
        top: -10,
        right: -10,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "50%",
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        zIndex: 10,
        opacity: 0, // Hidden until hover
    }
};

// ── Helpers ──────────────────────────────────

function getInitials(email: string): string {
    if (!email) return "??";
    const name = email.split("@")[0];
    return name.split(/[._-]/).map((seg) => seg[0]?.toUpperCase()).join("").slice(0, 2);
}

function getAvatarColor(email: string): string {
    if (!email) return "#cbd5e1";
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

function getOtherParticipant(room: ChatRoom, myEmail: string): string {
    return room.participantOne === myEmail ? room.participantTwo : room.participantOne;
}

function getUnreadCount(room: ChatRoom, myEmail: string): number {
    return room.participantOne === myEmail ? room.unreadCountOne : room.unreadCountTwo;
}

// ── Component ────────────────────────────────

export default function ChatPage() {
    // We lock the email for this tab to prevent "shifting" if user logs into another account in another tab
    const initialEmail = useRef(localStorage.getItem("userEmail") || "");
    const myEmail = initialEmail.current;

    const location = useLocation();
    const state = location.state as { targetEmail?: string };

    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileShowChat, setMobileShowChat] = useState(false);

    // Reporting state
    const [reportingMessage, setReportingMessage] = useState<Message | null>(null);
    const [reportReason, setReportReason] = useState("");
    const [reportDetail, setReportDetail] = useState("");
    const [reportSuccess, setReportSuccess] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const stompRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<any>(null);

    // Load rooms
    const fetchRooms = useCallback(() => {
        if (!myEmail) return;
        fetch(`${API}/rooms?email=${encodeURIComponent(myEmail)}`)
            .then((r) => r.json())
            .then(setRooms)
            .catch(console.error);
    }, [myEmail]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // WebSocket connection
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                email: myEmail
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("✅ WebSocket connected");
                client.subscribe("/topic/status", (msg: IMessage) => {
                    const status = JSON.parse(msg.body);
                    // Update rooms or active chat status
                    setRooms(prev => prev.map(room => {
                        const other = room.participantOne === myEmail ? room.participantTwo : room.participantOne;
                        if (other === status.email) {
                            // We can't easily store status in Room object without backend changes, 
                            // so we'll just force a refresh or handle it in the UI logic if we had status in Room
                        }
                        return room;
                    }));
                });
            },
        });
        client.activate();
        stompRef.current = client;
        return () => { client.deactivate(); };
    }, [myEmail]);

    // Active room participant status
    const [otherUserStatus, setOtherUserStatus] = useState<{ online: boolean; lastSeen: string | null }>({ online: false, lastSeen: null });

    useEffect(() => {
        if (!activeRoom) return;
        const other = getOtherParticipant(activeRoom, myEmail);
        if (!other) return;

        fetch(`http://localhost:8080/api/profile/${other}`)
            .then(r => r.json())
            .then(data => setOtherUserStatus({ online: data.online, lastSeen: data.lastSeen }))
            .catch(console.error);

    }, [activeRoom, myEmail]);

    // Active room subscription
    useEffect(() => {
        if (!activeRoom || !stompRef.current?.connected) return;
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

        subscriptionRef.current = stompRef.current.subscribe(`/topic/room.${activeRoom.roomId}`, (msg: IMessage) => {
            const newMsg: Message = JSON.parse(msg.body);
            setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
            setRooms(prev => prev.map(r => r.roomId === newMsg.roomId ? { ...r, lastMessage: newMsg.content, lastMessageAt: newMsg.sentAt } : r));
        });

        const statusSub = stompRef.current.subscribe("/topic/status", (msg: IMessage) => {
            const status = JSON.parse(msg.body);
            const other = getOtherParticipant(activeRoom, myEmail);
            if (status.email === other) {
                setOtherUserStatus({ online: status.online, lastSeen: status.lastSeen });
            }
        });

        fetch(`${API}/read`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId: activeRoom.roomId, email: myEmail }),
        }).catch(console.error);

        return () => {
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
            statusSub.unsubscribe();
        };
    }, [activeRoom, myEmail]);

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

    const startChat = useCallback(async (targetEmail: string, roomType: string = "USER_USER") => {
        if (!targetEmail || !targetEmail.trim() || targetEmail.toLowerCase() === myEmail.toLowerCase()) {
            return;
        }
        try {
            const res = await fetch(`${API}/room`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participantOne: myEmail, participantTwo: targetEmail, roomType }),
            });
            const room: ChatRoom = await res.json();
            setRooms((prev) => prev.some((r) => r.roomId === room.roomId) ? prev : [room, ...prev]);
            setActiveRoom(room);
            setMobileShowChat(true);

            const mRes = await fetch(`${API}/messages/${room.roomId}`);
            const msgs: Message[] = await mRes.json();
            setMessages(msgs);
        } catch (e) { console.error(e); }
    }, [myEmail]);

    // Handle incoming chat requests from Lost & Found
    useEffect(() => {
        if (state?.targetEmail) {
            startChat(state.targetEmail);
        }
    }, [state, startChat]);

    const sendMessage = () => {
        if (!input.trim() || !activeRoom || !stompRef.current?.connected) return;
        stompRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify({
                roomId: activeRoom.roomId,
                senderEmail: myEmail,
                senderName: myEmail.split("@")[0],
                content: input.trim(),
            }),
        });
        setInput("");
    };

    const submitReport = async () => {
        if (!reportingMessage || !reportReason) return;
        try {
            await fetch("http://localhost:8080/api/chat/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId: reportingMessage.id,
                    reporterEmail: myEmail,
                    reason: reportReason,
                    detail: reportDetail
                })
            });
            setReportSuccess(true);
            setTimeout(() => {
                setReportingMessage(null);
                setReportReason("");
                setReportDetail("");
                setReportSuccess(false);
            }, 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const filteredRooms = rooms.filter((room) => {
        const other = getOtherParticipant(room, myEmail) || "";
        return other.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const grouped = groupByDate(messages);

    return (
        <DashboardLayout>
            <div style={s.page}>
                <div style={s.leftPanel} className={mobileShowChat ? "chat-left-hide-mobile" : ""}>
                    <div style={s.leftHeader}>
                        <h2 style={s.leftTitle}><MessageCircle size={22} color="#3b82f6" /> Messages</h2>
                        <div style={s.searchWrap as any}>
                            <Search size={16} style={s.searchIcon as any} />
                            <input
                                style={s.searchInput}
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={s.convList}>
                        {filteredRooms.length === 0 && (
                            <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                                <p style={{ fontSize: "0.82rem" }}>No messages yet.</p>
                            </div>
                        )}
                        {filteredRooms.map((room) => {
                            const other = getOtherParticipant(room, myEmail);
                            const unread = getUnreadCount(room, myEmail);
                            const isActive = activeRoom?.roomId === room.roomId;
                            return (
                                <div
                                    key={room.roomId}
                                    style={{
                                        ...s.convItem,
                                        background: isActive ? "#eff6ff" : "transparent",
                                        borderColor: isActive ? "#bfdbfe" : "transparent",
                                    }}
                                    onClick={() => selectRoom(room)}
                                >
                                    <div style={{ ...s.convAvatar, background: room.roomType === "USER_ADMIN" ? "#f59e0b" : getAvatarColor(other), position: "relative" }}>
                                        {room.roomType === "USER_ADMIN" ? <ShieldCheck size={20} /> : getInitials(other)}
                                    </div>
                                    <div style={s.convInfo}>
                                        <div style={s.convName}>{room.roomType === "USER_ADMIN" ? "Admin Support" : (other ? other.split("@")[0] : "User")}</div>
                                        <div style={{ ...s.convLast, color: unread > 0 ? "#1e293b" : "#94a3b8", fontWeight: unread > 0 ? 600 : 400 }}>
                                            {room.lastMessage || "Start a conversation..."}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                                        {room.lastMessageAt && <span style={s.convTime}>{formatTime(room.lastMessageAt)}</span>}
                                        {unread > 0 && <div style={s.convBadge}>{unread}</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={s.adminBtnWrap}>
                        <button
                            style={s.adminBtn}
                            className="admin-support-btn"
                            onClick={() => startChat("admin@campustrack.com", "USER_ADMIN")}
                        >
                            <ShieldCheck size={18} />
                            Contact Admin Support
                        </button>
                    </div>
                </div>

                <div style={s.rightPanel} className={mobileShowChat ? "chat-right-show-mobile" : ""}>
                    {activeRoom ? (
                        <>
                            <div style={s.chatHeader}>
                                <button style={{ ...s.backBtn, display: "flex" }} onClick={() => setMobileShowChat(false)} className="back-btn-mobile"><ArrowLeft size={20} /></button>
                                <div style={{ ...s.chatHeaderAvatar, background: activeRoom.roomType === "USER_ADMIN" ? "#f59e0b" : getAvatarColor(getOtherParticipant(activeRoom, myEmail)) }}>
                                    {activeRoom.roomType === "USER_ADMIN" ? <ShieldCheck size={18} /> : getInitials(getOtherParticipant(activeRoom, myEmail))}
                                </div>
                                <div style={s.chatHeaderInfo}>
                                    <div style={s.chatHeaderName}>
                                        {activeRoom.roomType === "USER_ADMIN" ? "Admin Support" : (getOtherParticipant(activeRoom, myEmail) || "User").split("@")[0]}
                                    </div>
                                    <div style={s.chatHeaderStatus}>
                                        <span style={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: "50%",
                                            background: otherUserStatus.online ? "#22c55e" : "#94a3b8"
                                        }} />
                                        {otherUserStatus.online ? "Online" : (otherUserStatus.lastSeen ? `Last seen ${formatTime(otherUserStatus.lastSeen)}` : "Offline")}
                                    </div>
                                </div>
                            </div>
                            <div style={s.messagesArea as any}>
                                {grouped.map((group, gi) => (
                                    <React.Fragment key={gi}>
                                        <div style={s.dateDivider as any}><span style={s.dateDividerLabel}>{group.date}</span></div>
                                        {group.msgs.map((msg) => {
                                            const isMe = msg.senderEmail.toLowerCase() === myEmail.toLowerCase();
                                            return (
                                                <div key={msg.id} style={{ ...s.msgRow, justifyContent: isMe ? "flex-end" : "flex-start" }}>
                                                    <div className="msg-bubble-wrap" style={{ ...s.msgBubble, ...(isMe ? s.msgSent : s.msgReceived), position: "relative" } as any}>
                                                        {!isMe && (
                                                            <button
                                                                className="report-flag-btn"
                                                                style={s.reportBtn as any}
                                                                onClick={() => setReportingMessage(msg)}
                                                            >
                                                                <Flag size={14} />
                                                            </button>
                                                        )}
                                                        {!isMe && <div style={{ ...s.msgSenderName, color: "#6366f1" }}>{msg.senderName}</div>}
                                                        {isMe && <div style={{ ...s.msgSenderName, color: "rgba(255,255,255,0.8)", textAlign: "right" }}>You</div>}
                                                        <div>{msg.content}</div>
                                                        <div style={{ ...s.msgTime, color: isMe ? "rgba(255,255,255,0.7)" : "#94a3b8" }}>
                                                            {formatMsgTime(msg.sentAt)}
                                                            {isMe && (msg.read ? <CheckCheck size={12} style={{ marginLeft: 4, display: "inline" }} /> : <Check size={12} style={{ marginLeft: 4, display: "inline" }} />)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div style={s.inputArea}>
                                <button style={{ background: "none", border: "none", color: "#94a3b8" }}><Smile size={22} /></button>
                                <input
                                    style={s.textInput}
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                                />
                                <button
                                    style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.5 }}
                                    onClick={sendMessage}
                                    disabled={!input.trim()}
                                ><Send size={19} /></button>
                            </div>
                        </>
                    ) : (
                        <div style={s.emptyState as any}>
                            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                <MessageCircle size={48} color="#cbd5e1" />
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#475569" }}>Your Messages</div>
                            <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", maxWidth: 280 }}>Select a chat from the left or connect with a user from the Lost & Found Hub.</p>
                        </div>
                    )}
                </div>

                {/* Reporting Modal */}
                {reportingMessage && (
                    <div style={s.reportOverlay}>
                        <div style={s.reportModal}>
                            {!reportSuccess ? (
                                <>
                                    <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>Report Message</h3>
                                    <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "#64748b" }}>Why are you reporting this message from "{reportingMessage.senderName}"?</p>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>Reason</label>
                                        <select
                                            value={reportReason}
                                            onChange={(e) => setReportReason(e.target.value)}
                                            style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="Spam">Spam</option>
                                            <option value="Harassment">Harassment</option>
                                            <option value="Inappropriate Content">Inappropriate Content</option>
                                            <option value="Hate Speech">Hate Speech</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: 24 }}>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>Additional Details (Optional)</label>
                                        <textarea
                                            value={reportDetail}
                                            onChange={(e) => setReportDetail(e.target.value)}
                                            style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: "0.85rem", minHeight: 80, resize: "none", outline: "none" }}
                                            placeholder="Explain why this message is inappropriate..."
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: 12 }}>
                                        <button
                                            style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "#f1f5f9", color: "#475569", fontWeight: 600, cursor: "pointer" }}
                                            onClick={() => setReportingMessage(null)}
                                        >Cancel</button>
                                        <button
                                            style={{
                                                flex: 1,
                                                padding: "12px",
                                                borderRadius: 12,
                                                border: "none",
                                                background: "#ef4444",
                                                color: "#fff",
                                                fontWeight: 600,
                                                cursor: (reportReason ? "pointer" : "not-allowed"),
                                                opacity: (reportReason ? 1 : 0.6)
                                            }}
                                            disabled={!reportReason}
                                            onClick={submitReport}
                                        >Report</button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: "center", padding: "20px 0" }}>
                                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                        <AlertTriangle size={32} />
                                    </div>
                                    <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>Report Submitted</h3>
                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Admin will review this message shortly.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @media (max-width: 700px) {
                    .chat-left-hide-mobile { display: none !important; }
                    .chat-right-show-mobile { display: flex !important; }
                    .back-btn-mobile { display: flex !important; }
                }
                .admin-support-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.25);
                    filter: brightness(1.2);
                }
                .msg-bubble-wrap:hover .report-flag-btn {
                    opacity: 1 !important;
                }
                .report-flag-btn:hover {
                    color: #ef4444 !important;
                    transform: scale(1.1);
                    border-color: #ef4444 !important;
                }
            `}</style>
        </DashboardLayout>
    );
}

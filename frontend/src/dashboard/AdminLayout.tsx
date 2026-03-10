import React, { useState, CSSProperties } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const styles: Record<string, CSSProperties> = {
    layout: {
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
    },
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    content: {
        flex: 1,
        padding: "28px 32px",
        overflowY: "auto",
    },
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        zIndex: 90,
        backdropFilter: "blur(2px)",
    },
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div style={styles.layout}>
            {sidebarOpen && (
                <div
                    style={styles.overlay}
                    className="admin-overlay-mobile"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <AdminSidebar isOpen={sidebarOpen} />
            <div
                style={{
                    ...styles.main,
                    marginLeft: sidebarOpen ? 230 : 0,
                }}
                className="admin-main-area"
            >
                <TopHeader onToggleSidebar={toggleSidebar} />
                <main style={styles.content} className="admin-content-area">
                    {children}
                </main>
            </div>

            {/* Responsive */}
            <style>{`
        .admin-overlay-mobile { display: none; }
        @media (max-width: 1024px) {
          .admin-content-area { padding: 24px 24px !important; }
        }
        @media (max-width: 768px) {
          .admin-main-area { margin-left: 0 !important; }
          .admin-overlay-mobile { display: block !important; }
          .admin-content-area { padding: 20px 16px !important; }
        }
        @media (max-width: 480px) {
          .admin-content-area { padding: 16px 12px !important; }
        }
      `}</style>
        </div>
    );
}

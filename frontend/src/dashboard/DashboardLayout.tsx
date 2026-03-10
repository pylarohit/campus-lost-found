import React, { useState, CSSProperties } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

interface DashboardLayoutProps {
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div style={styles.layout}>
            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && (
                <div
                    style={styles.overlay}
                    className="sidebar-overlay-mobile"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} />
            <div
                style={{
                    ...styles.main,
                    marginLeft: sidebarOpen ? 230 : 0,
                }}
                className="dashboard-main-area"
            >
                <TopHeader onToggleSidebar={toggleSidebar} />
                <main style={styles.content} className="dashboard-content-area">
                    {children}
                </main>
            </div>

            {/* Responsive styles */}
            <style>{`
        .sidebar-overlay-mobile {
          display: none;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .dashboard-content-area {
            padding: 24px 24px !important;
          }
        }

        /* Small tablet / large phone — sidebar becomes overlay */
        @media (max-width: 768px) {
          .dashboard-main-area {
            margin-left: 0 !important;
          }
          .sidebar-overlay-mobile {
            display: block !important;
          }
          .dashboard-content-area {
            padding: 20px 16px !important;
          }
        }

        /* Phone */
        @media (max-width: 480px) {
          .dashboard-content-area {
            padding: 16px 12px !important;
          }
        }
      `}</style>
        </div>
    );
}

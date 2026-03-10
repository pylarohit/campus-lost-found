import React, { useState, useEffect, CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

interface SlideData {
    id: number;
    title: string;
    description: string;
    blobGradient: string;
    overlayGradient: string;
    buttonColor: string;
    numberColor: string;
    image: string;
}

const slides: SlideData[] = [
    {
        id: 1,
        title: "Track & Recover Your Lost Items",
        description:
            "Report lost belongings and help fellow students recover their items across campus.",
        blobGradient: "linear-gradient(135deg, #93c5fd, #818cf8)",
        overlayGradient: "linear-gradient(135deg, #93c5fd 0%, #818cf8 100%)",
        buttonColor: "#3b82f6",
        numberColor: "#f8f9fbff",
        image: "/campusfound.png",
    },
    {
        id: 2,
        title: "Connect With Campus Community",
        description:
            "Join a network of students helping each other find their belongings every day.",
        blobGradient: "linear-gradient(135deg, #c084fc, #f472b6)",
        overlayGradient: "linear-gradient(135deg, #c084fc 0%, #f472b6 100%)",
        buttonColor: "#8b5cf6",
        numberColor: "#f9f8fbff",
        image: "/campusfound2.png",
    },
    {
        id: 3,
        title: "Book & Claim Found Items",
        description:
            "Reserve found items online and pick them up at your convenience from the campus desk.",
        blobGradient: "linear-gradient(135deg, #fbbf24, #fcd34d)",
        overlayGradient: "linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)",
        buttonColor: "#d97706",
        numberColor: "#f7f5f4ff",
        image: "/lost.png",
    },
    {
        id: 4,
        title: "Smart Search & Matching",
        description:
            "Our intelligent matching system automatically connects lost reports with found items.",
        blobGradient: "linear-gradient(135deg, #fda4af, #f87171)",
        overlayGradient: "linear-gradient(135deg, #fda4af 0%, #f87171 100%)",
        buttonColor: "#e11d48",
        numberColor: "#fcf9faff",
        image: "/campusfound3.png",
    },
];

// ── Styles ──────────────────────────────────

const styles: Record<string, CSSProperties> = {
    wrapper: {
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto 28px",
    },
    container: {
        position: "relative",
        height: 240,
        overflow: "hidden",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        background: "#fff",
    },
    track: {
        display: "flex",
        height: "100%",
        transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    slide: {
        minWidth: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
    },
    blob: {
        position: "absolute",
        top: -40,
        left: -20,
        width: 120,
        height: 140,
        borderRadius: "50%",
        filter: "blur(40px)",
        opacity: 0.3,
        pointerEvents: "none",
        zIndex: 0,
    },
    content: {
        flex: 1,
        padding: "32px 36px",
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 12,
    },
    title: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "1.55rem",
        fontWeight: 700,
        color: "#0f172a",
        lineHeight: 1.25,
        letterSpacing: "-0.02em",
        margin: 0,
    },
    desc: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        color: "#475569",
        lineHeight: 1.55,
        maxWidth: 380,
        margin: 0,
    },
    actions: {
        display: "flex",
        gap: 12,
        marginTop: 6,
    },
    btnBase: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 20px",
        borderRadius: 8,
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.25s ease",
        border: "none",
    },
    btnSecondary: {
        background: "transparent",
        color: "#334155",
        border: "1.5px solid #cbd5e1",
    },
    visual: {
        flex: 1,
        height: "100%",
        position: "relative",
        overflow: "hidden",
    },
    visualGradient: {
        position: "absolute",
        inset: 0,
        opacity: 0.55,
        zIndex: 1,
    },
    image: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
        zIndex: 2,
    },
    number: {
        position: "absolute",
        bottom: 20,
        right: 24,
        fontFamily: "'Inter', sans-serif",
        fontSize: "3.5rem",
        fontWeight: 300,
        opacity: 0.15,
        zIndex: 3,
        pointerEvents: "none",
        lineHeight: 1,
    },
    dots: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        border: "none",
        background: "#94a3b8",
        cursor: "pointer",
        padding: 0,
        transition: "all 0.3s ease",
    },
    dotActive: {
        width: 28,
        borderRadius: 10,
        background: "#3b82f6",
    },
};

// ── Component ───────────────────────────────

export default function SlidingBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => setCurrentSlide(index);

    return (
        <div style={styles.wrapper}>
            {/* Main Card Container */}
            <div style={styles.container} className="banner-container">
                <div
                    style={{
                        ...styles.track,
                        transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} style={styles.slide} className="banner-slide">
                            {/* Blur blob */}
                            <div style={{ ...styles.blob, background: slide.blobGradient }} />

                            {/* Left — Content */}
                            <div style={styles.content} className="banner-slide-content">
                                <h2 style={styles.title} className="banner-title">{slide.title}</h2>
                                <p style={styles.desc} className="banner-desc">{slide.description}</p>
                                <div style={styles.actions} className="banner-actions">
                                    <button
                                        style={{
                                            ...styles.btnBase,
                                            background: slide.buttonColor,
                                            color: "#fff",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                                            transform: hoveredBtn === `pri-${slide.id}` ? "translateY(-1px)" : "none",
                                        }}
                                        onMouseEnter={() => setHoveredBtn(`pri-${slide.id}`)}
                                        onMouseLeave={() => setHoveredBtn(null)}
                                        className="banner-btn"
                                    >
                                        Get Started <ArrowRight size={16} />
                                    </button>
                                    <button
                                        style={{
                                            ...styles.btnBase,
                                            ...styles.btnSecondary,
                                            background: hoveredBtn === `sec-${slide.id}` ? "#f1f5f9" : "transparent",
                                        }}
                                        onMouseEnter={() => setHoveredBtn(`sec-${slide.id}`)}
                                        onMouseLeave={() => setHoveredBtn(null)}
                                        className="banner-btn-secondary"
                                    >
                                        Learn More <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Right — Visual */}
                            <div style={styles.visual} className="banner-visual">
                                <div
                                    style={{
                                        ...styles.visualGradient,
                                        background: slide.overlayGradient,
                                    }}
                                />
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    style={styles.image}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                                <span style={{ ...styles.number, color: slide.numberColor }}>
                                    0{slide.id}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dot Indicators */}
            <div style={styles.dots}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        style={{
                            ...styles.dot,
                            ...(index === currentSlide ? styles.dotActive : {}),
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Responsive styles */}
            <style>{`
        /* Tablet */
        @media (max-width: 1024px) {
          .banner-container {
            height: 220px !important;
          }
          .banner-slide-content {
            padding: 24px 28px !important;
          }
          .banner-title {
            font-size: 1.35rem !important;
          }
        }

        /* Small tablet / large phone */
        @media (max-width: 768px) {
          .banner-container {
            height: auto !important;
            min-height: 200px;
          }
          .banner-slide {
            flex-direction: column !important;
          }
          .banner-slide-content {
            padding: 24px 20px !important;
          }
          .banner-visual {
            height: 150px !important;
            width: 100% !important;
            flex: none !important;
          }
          .banner-title {
            font-size: 1.2rem !important;
          }
          .banner-desc {
            font-size: 0.82rem !important;
          }
        }

        /* Phone */
        @media (max-width: 480px) {
          .banner-container {
            border-radius: 12px !important;
          }
          .banner-slide-content {
            padding: 20px 16px !important;
            gap: 8px !important;
          }
          .banner-title {
            font-size: 1.05rem !important;
          }
          .banner-desc {
            font-size: 0.78rem !important;
            max-width: 100% !important;
          }
          .banner-actions {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .banner-btn, .banner-btn-secondary {
            font-size: 0.78rem !important;
            padding: 8px 16px !important;
            width: 100% !important;
            justify-content: center !important;
          }
          .banner-visual {
            height: 120px !important;
          }
        }

        /* Very small phone */
        @media (max-width: 360px) {
          .banner-title {
            font-size: 0.95rem !important;
          }
          .banner-btn-secondary {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}

import React, { useState, useEffect, useRef, CSSProperties } from "react";
import DashboardLayout from "./DashboardLayout";
import { User, Mail, Phone, Hash, BookOpen, MapPin, Camera, Save, CheckCircle2 } from "lucide-react";

interface UserProfile {
    name: string;
    email: string;
    phoneNumber: string;
    regNo: string;
    course: string;
    address: string;
    profilePhoto: string;
}

const s: Record<string, CSSProperties> = {
    container: {
        maxWidth: 900,
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        marginBottom: "30px",
    },
    title: {
        fontSize: "1.85rem",
        fontWeight: 700,
        color: "#0f172a",
        margin: 0,
        letterSpacing: "-0.02em",
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#64748b",
        marginTop: "4px",
    },
    card: {
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        border: "1px solid #f1f5f9",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
    },
    photoSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "10px",
    },
    photoContainer: {
        width: "140px",
        height: "140px",
        borderRadius: "70px",
        backgroundColor: "#f8fafc",
        border: "4px solid #fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease",
    },
    photo: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    photoPlaceholder: {
        color: "#94a3b8",
    },
    photoOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(15, 23, 42, 0.6)",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        transition: "opacity 0.2s ease",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#334155",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    input: {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1.5px solid #e2e8f0",
        fontSize: "0.95rem",
        color: "#0f172a",
        transition: "all 0.2s ease",
        outline: "none",
    },
    readOnlyInput: {
        background: "#f8fafc",
        color: "#64748b",
        cursor: "not-allowed",
        borderColor: "#e2e8f0",
    },
    textarea: {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1.5px solid #e2e8f0",
        fontSize: "0.95rem",
        color: "#0f172a",
        minHeight: "100px",
        resize: "vertical",
        outline: "none",
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "10px",
    },
    saveBtn: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "#fff",
        border: "none",
        padding: "12px 28px",
        borderRadius: "12px",
        fontSize: "0.95rem",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
        transition: "all 0.2s ease",
    },
    successMsg: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#059669",
        fontSize: "0.95rem",
        fontWeight: 500,
    }
};

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        phoneNumber: "",
        regNo: "",
        course: "",
        address: "",
        profilePhoto: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userEmail = localStorage.getItem("userEmail") || "";

    useEffect(() => {
        if (userEmail) {
            fetchProfile();
        }
    }, [userEmail]);

    const fetchProfile = async () => {
        try {
            const resp = await fetch(`http://localhost:8080/api/profile/${userEmail}`);
            if (resp.ok) {
                const data = await resp.json();
                setProfile({
                    ...data,
                    profilePhoto: data.profilePhoto ? `http://localhost:8080${data.profilePhoto}` : ""
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const resp = await fetch(`http://localhost:8080/api/profile/${userEmail}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });
            if (resp.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save profile", err);
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const resp = await fetch(`http://localhost:8080/api/profile/upload-photo/${userEmail}`, {
                method: "POST",
                body: formData
            });
            if (resp.ok) {
                const photoPath = await resp.text();
                setProfile(prev => ({ ...prev, profilePhoto: `http://localhost:8080${photoPath}` }));
            }
        } catch (err) {
            console.error("Failed to upload photo", err);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div style={s.container}>Loading...</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div style={s.container} className="profile-page-anim">
                <div style={s.header}>
                    <h1 style={s.title}>Student Profile</h1>
                    <p style={s.subtitle}>View and update your personal information</p>
                </div>

                <div style={s.card}>
                    {/* Photo Section */}
                    <div style={s.photoSection}>
                        <div
                            style={s.photoContainer}
                            onClick={handlePhotoClick}
                            className="photo-hover"
                        >
                            {profile.profilePhoto ? (
                                <img src={profile.profilePhoto} alt="Profile" style={s.photo} />
                            ) : (
                                <div style={s.photoPlaceholder}>
                                    <User size={60} />
                                </div>
                            )}
                            <div style={s.photoOverlay} className="photo-overlay">
                                <Camera size={18} />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p style={{ ...s.subtitle, marginTop: "12px", fontWeight: 500 }}>Click to change photo</p>
                    </div>

                    <div style={s.formGrid} className="form-grid">
                        <div style={s.inputGroup}>
                            <label style={s.label}><User size={16} /> Full Name</label>
                            <input
                                style={s.input}
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div style={s.inputGroup}>
                            <label style={s.label}><Mail size={16} /> Email Address</label>
                            <input
                                style={s.input}
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div style={s.inputGroup}>
                            <label style={s.label}><Hash size={16} /> Registration Number</label>
                            <input
                                style={s.input}
                                name="regNo"
                                value={profile.regNo}
                                onChange={handleInputChange}
                                placeholder="Reg No (e.g. 2021CSE001)"
                            />
                        </div>

                        <div style={s.inputGroup}>
                            <label style={s.label}><Phone size={16} /> Phone Number</label>
                            <input
                                style={s.input}
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div style={{ ...s.inputGroup, gridColumn: "span 2" }}>
                            <label style={s.label}><BookOpen size={16} /> Course / Department</label>
                            <input
                                style={s.input}
                                name="course"
                                value={profile.course}
                                onChange={handleInputChange}
                                placeholder="e.g. B.Tech Computer Science"
                            />
                        </div>

                        <div style={{ ...s.inputGroup, gridColumn: "span 2" }}>
                            <label style={s.label}><MapPin size={16} /> Permanent Address</label>
                            <textarea
                                style={s.textarea}
                                name="address"
                                value={profile.address}
                                onChange={handleInputChange}
                                placeholder="Enter your full address"
                            />
                        </div>
                    </div>

                    <div style={s.footer}>
                        {showSuccess && (
                            <div style={s.successMsg}>
                                <CheckCircle2 size={18} />
                                Profile updated successfully!
                            </div>
                        )}
                        <button
                            style={{
                                ...s.saveBtn,
                                opacity: saving ? 0.7 : 1,
                                cursor: saving ? "not-allowed" : "pointer"
                            }}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .profile-page-anim {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .photo-hover:hover {
          transform: scale(1.05);
        }
        .photo-hover:hover .photo-overlay {
          opacity: 1;
        }
        .photo-overlay {
          opacity: 0;
        }
        input:focus, textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </DashboardLayout>
    );
}

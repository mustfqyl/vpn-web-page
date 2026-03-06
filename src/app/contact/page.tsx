"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ContactPage() {
    const { theme, toggleTheme } = useTheme();

    const ThemeSwitcher = () => {
        const { theme, toggleTheme, mounted } = useTheme();
        return (
            <button
                onClick={toggleTheme}
                className="theme-toggle-btn active"
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "var(--accent-soft)",
                    border: "1px solid var(--card-border)",
                    display: "grid",
                    placeItems: "center",
                    transition: "all 0.2s ease"
                }}
                aria-label="Toggle Theme"
            >
                {mounted ? (
                    theme === "dark" ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" stroke="currentColor" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    )
                ) : (
                    <div style={{ width: "15px", height: "15px" }} />
                )}
            </button>
        );
    };

    return (
        <div style={{ minHeight: "100vh", position: "relative" }}>
            <div className="bg-glow" />

            {/* Header */}
            <header style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                backgroundColor: "var(--background-glass)",
                backdropFilter: "blur(40px)",
                borderBottom: "1px solid var(--card-border)",
                height: "var(--header-height)"
            }}>
                <div className="container" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%"
                }}>
                    <Link href="/" style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "26px", height: "26px", background: "var(--accent)", borderRadius: "6px", display: "grid", placeItems: "center", color: "var(--background)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 800 }}>SECURE</span>
                            <span style={{ fontWeight: 400, opacity: 0.6 }}>VPN</span>
                        </div>
                    </Link>
                    <ThemeSwitcher />
                </div>
            </header>

            {/* Content */}
            <main className="container" style={{ padding: "160px 1.5rem 80px" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "5rem",
                    alignItems: "start"
                }}>
                    {/* Left Side: Information */}
                    <div>
                        <h1 style={{
                            fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
                            fontWeight: 600,
                            lineHeight: "1.1",
                            marginBottom: "1.5rem",
                            letterSpacing: "-0.03em",
                            background: "linear-gradient(to bottom, var(--foreground) 50%, var(--foreground-muted))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Support & Architecture.
                        </h1>
                        <p style={{
                            color: "var(--foreground-muted)",
                            fontSize: "1.125rem",
                            lineHeight: "1.6",
                            marginBottom: "3rem",
                            maxWidth: "400px"
                        }}>
                            We provide boutique, high-performance network security. If you have questions about your specific configuration or tier, reach out.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                            <div>
                                <h3 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", marginBottom: "0.75rem" }}>
                                    Direct Inquiry
                                </h3>
                                <a href="mailto:support@securevpn.com" style={{ fontSize: "1.25rem", fontWeight: 500, color: "var(--foreground)" }}>
                                    support@securevpn.com
                                </a>
                            </div>

                            <div>
                                <h3 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", marginBottom: "0.75rem" }}>
                                    Secure Discord
                                </h3>
                                <Link href="#" className="link-subtle" style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                                    Join Global Discord
                                </Link>
                            </div>
                        </div>

                        <div className="divider" style={{ margin: "4rem 0" }} />

                        <Link href="/" className="link-subtle" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Return to HQ
                        </Link>
                    </div>

                    {/* Right Side: Form */}
                    <div className="card" style={{ padding: "2.5rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "2rem" }}>Send a Protocol</h2>
                        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="name@company.com"
                                    required
                                    style={{ background: "rgba(255, 255, 255, 0.03)" }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nature of Inquiry</label>
                                <select
                                    className="input"
                                    required
                                    defaultValue=""
                                    style={{ background: "rgba(255, 255, 255, 0.03)", appearance: "none", cursor: "pointer" }}
                                >
                                    <option value="" disabled>Select Inquiry Type</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="billing">Billing & Sales</option>
                                    <option value="strategic">Strategic Partnership</option>
                                    <option value="media">Media & Press</option>
                                    <option value="vulnerability">Vulnerability Report</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Detailed Message</label>
                                <textarea
                                    className="input"
                                    placeholder="How can we assist your network security?"
                                    required
                                    rows={5}
                                    style={{ resize: "none", minHeight: "150px", background: "rgba(255, 255, 255, 0.03)" }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ height: "3.5rem", fontSize: "1rem", fontWeight: 600 }}>
                                Initialize Communication
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

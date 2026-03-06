"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function BillingPage() {
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    )
                ) : (
                    <div style={{ width: "15px", height: "15px" }} />
                )}
            </button>
        );
    };

    const [updating, setUpdating] = useState<string | null>(null);

    const handleAction = (action: string) => {
        setUpdating(action);
        setTimeout(() => setUpdating(null), 2000);
    };

    return (
        <div style={{ minHeight: "100vh", position: "relative" }}>
            <div className="bg-glow" />

            <header style={{
                backgroundColor: "var(--background-glass)",
                backdropFilter: "blur(40px)",
                borderBottom: "1px solid var(--card-border)",
                position: "sticky",
                top: 0,
                zIndex: 40
            }}>
                <div className="container" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "60px"
                }}>
                    <Link href="/" style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "20px", height: "20px", background: "var(--accent)", borderRadius: "4px", display: "grid", placeItems: "center", color: "var(--background)" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 800 }}>SECURE</span>
                            <span style={{ fontWeight: 400, opacity: 0.6 }}>VPN</span>
                        </div>
                    </Link>

                    <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <Link href="/dashboard" className="link-subtle" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Dashboard</Link>
                        <div style={{ width: "1px", height: "14px", background: "var(--card-border)" }} />
                        <ThemeSwitcher />
                    </nav>
                </div>
            </header>

            <main className="container" style={{ padding: "1.5rem 0" }}>
                <div style={{ maxWidth: "850px", margin: "0 auto" }} className="animate-fadeUp">

                    <div style={{ marginBottom: "1.5rem" }}>
                        <h1 style={{ fontSize: "1.75rem" }}>Billing & Subscription</h1>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                        {/* Current Plan Card */}
                        <div className="card" style={{ padding: "1.5rem" }}>
                            <div style={{ color: "var(--foreground-muted)", fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Current Tier</div>
                            <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>Premium Membership</div>
                            <p style={{ fontSize: "0.8125rem", marginBottom: "1.5rem" }}>Renews on March 03, 2026</p>
                            <button
                                onClick={() => handleAction('plan')}
                                className="btn btn-secondary"
                                style={{ width: "100%", borderRadius: "8px", fontSize: "0.8125rem", padding: "0.6rem" }}
                            >
                                {updating === 'plan' ? 'Redirecting to Gate...' : 'Change Plan'}
                            </button>
                        </div>

                        {/* Payment Method Card */}
                        <div className="card" style={{ padding: "1.5rem" }}>
                            <div style={{ color: "var(--foreground-muted)", fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Payment Method</div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                                <div style={{ width: "36px", height: "24px", background: "var(--accent-soft)", borderRadius: "4px", border: "1px solid var(--card-border)", display: "grid", placeItems: "center", fontSize: "0.55rem", fontWeight: 700 }}>VISA</div>
                                <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>•••• •••• •••• 4421</div>
                            </div>
                            <button
                                onClick={() => handleAction('card')}
                                className="btn btn-secondary"
                                style={{ width: "100%", borderRadius: "8px", fontSize: "0.8125rem", padding: "0.6rem" }}
                            >
                                {updating === 'card' ? 'Secure Link Opening...' : 'Update Card'}
                            </button>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="card" style={{ padding: "1.5rem" }}>
                        <h3 style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Transaction Logic</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {[
                                { date: "Feb 03, 2025", amount: "€2.50", status: "Processed", id: "TX-9921-A" },
                                { date: "Jan 03, 2025", amount: "€2.50", status: "Processed", id: "TX-8812-B" },
                                { date: "Dec 03, 2024", amount: "€2.50", status: "Processed", id: "TX-7703-C" }
                            ].map((tx, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.75rem 1rem",
                                    background: "var(--accent-soft)",
                                    borderRadius: "10px",
                                    border: "1px solid var(--card-border)",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    cursor: "pointer"
                                }} className="hoverable-transaction">
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: "0.8125rem" }}>{tx.date}</div>
                                        <div style={{ fontSize: "0.6875rem", color: "var(--foreground-subtle)", fontFamily: "monospace" }}>{tx.id}</div>
                                    </div>
                                    <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{tx.amount}</div>
                                        <div style={{ fontSize: "0.625rem", color: "var(--success)", fontWeight: 700, padding: "0.2rem 0.5rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "4px" }}>{tx.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: "2rem", textAlign: "center" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
                            Need infrastructure assistance? <Link href="/contact" style={{ color: "var(--foreground)", textDecoration: "underline", fontWeight: 500 }}>Contact professional support.</Link>
                        </p>
                    </div>

                </div>
            </main>

            <style jsx>{`
                .hoverable-transaction:hover {
                    border-color: var(--foreground-subtle);
                    transform: translateY(-1px);
                    background: var(--background);
                    box-shadow: var(--shadow-sm);
                }
                .btn:hover {
                    filter: brightness(1.1);
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
}

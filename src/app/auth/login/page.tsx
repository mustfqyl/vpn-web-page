"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
            <div className="bg-glow" />

            {/* Minimal Header */}
            <header style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                backgroundColor: "var(--background-glass)",
                backdropFilter: "blur(40px)",
                borderBottom: "1px solid var(--card-border)"
            }}>
                <div className="container" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "var(--header-height)"
                }}>
                    <Link href="/" style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "24px", height: "24px", background: "var(--accent)", borderRadius: "6px", display: "grid", placeItems: "center", color: "var(--background)" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 800 }}>SECURE</span>
                            <span style={{ fontWeight: 400, opacity: 0.6 }}>VPN</span>
                        </div>
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <Link href="/auth/register" className="link-subtle" style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Join</Link>
                        <ThemeSwitcher />
                    </div>
                </div>
            </header>

            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                paddingTop: "var(--header-height)"
            }}>
                <div style={{ width: "100%", maxWidth: "440px" }} className="animate-fadeUp">
                    <div className="card" style={{ padding: "3rem 2.5rem" }}>
                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                                Welcome Back
                            </h1>
                            <p style={{ color: "var(--foreground-muted)", fontSize: "0.9375rem" }}>
                                Enter your credentials to access your secure network infrastructure.
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                padding: "1rem",
                                borderRadius: "10px",
                                background: "rgba(239, 68, 68, 0.05)",
                                border: "1px solid var(--error)",
                                color: "var(--error)",
                                fontSize: "0.875rem",
                                marginBottom: "2rem",
                                textAlign: "center"
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "0.8125rem",
                                    fontWeight: 700,
                                    marginBottom: "0.6rem",
                                    color: "var(--foreground-subtle)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em"
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input"
                                    placeholder="name@email.com"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "2.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                                    <label style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        color: "var(--foreground-subtle)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em"
                                    }}>
                                        Password
                                    </label>
                                    <Link href="#" style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>
                                        Reset?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ width: "100%", padding: "1rem" }}
                            >
                                {loading ? "Authenticating..." : "Sign In"}
                            </button>
                        </form>
                    </div>

                    <p style={{
                        textAlign: "center",
                        marginTop: "2.5rem",
                        fontSize: "0.875rem",
                        color: "var(--foreground-muted)"
                    }}>
                        By continuing, you adhere to our <Link href="/terms" style={{ color: "var(--foreground)" }}>Standard Terms</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}

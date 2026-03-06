"use client";

import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog-posts";
import { useTheme } from "@/context/ThemeContext";

export default function BlogIndexPage() {
    const { theme, toggleTheme, mounted } = useTheme();

    const ThemeSwitcher = () => (
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

            {/* Hero Section */}
            <section style={{ padding: "160px 1.5rem 60px", textAlign: "center" }}>
                <div className="container">
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 8vw, 4rem)",
                        fontWeight: 600,
                        lineHeight: "1.1",
                        marginBottom: "1.5rem",
                        letterSpacing: "-0.04em",
                        background: "linear-gradient(to bottom, var(--foreground) 50%, var(--foreground-muted))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Network Briefing.
                    </h1>
                    <p style={{
                        color: "var(--foreground-muted)",
                        fontSize: "1.125rem",
                        maxWidth: "600px",
                        margin: "0 auto",
                        lineHeight: "1.6"
                    }}>
                        Deep dives into protocol architecture, stealth technology, and the future of digital sovereignty.
                    </p>
                </div>
            </section>

            {/* Blog Feed */}
            <main className="container" style={{ padding: "0 1.5rem 120px" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "2.5rem"
                }}>
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="card"
                            style={{
                                padding: "2rem",
                                display: "flex",
                                flexDirection: "column",
                                transition: "transform 0.3s ease, border-color 0.3s ease",
                                cursor: "pointer",
                                textDecoration: "none",
                                border: "1px solid var(--card-border)"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                                <span style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    color: "var(--accent)",
                                    background: "var(--accent-soft)",
                                    padding: "0.25rem 0.75rem",
                                    borderRadius: "100px"
                                }}>
                                    {post.category}
                                </span>
                                <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>
                                    {post.readTime}
                                </span>
                            </div>

                            <h2 style={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                marginBottom: "1rem",
                                color: "var(--foreground)",
                                lineHeight: "1.3"
                            }}>
                                {post.title}
                            </h2>

                            <p style={{
                                color: "var(--foreground-muted)",
                                fontSize: "0.9375rem",
                                lineHeight: "1.6",
                                marginBottom: "2rem",
                                flexGrow: 1
                            }}>
                                {post.excerpt}
                            </p>

                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: "auto",
                                paddingTop: "1.5rem",
                                borderTop: "1px solid var(--card-border)"
                            }}>
                                <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", fontWeight: 500 }}>
                                    {post.date}
                                </span>
                                <div style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: "var(--card-border)",
                                    display: "grid",
                                    placeItems: "center",
                                    transition: "background 0.3s ease"
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="divider" style={{ margin: "5rem 0" }} />

                <div style={{ textAlign: "center" }}>
                    <Link href="/" className="link-subtle" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Headquarters
                    </Link>
                </div>
            </main>

            <style jsx>{`
                .card:hover {
                    transform: translateY(-8px);
                    border-color: var(--accent) !important;
                }
                .card:hover div:last-child div {
                    background: var(--accent) !important;
                    color: var(--background);
                }
            `}</style>
        </div>
    );
}

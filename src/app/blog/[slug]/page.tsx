"use client";

import Link from "next/link";
import { use } from "react";
import { BLOG_POSTS } from "@/data/blog-posts";
import { notFound } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    const { theme, toggleTheme, mounted } = useTheme();

    if (!post) {
        notFound();
    }

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

            <article className="container" style={{ padding: "160px 1.5rem 120px", maxWidth: "800px", margin: "0 auto" }}>
                <Link href="/blog" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--accent)", marginBottom: "3rem", textDecoration: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Feed
                </Link>

                <div style={{ marginBottom: "4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <span style={{
                            fontSize: "0.8125rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "var(--accent)"
                        }}>
                            {post.category}
                        </span>
                        <div style={{ width: "4px", height: "4px", background: "var(--card-border)", borderRadius: "50%" }} />
                        <span style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                            {post.date}
                        </span>
                        <div style={{ width: "4px", height: "4px", background: "var(--card-border)", borderRadius: "50%" }} />
                        <span style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                            {post.readTime}
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: "clamp(2.5rem, 8vw, 4rem)",
                        fontWeight: 700,
                        lineHeight: "1.1",
                        marginBottom: "2rem",
                        color: "var(--foreground)",
                        letterSpacing: "-0.04em"
                    }}>
                        {post.title}
                    </h1>

                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        {post.tags.map(tag => (
                            <span key={tag} style={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                background: "var(--card-border)",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "4px",
                                color: "var(--foreground-muted)"
                            }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="blog-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem", color: "var(--foreground)" }} {...props} />,
                            h2: ({ node, ...props }) => <h2 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "1.5rem", marginTop: "3rem", color: "var(--foreground)" }} {...props} />,
                            h3: ({ node, ...props }) => <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "2.5rem", marginBottom: "1rem", color: "var(--foreground)" }} {...props} />,
                            h4: ({ node, ...props }) => <h4 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: "2rem", marginBottom: "1rem", color: "var(--foreground)" }} {...props} />,
                            p: ({ node, ...props }) => <p style={{ marginBottom: "1.5rem", lineHeight: "1.8", color: "var(--foreground-muted)", fontSize: "1.125rem" }} {...props} />,
                            ul: ({ node, ...props }) => <ul style={{ marginBottom: "2rem", listStyle: "disc", paddingLeft: "1.5rem", color: "var(--foreground-muted)" }} {...props} />,
                            ol: ({ node, ...props }) => <ol style={{ marginBottom: "2rem", listStyle: "decimal", paddingLeft: "1.5rem", color: "var(--foreground-muted)" }} {...props} />,
                            li: ({ node, ...props }) => <li style={{ marginBottom: "0.75rem", fontSize: "1.125rem" }} {...props} />,
                            strong: ({ node, ...props }) => <strong style={{ color: "var(--foreground)", fontWeight: 700 }} {...props} />,
                            em: ({ node, ...props }) => <em style={{ fontStyle: "italic", color: "var(--foreground-muted)" }} {...props} />,
                            a: ({ node, ...props }) => <a style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "4px" }} {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: "4px solid var(--accent)", paddingLeft: "1.5rem", fontStyle: "italic", marginLeft: 0, marginBottom: "2rem", color: "var(--foreground-subtle)" }} {...props} />,
                            code: ({ node, ...props }) => <code style={{ background: "var(--card-border)", padding: "0.2rem 0.4rem", borderRadius: "4px", fontSize: "0.9em", fontFamily: "monospace", color: "var(--foreground)" }} {...props} />,
                            pre: ({ node, ...props }) => <pre style={{ background: "var(--card-border)", padding: "1rem", borderRadius: "8px", overflowX: "auto", marginBottom: "2rem" }} {...props} />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                <div className="divider" style={{ margin: "5rem 0" }} />

                <div style={{
                    padding: "4rem",
                    textAlign: "center",
                    background: "var(--accent-soft)",
                    borderRadius: "24px",
                    border: "1px solid var(--card-border)"
                }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "1rem" }}>Secure your connection today.</h2>
                    <p style={{ color: "var(--foreground-muted)", marginBottom: "2rem" }}>Experience the protocols mentioned above in one simple interface.</p>
                    <Link href="/auth/register" className="btn btn-primary" style={{ padding: "1rem 2.5rem" }}>
                        Join SecureVPN
                    </Link>
                </div>
            </article>

            <style jsx>{`
                .blog-content {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
            `}</style>
        </div>
    );
}

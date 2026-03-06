import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: "100vh", position: "relative" }}>
            <div className="bg-glow" />

            {/* Header */}
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
                    height: "var(--header-height)"
                }}>
                    <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "24px", height: "24px", background: "var(--accent)", borderRadius: "4px" }} />
                        <span style={{ fontWeight: 600 }}>SECUREVPN</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: "800px", margin: "0 auto", padding: "160px 1.5rem 80px" }}>
                <h1 style={{
                    fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
                    fontWeight: 600,
                    marginBottom: "1rem",
                    background: "linear-gradient(to bottom, var(--foreground) 50%, var(--foreground-muted))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    Privacy Architecture
                </h1>
                <p style={{ color: "var(--foreground-muted)", marginBottom: "4rem", fontSize: "1.125rem" }}>
                    Last refined: February 2026
                </p>

                <div style={{ lineHeight: "1.8", color: "var(--foreground-muted)", fontSize: "1.0625rem" }}>
                    <section style={{ marginBottom: "4rem" }}>
                        <h2 style={{ fontSize: "1.375rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1.25rem" }}>
                            Standard of Absolute Trust
                        </h2>
                        <p>
                            At SECUREVPN, privacy is not a feature—it is our primary architecture. We have built an infrastructure
                            that prioritizes **simplicity** and **trust**, ensuring your data is never accessible, even to us.
                        </p>
                    </section>

                    <section style={{ marginBottom: "4rem" }}>
                        <h2 style={{ fontSize: "1.375rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1.25rem" }}>
                            Transparent Zero-Knowledge
                        </h2>
                        <p style={{ marginBottom: "1.25rem" }}>
                            Our systems are architected to ensure absolute anonymity across every node:
                        </p>
                        <ul style={{
                            paddingLeft: "0",
                            marginBottom: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                            listStyle: "none"
                        }}>
                            {[
                                "No source or destination IP logging",
                                "No browsing metrics or history",
                                "No traffic content inspection",
                                "No connection timestamps",
                                "No oversubscribed network telemetry"
                            ].map((item, i) => (
                                <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: "4px", height: "4px", background: "var(--accent)", borderRadius: "1px" }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p>
                            Verified through rigorous independent audits and industrial-grade **XCACHA-POLY1305** encryption.
                        </p>
                    </section>

                    <section style={{ marginBottom: "4rem" }}>
                        <h2 style={{ fontSize: "1.375rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1.25rem" }}>
                            Elite Performance
                        </h2>
                        <p>
                            Speed should never compromise safety. Our global node network is designed for **pure velocity**
                            without sacrificing the cryptographic integrity that our premium members expect.
                        </p>
                    </section>
                </div>

                <div style={{
                    margin: "4rem 0",
                    height: "1px",
                    background: "linear-gradient(to right, transparent, var(--card-border), transparent)"
                }} />

                <Link href="/" className="link-subtle" style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Return to Simple SECUREVPN
                </Link>
            </main>
        </div>
    );
}

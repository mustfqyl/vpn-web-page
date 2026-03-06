"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDownloadsOpen, setMobileDownloadsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => { })
      .finally(() => setIsAuthLoading(false));
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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

  return (
    <div className="min-h-screen no-select">
      <div className="bg-glow" />

      {/* Dynamic Background Assets */}
      <div className="theme-assets-container">
        {/* Dark Mode Assets */}
        {theme === "dark" && (
          <div className="dark-assets">
            <div className="mesh-grid" />
            <div className="neon-orb neon-1" />
            <div className="neon-orb neon-2" />
            <div className="float-node node-1" />
            <div className="float-node node-2" />
          </div>
        )}

        {/* Light Mode Assets */}
        {theme === "light" && (
          <div className="light-assets">
            <div className="studio-orb studio-1" />
            <div className="studio-orb studio-2" />
            <div className="studio-orb studio-3" />
          </div>
        )}
      </div>

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
        transition: "all 0.3s ease"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "var(--header-height)"
          }}>
            <Link href="/" style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "26px", height: "26px", background: "var(--accent)", borderRadius: "6px", display: "grid", placeItems: "center", color: "var(--background)", transition: "all 0.3s ease" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={{ fontWeight: 800 }}>SECURE</span>
                <span style={{ fontWeight: 400, opacity: 0.6 }}>VPN</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-only">
              <Link href="#features" className="link-subtle" style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Solutions</Link>

              <Link href="#pricing" className="link-subtle" style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pricing</Link>

              <Link href="/blog" className="link-subtle" style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Blog</Link>
              <div className="nav-dropdown-trigger">
                <span className="link-subtle" style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  Downloads
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="m6 9 6 6 6-6" /></svg>
                </span>
                <div className="nav-dropdown-content">
                  <Link href="/download/apple" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 1.44S8.22 5 6 5a4.91 4.91 0 0 0-5 4.78c0 4.22 3 12.22 6 12.22 1.25 0 2.5-1.06 4-1.06Z" /><path d="M12 5a3 3 0 0 0 2-4c-2 0-4 3-4 4Z" /></svg>
                    Apple
                  </Link>
                  <Link href="/download/windows" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6v12l7 1.5V4.5L4 6Z" /><path d="M13 19.5l7 1.5V3l-7 1.5v15Z" /></svg>
                    Windows
                  </Link>
                  <Link href="/download/android" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 2 3.5 4.5" /><path d="M18.5 2l2 2.5" /><path d="M3 15h18" /><path d="M5 21v-3" /><path d="M19 21v-3" /><path d="M16 11V7a4 4 0 0 0-8 0v4" /><path d="M4 11h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z" /></svg>
                    Android
                  </Link>
                </div>
              </div>

              <div style={{ width: "2px", height: "25px", background: "var(--card-border)", margin: "0 0.5rem" }} />
              <ThemeSwitcher />
            </nav>

            {/* Action Group (Signs, Theme, Setup) */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Fixed width container to prevent layout shifts during hydration */}
              <div className="desktop-only" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "220px" }}>
                {isAuthLoading ? (
                  <div style={{ width: "160px", height: "36px", background: "var(--accent-soft)", borderRadius: "8px", animation: "pulse 2s infinite", opacity: 0.5 }} />
                ) : isLoggedIn ? (
                  <Link href="/dashboard" className="btn btn-primary" style={{ padding: "0.6rem 1.4rem", fontSize: "0.8125rem", borderRadius: "8px", textAlign: "center", justifyContent: "center" }}>
                    Dashboard
                  </Link>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", justifyContent: "flex-end" }}>
                    <Link href="/auth/login" className="link-subtle" style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sign in</Link>
                    <Link href="/auth/register" className="btn btn-primary" style={{ padding: "0.6rem 1.4rem", fontSize: "0.8125rem", borderRadius: "8px" }}>
                      Join Now
                    </Link>
                  </div>
                )}
              </div>

              <div className="mobile-only" style={{ marginLeft: "1rem" }}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{ background: "none", border: "none", color: "var(--foreground)", padding: "0.5rem", cursor: "pointer", display: "flex" }}
                >
                  {mobileMenuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: "absolute",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            background: "var(--background-glass)",
            backdropFilter: "blur(60px)",
            borderBottom: "1px solid var(--card-border)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
            zIndex: 99,
            animation: "fadeInUp 0.3s ease"
          }}>
            <ThemeSwitcher />

            <Link href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Solutions</Link>

            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pricing</Link>

            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Blog</Link>


            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button
                onClick={() => setMobileDownloadsOpen(!mobileDownloadsOpen)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                  color: "var(--foreground)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer"
                }}
              >
                Downloads
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: mobileDownloadsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", opacity: 0.5 }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {mobileDownloadsOpen && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1.25rem",
                  paddingLeft: "1.25rem",
                  paddingTop: "0.5rem",
                  animation: "fadeIn 0.3s ease"
                }}>
                  <Link href="/download/apple" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 1.44S8.22 5 6 5a4.91 4.91 0 0 0-5 4.78c0 4.22 3 12.22 6 12.22 1.25 0 2.5-1.06 4-1.06Z" /><path d="M12 5a3 3 0 0 0 2-4c-2 0-4 3-4 4Z" /></svg>
                    Apple Client
                  </Link>
                  <Link href="/download/windows" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><path d="M4 6v12l7 1.5V4.5L4 6Z" /><path d="M13 19.5l7 1.5V3l-7 1.5v15Z" /></svg>
                    Windows Client
                  </Link>
                  <Link href="/download/android" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><path d="M5.5 2 3.5 4.5" /><path d="M18.5 2l2 2.5" /><path d="M3 15h18" /><path d="M5 21v-3" /><path d="M19 21v-3" /><path d="M16 11V7a4 4 0 0 0-8 0v4" /><path d="M4 11h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z" /></svg>
                    Android Client
                  </Link>
                </div>
              )}
            </div>

            <div style={{ height: "2px", background: "var(--card-border)" }} />
            {isAuthLoading ? (
              <div style={{ height: "48px", background: "var(--accent-soft)", borderRadius: "8px", animation: "pulse 2s infinite", margin: "1rem 0" }} />
            ) : isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textAlign: "center", padding: "1rem" }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sign in</Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textAlign: "center", padding: "1rem" }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={{
        paddingTop: "240px",
        paddingBottom: "160px",
        textAlign: "center",
        position: "relative",
        zIndex: 1
      }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Link href="#" className="badge animate-fadeUp" style={{
              marginBottom: "2rem",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 1.25rem",
              border: "1px solid var(--card-border)",
              transition: "all 0.3s ease",
              background: "var(--accent-soft)"
            }}>
              <span className="status-pulse" style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--success)",
                display: "block"
              }} />
              <span style={{ color: "var(--success)", fontWeight: 700, fontSize: "0.7rem" }}>ALL SYSTEMS OPERATIONAL</span>
            </Link>

            <h1 className="animate-reveal-up" style={{
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              marginBottom: "1.5rem",
              background: "linear-gradient(to bottom, var(--foreground) 50%, var(--foreground-muted))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.05,
              fontWeight: 800
            }}>
              Pure Privacy.<br />Simply Fast.
            </h1>

            <p className="animate-fadeUp" style={{
              fontSize: "clamp(1.125rem, 4vw, 1.25rem)",
              color: "var(--foreground-muted)",
              maxWidth: "550px",
              margin: "0 auto 3.5rem",
              animationDelay: "0.1s"
            }}>
              Experience the elegance of uncompromising security and simplicity. Our premium network is engineered for those who demand absolute trust.
            </p>

            <div className="animate-fadeUp" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
              animationDelay: "0.2s"
            }}>
              {isAuthLoading ? (
                <div style={{ minWidth: "180px", height: "48px", background: "var(--accent-soft)", borderRadius: "8px", animation: "pulse 2s infinite" }} />
              ) : isLoggedIn ? (
                <Link href="/dashboard" className="btn btn-primary" style={{ minWidth: "180px" }}>
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/auth/register" className="btn btn-primary" style={{ minWidth: "180px" }}>
                  Join Now
                </Link>
              )}
              <Link href="#features" className="btn btn-secondary" style={{ minWidth: "180px" }}>
                Our Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Divider / Stats */}
      <section className="reveal" style={{
        padding: "5rem 0",
        borderTop: "1px solid var(--card-border)",
        borderBottom: "1px solid var(--card-border)",
        background: "var(--background-secondary)"
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "4rem",
            textAlign: "center"
          }}>
            {[
              { value: "50+", label: "Strategic Global Nodes" },
              { value: "Low-Lat", label: "Ultra Speed Response" },
              { value: "Zero", label: "Trusted Zero Logs" },
              { value: "Elite", label: "Premium 24/7 Care" },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontSize: "3rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--foreground)",
                  letterSpacing: "-0.03em"
                }}>{stat.value}</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--foreground-subtle)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Solutions */}
      <section id="features" className="section reveal">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "8rem" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              marginBottom: "1.5rem",
              background: "linear-gradient(to bottom, var(--foreground), var(--foreground-muted))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Elegant Performance
            </h2>
            <p style={{ maxWidth: "550px", margin: "0 auto" }}>
              Stripping away complexity to provide the world&apos;s most intuitive and powerful security infrastructure.
            </p>
          </div>

          <div className="reveal" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem"
          }}>
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>,
                title: "ML-KEM-768 post-quantum encryption",
                description: "Leveraging state-of-the-art cryptographic standards to ensure your data remains purely private and unreachable."
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
                title: "Pure Velocity",
                description: "A network optimized for simple, lightning-fast transitions across any global application."
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>,
                title: "No Oversubscription",
                description: "Our infrastructure guarantees maximum performance even during peak intervals. No compromises."
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
                title: "Trusted Zero-Log",
                description: "Architected for honesty. We maintain zero browsing logs, ensuring your trust is never broken."
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 9-10 10L2 12z" /></svg>,
                title: "Boutique Service",
                description: "Instead of offering standard service to a large number of users, we choose to offer premium service to a select group of users."
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                title: "Limited Customers",
                description: "Our service is limited to a certain number of users, aiming to provide maximum performance to each customer; currently, our maximum subscriber count is 1000."
              },
            ].map((feature, i) => (
              <div key={i} className="card premium-card" style={{ padding: "2.5rem" }}>
                <div style={{ color: "var(--foreground)", marginBottom: "1.5rem", opacity: 0.9 }}>{feature.icon}</div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", fontWeight: 600 }}>{feature.title}</h3>
                <p style={{ fontSize: "0.9375rem", color: "var(--foreground-muted)", lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Core Architecture */}
      <section id="protocols" className="section reveal" style={{ borderTop: "1px solid var(--card-border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "6rem" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
              marginBottom: "1rem",
              background: "linear-gradient(to right, var(--foreground), var(--foreground-muted))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Core Protocols
            </h2>
            <p style={{ maxWidth: "600px", margin: "0 auto" }}>
              Engineered for the modern era. We leverage top-tier transit protocols to ensure absolute performance and stealth.
            </p>
          </div>

          <div className="reveal" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem"
          }}>
            {/* WireGuard Card */}
            <div className="card premium-card" style={{ padding: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ color: "var(--foreground)", opacity: 0.9, display: "flex" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <div className="badge" style={{ background: "var(--accent-soft)", color: "var(--foreground)" }}>Daily Performance</div>
              </div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>WireGuard®</h3>
              <p style={{ color: "var(--foreground-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
                WireGuard is built for pure speed and reliability. It ensures your connection is always instant and won&apos;t drain your device&apos;s battery, making it the perfect choice for high-definition streaming, lag-free gaming, and everyday secure browsing.
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  "Lag-free 4K Streaming & Gaming",
                  "Ultra-Low Battery Consumption",
                  "Instant 'Always-On' Connectivity"
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem", fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ByeDPI Card */}
            <div className="card premium-card" style={{ padding: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ color: "var(--foreground)", opacity: 0.9, display: "flex" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <div className="badge" style={{ background: "var(--accent-soft)", color: "var(--foreground)" }}>DPI Filter Bypass</div>
              </div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>ByeDPI</h3>
              <p style={{ color: "var(--foreground-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
                ByeDPI is a unique tool that overcomes Deep Packet Inspection (DPI) without a tunnel. It cleverly fragments and modifies your request packets to slip past national-level firewalls and ISP blocks with zero performance overhead.
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  "Nation-Level Firewall Bypassing",
                  "Zero Performance or Speed Loss",
                  "Lightweight Packet Manipulation"
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem", fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* VLESS Card */}
            <div className="card premium-card" style={{ padding: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ color: "var(--foreground)", opacity: 0.9, display: "flex" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m14 12-4-2.5" /></svg>
                </div>
                <div className="badge" style={{ background: "var(--accent-soft)", color: "var(--foreground)" }}>Maximum Stealth</div>
              </div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>VLESS</h3>
              <p style={{ color: "var(--foreground-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
                VLESS is designed to bypass the toughest network restrictions and censorship. By masking your traffic as standard web activity, it allows you to stay connected and private even in highly monitored environments like schools, offices, or restricted regions.
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  "Bypasses Censorship & Restrictions",
                  "Undetectable Stealth Traffic",
                  "Works on Any Restricted Network"
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem", fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Access */}
      <section id="pricing" className="section reveal" style={{ background: "var(--background-secondary)", borderTop: "1px solid var(--card-border)" }}>
        <div className="container">
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              marginBottom: "1rem",
              color: "var(--foreground)"
            }}>
              Simple Plans. Premium Value.
            </h2>
            <p style={{ marginBottom: "4rem" }}>
              Highest-tier privacy, simplified for everyone.
            </p>

            <div className="card premium-card" style={{
              padding: "4rem 2rem",
              background: "var(--background)",
              border: "1px solid var(--card-hover-border)"
            }}>
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--foreground-subtle)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>Premium Membership</div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "5rem", fontWeight: 700, color: "var(--foreground)" }}>€2.50</span>
                  <span style={{ color: "var(--foreground-muted)", fontSize: "1.125rem" }}>/mo</span>
                </div>
              </div>

              <ul style={{
                listStyle: "none",
                padding: 0,
                marginBottom: "4rem",
                display: "inline-flex",
                flexDirection: "column",
                gap: "1.25rem",
                textAlign: "left"
              }}>
                {[
                  "Industrial-standard ML-KEM-768",
                  "Simplified global node access",
                  "Unlimited bandwidth with elite speeds",
                  "Trusted across 3 personal devices",
                  "Direct access to premium assistance"
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1rem", color: "var(--foreground-muted)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ maxWidth: "340px", margin: "0 auto" }}>
                <Link href="/auth/register" className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "0.9375rem" }}>
                  Join the Network
                </Link>
                <p style={{ fontSize: "0.8125rem", color: "var(--foreground-subtle)", marginTop: "1.5rem" }}>
                  Trusted payment infrastructure. Cancel instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "6rem 0 4rem",
        borderTop: "1px solid var(--card-border)"
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "4rem",
            marginBottom: "4rem"
          }}>
            <div style={{ gridColumn: "span 2" }}>
              <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "24px", height: "24px", background: "var(--accent)", borderRadius: "4px" }} />
                SECUREVPN
              </Link>
              <p style={{ maxWidth: "300px", fontSize: "0.9375rem" }}>
                We take pleasure in working to make an uncensored and private internet, which we believe everyone has a right to, as accessible as possible in the simplest way.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: 600 }}>Product</h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                <Link href="#features" className="link-subtle">Solutions</Link>
                <Link href="#pricing" className="link-subtle">Pricing</Link>
                <Link href="/download" className="link-subtle">Downloads</Link>
              </nav>
            </div>
            <div>
              <h4 style={{ marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: 600 }}>Company</h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                <Link href="/privacy" className="link-subtle">Privacy Policy</Link>
                <Link href="/terms" className="link-subtle">Terms of Service</Link>
                <Link href="/contact" className="link-subtle">Corporate Contact</Link>
              </nav>
            </div>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "2rem",
            borderTop: "1px solid var(--card-border)",
            fontSize: "0.75rem",
            color: "var(--foreground-subtle)",
            fontWeight: 500
          }}>
            <span>© {new Date().getFullYear()} SECUREVPN - All rights reserved.</span>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <Link href="#" className="link-subtle">Twitter</Link>
              <Link href="#" className="link-subtle">Discord</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-reveal-up {
          animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* --- Theme Assets Infrastructure --- */
        .theme-assets-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .dark-assets, .light-assets {
          position: absolute;
          inset: 0;
          transition: opacity 0.8s ease;
        }

        /* Elements are now conditionally rendered in JSX to prevent ghosting artifacts */

        /* --- Dark Mode: Cyber Neon --- */
        .mesh-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(var(--card-border) 1px, transparent 1px), 
                            linear-gradient(90deg, var(--card-border) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.05;
          transform: perspective(1000px) rotateX(60deg) translateY(-200px) scale(2);
          mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 70%);
        }

        .neon-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          animation: drift 20s infinite alternate ease-in-out;
        }

        .neon-1 { width: 600px; height: 600px; background: var(--accent); top: -200px; right: -100px; }
        .neon-2 { width: 400px; height: 400px; background: #3b82f6; bottom: -50px; left: -100px; animation-delay: -5s; }

        .float-node {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--accent);
          opacity: 0.3;
        }

        .node-1 { top: 20%; left: 15%; animation: floatNode 8s infinite linear; }
        .node-2 { bottom: 30%; right: 10%; animation: floatNode 12s infinite linear reverse; }

        @keyframes floatNode {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }

        /* --- Light Mode: Premium Studio --- */
        .studio-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.08;
          animation: drift 25s infinite alternate ease-in-out;
        }

        .studio-1 { width: 500px; height: 500px; background: #6366f1; top: 10%; left: -100px; }
        .studio-2 { width: 400px; height: 400px; background: #8b5cf6; bottom: 20%; right: -50px; animation-delay: -8s; }
        .studio-3 { width: 300px; height: 300px; background: #06b6d4; top: 40%; left: 30%; animation-delay: -12s; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
          100% { transform: translate(-30px, 50px) scale(1); }
        }

        /* --- Card Interactions --- */
        .premium-card {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        /* Dark Mode: Neon Shine */
        body:not(.light) .premium-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--accent);
          box-shadow: 0 0 30px rgba(0, 243, 255, 0.15);
        }

        /* Light Mode: Glass Depth */
        body.light .premium-card:hover {
          transform: translateY(-8px) scale(1.01);
          background: var(--background);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .premium-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 45%, rgba(255, 255, 255, 0.1) 50%, transparent 55%);
          background-size: 250% 250%;
          background-position: 100% 100%;
          transition: background-position 0.6s ease;
          pointer-events: none;
        }

        .premium-card:hover::before {
          background-position: 0% 0%;
        }

        .mobile-only { display: none; }
        .desktop-only { display: flex; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex; }
        }
      `}</style>
    </div>
  );
}

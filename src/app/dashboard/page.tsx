"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface ConnectedDevice {
    id: string;
    name: string;
    lastSeen: string;
    revoked: boolean;
}

interface UserData {
    email: string;
    pasarguardId: string | null;
    status: "active" | "disabled" | "expired" | "limited" | "inactive";
    plan: string;
    expiresAt: string | null;
    usage: {
        usedGB: number;
        limitGB: number | null;
    };
    subscriptionUrl: string | null;
    onlineCount: number;
    devices: ConnectedDevice[];
    createdAt: string;
}

interface ServerNode {
    name: string;
    address: string;
    port: number;
    status: string;
    message: string;
    ping: number;
    connectionType: string;
    xrayVersion: string;
    nodeVersion: string;
    uplinkGB: number;
    downlinkGB: number;
}

interface ServerStatusData {
    nodes: ServerNode[];
    protocols: string[];
    system: {
        onlineUsers: number;
        activeUsers: number;
        totalUsers: number;
        cpuUsage: number;
        memUsedPercent: number;
        incomingBandwidthGB: number;
        outgoingBandwidthGB: number;
        version: string;
    };
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [serverStatus, setServerStatus] = useState<ServerStatusData | null>(null);
    const [selectedNode, setSelectedNode] = useState<ServerNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        let isMounted = true;

        const fetchAllData = async (isInitial = false) => {
            try {
                const res = await fetch("/api/user/me");
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) setUser(data);

                    // Fetch Server Status in parallel
                    try {
                        const sRes = await fetch("/api/server/status");
                        if (sRes.ok && isMounted) {
                            setServerStatus(await sRes.json());
                        }
                    } catch (e) {
                        console.error("Failed to load server status", e);
                    }
                } else if (res.status === 401) {
                    window.location.href = "/auth/login";
                } else if (isInitial) {
                    if (isMounted) setUser(null);
                }
            } catch {
                if (isInitial && isMounted) setUser(null);
            } finally {
                if (isInitial && isMounted) setLoading(false);
            }
        };

        // Initial fetch
        fetchAllData(true);

        // Auto-refresh every 5 seconds
        const interval = setInterval(() => fetchAllData(false), 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const copyToClipboard = async (text: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

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

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "HESABIMI SİL") return;

        setIsDeleting(true);
        try {
            const res = await fetch("/api/user/me", { method: "DELETE" });
            if (res.ok) {
                window.location.href = "/";
            } else {
                alert("Hesap silinirken bir hata oluştu.");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error(error);
            alert("Hesap silinirken bir hata oluştu.");
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "var(--foreground-muted)", fontWeight: 500 }}>Initializing Security Context...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
                <div style={{ color: "var(--error)", fontWeight: 500 }}>Failed to load dashboard data.</div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>Sign Out</button>
            </div>
        );
    }

    const daysRemaining = user.expiresAt
        ? Math.max(0, Math.ceil((new Date(user.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

    const usagePercent = user.usage.limitGB ? Math.min(100, (user.usage.usedGB / user.usage.limitGB) * 100) : 0;
    const isUnlimited = user.usage.limitGB === null;

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

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <ThemeSwitcher />
                        <div style={{ width: "1px", height: "16px", background: "var(--card-border)" }} />
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", borderRadius: "6px" }}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: "1.5rem 0" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }} className="animate-fadeUp">

                    <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <h1 style={{ fontSize: "1.75rem" }}>Dashboard</h1>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{user.email}</p>
                    </div>

                    <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1rem"
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                    <span className="status-dot" style={{
                                        background: user.status === "active" ? "var(--success)" :
                                            user.status === "limited" ? "var(--warning)" :
                                                "var(--error)",
                                        width: "6px", height: "6px"
                                    }} />
                                    <span style={{ fontSize: "1rem", fontWeight: 600, textTransform: "capitalize" }}>
                                        {user.status === "active" ? "Active" :
                                            user.status === "limited" ? "Data Limit Reached" :
                                                user.status === "expired" ? "Subscription Expired" : "Payment Required"}
                                    </span>
                                </div>
                                <p style={{ fontSize: "0.8125rem" }}>
                                    {user.status === "active" || user.status === "limited"
                                        ? `${user.plan} • Node access valid for ${daysRemaining} days`
                                        : "Initialize payment to reactivate security infrastructure"
                                    }
                                </p>
                            </div>

                            {user.status !== "active" && user.status !== "limited" && (
                                <Link href="/billing" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.8125rem" }}>Reactivate Now</Link>
                            )}
                        </div>

                        <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--card-border)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <span style={{ color: "var(--foreground-muted)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Data Throughput</span>
                                <span style={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                                    {user.usage.usedGB.toFixed(2)} GB {isUnlimited ? 'Transferred' : `/ ${user.usage.limitGB?.toFixed(2)} GB`}
                                </span>
                            </div>
                            <div style={{ width: "100%", height: "4px", background: "var(--accent-soft)", borderRadius: "10px", overflow: "hidden" }}>
                                <div style={{
                                    width: `${isUnlimited ? 100 : usagePercent}%`,
                                    height: "100%",
                                    background: isUnlimited ? "var(--success)" : usagePercent > 90 ? "var(--error)" : "var(--foreground)",
                                    borderRadius: "10px",
                                    transition: "width 1s ease-in-out"
                                }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                        <div className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative", overflow: "hidden" }}>
                            {/* Decorative Background Element */}
                            <div style={{
                                position: "absolute",
                                top: "-20px",
                                right: "-20px",
                                width: "100px",
                                height: "100px",
                                background: "var(--accent-glow)",
                                filter: "blur(40px)",
                                opacity: 0.2,
                                zIndex: 0
                            }} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                                <div>
                                    <h2 style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Connection Link</h2>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }} />
                                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--success)" }}>Ready to Connect</span>
                                    </div>
                                </div>
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "12px",
                                    background: "var(--accent-soft)", display: "grid", placeItems: "center",
                                    border: "1px solid var(--card-border)"
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                </div>
                            </div>

                            {user.subscriptionUrl ? (
                                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    <div style={{
                                        padding: "1rem",
                                        background: "var(--background)",
                                        borderRadius: "12px",
                                        border: "1px solid var(--card-border)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.75rem"
                                    }}>
                                        <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", lineHeight: "1.5" }}>
                                            Use this link with client to establish your secure connection.
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(user.subscriptionUrl!)}
                                            style={{
                                                width: "100%",
                                                fontSize: "0.875rem",
                                                padding: "0.8rem",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "0.6rem",
                                                fontWeight: 700,
                                                background: copySuccess ? "var(--success)" : "var(--accent)",
                                                color: copySuccess ? "white" : "var(--background)",
                                                border: "none",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                boxShadow: copySuccess ? "0 4px 12px rgba(52, 211, 153, 0.2)" : "0 4px 12px var(--accent-glow)"
                                            }}
                                        >
                                            {copySuccess ? (
                                                <>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                    Copy Subscription Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: "2rem 0", color: "var(--foreground-muted)", fontSize: "0.875rem", position: "relative", zIndex: 1 }}>
                                    No active subscription link found.
                                </div>
                            )}
                        </div>

                        {/* Server Status */}
                        <div className="card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <h3 style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Servers Status</h3>
                                </div>
                                {serverStatus?.system?.version && (
                                    <span style={{ fontSize: "0.625rem", background: "var(--accent-soft)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                        v{serverStatus.system.version}
                                    </span>
                                )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {/* Nodes */}
                                {serverStatus?.nodes && serverStatus.nodes.length > 0 ? (
                                    serverStatus.nodes.map((node, i) => (
                                        <div key={i} onClick={() => setSelectedNode(node)} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            padding: "0.75rem 1rem",
                                            background: "var(--accent-soft)",
                                            borderRadius: "8px",
                                            border: "1px solid var(--card-border)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}>
                                            <div style={{
                                                width: "36px", height: "36px",
                                                borderRadius: "8px",
                                                background: node.status === "connected" ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                                                display: "grid", placeItems: "center",
                                                border: `1px solid ${node.status === "connected" ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)"}`
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={node.status === "connected" ? "var(--success)" : "var(--error)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
                                                </svg>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{node.name}</div>
                                                <div style={{ fontSize: "0.6875rem", color: "var(--foreground-muted)", fontFamily: "monospace" }}>{node.address}</div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                    <span className="status-dot" style={{
                                                        width: "6px", height: "6px",
                                                        background: node.status === "connected" ? "var(--success)" : "var(--error)",
                                                        animation: node.status === "connected" ? "pulse 2s infinite" : "none"
                                                    }} />
                                                    <span style={{
                                                        fontSize: "0.6875rem", fontWeight: 700,
                                                        color: node.status === "connected" ? "var(--success)" : "var(--error)",
                                                        textTransform: "uppercase"
                                                    }}>
                                                        {node.status === "connected" ? "Online" : "Offline"}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: "0.625rem", color: "var(--foreground-muted)", marginTop: "0.1rem" }}>
                                                    {node.ping >= 0 ? `${node.ping} ms` : "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: "1rem", textAlign: "center", color: "var(--foreground-muted)", fontSize: "0.8125rem" }}>
                                        {serverStatus ? "No nodes found" : "Loading nodes..."}
                                    </div>
                                )}

                                <div style={{ height: "1px", background: "var(--card-border)", opacity: 0.5 }} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                        <Link href="/billing" className="card" style={{ padding: "1rem", textAlign: "center", transition: "all 0.2s ease" }}>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)" }}>Billing</div>
                        </Link>
                        <Link href="/contact" className="card" style={{ padding: "1rem", textAlign: "center", transition: "all 0.2s ease" }}>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)" }}>Support</div>
                        </Link>
                    </div>

                    {/* Danger Zone */}
                    <div className="card" style={{
                        marginTop: "3rem",
                        padding: "2rem",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        background: "rgba(239, 68, 68, 0.05)",
                        borderRadius: "16px"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            <h3 style={{ fontSize: "1.25rem", color: "var(--error)", fontWeight: 700 }}>Tehlikeli Bölge</h3>
                        </div>

                        <div style={{ fontSize: "0.875rem", color: "var(--foreground)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                            <p style={{ marginBottom: "0.5rem" }}>Hesabınızı kalıcı olarak silmek üzeresiniz. Lütfen aşağıdaki uyarıları dikkatle okuyunuz:</p>
                            <ul style={{ paddingLeft: "1.5rem", color: "var(--foreground-muted)", marginBottom: "1rem" }}>
                                <li><strong>Tüm verileriniz (cihazlar, abonelik geçmişi ve hesabınız) geri dönüşü olmayacak şekilde tamamen yok edilecektir.</strong></li>
                                <li><strong>Ödediğiniz ücret ile almış olduğunuz aktif aboneliğin kalan süresi anında iptal edilecek ve kesinlikle <u>ücret iadesi yapılmayacaktır</u>.</strong></li>
                            </ul>
                            <p>Bu işlemin geri dönüşü yoktur. Devam etmek istediğinize eminseniz, lütfen aşağıdaki alana <strong style={{ color: "var(--error)" }}>HESABIMI SİL</strong> yazınız.</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
                            <input
                                type="text"
                                placeholder="HESABIMI SİL"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "8px",
                                    border: "1px solid var(--card-border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                    fontSize: "0.875rem",
                                    outline: "none",
                                    transition: "all 0.2s"
                                }}
                            />

                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation !== "HESABIMI SİL" || isDeleting}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    borderRadius: "8px",
                                    fontSize: "0.875rem",
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: deleteConfirmation === "HESABIMI SİL" && !isDeleting ? "pointer" : "not-allowed",
                                    background: deleteConfirmation === "HESABIMI SİL" ? "var(--error)" : "var(--accent-soft)",
                                    color: deleteConfirmation === "HESABIMI SİL" ? "white" : "var(--foreground-muted)",
                                    transition: "all 0.3s"
                                }}
                            >
                                {isDeleting ? "Siliniyor..." : "Hesabımı Kalıcı Olarak Sil"}
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* Node Detail Popup */}
            {selectedNode && (
                <div onClick={() => setSelectedNode(null)} style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    display: "grid", placeItems: "center",
                    zIndex: 100,
                    animation: "fadeIn 0.2s ease"
                }}>
                    <div onClick={(e) => e.stopPropagation()} style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "16px",
                        padding: "2rem",
                        maxWidth: "420px",
                        width: "90vw",
                        animation: "fadeIn 0.2s ease"
                    }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "10px",
                                    background: selectedNode.status === "connected" ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                                    display: "grid", placeItems: "center",
                                    border: `1px solid ${selectedNode.status === "connected" ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)"}`
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selectedNode.status === "connected" ? "var(--success)" : "var(--error)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: "1.125rem", fontWeight: 700 }}>{selectedNode.name}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                        <span className="status-dot" style={{ width: "6px", height: "6px", background: selectedNode.status === "connected" ? "var(--success)" : "var(--error)", animation: selectedNode.status === "connected" ? "pulse 2s infinite" : "none" }} />
                                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: selectedNode.status === "connected" ? "var(--success)" : "var(--error)", textTransform: "uppercase" }}>
                                            {selectedNode.status === "connected" ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedNode(null)} style={{ background: "none", border: "none", color: "var(--foreground-muted)", cursor: "pointer", padding: "0.5rem" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div style={{ background: "var(--accent-soft)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                                <div style={{ fontSize: "0.625rem", color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>IP Address</div>
                                <div style={{ fontSize: "0.8125rem", fontWeight: 600, fontFamily: "monospace" }}>{selectedNode.address}</div>
                            </div>
                            <div style={{ background: "var(--accent-soft)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                                <div style={{ fontSize: "0.625rem", color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Port</div>
                                <div style={{ fontSize: "0.8125rem", fontWeight: 600, fontFamily: "monospace" }}>{selectedNode.port}</div>
                            </div>
                            <div style={{ background: "var(--accent-soft)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                                <div style={{ fontSize: "0.625rem", color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Ping</div>
                                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: selectedNode.ping >= 0 && selectedNode.ping < 200 ? "var(--success)" : "var(--error)" }}>{selectedNode.ping >= 0 ? `${selectedNode.ping} ms` : "Timeout"}</div>
                            </div>
                            <div style={{ background: "var(--accent-soft)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                                <div style={{ fontSize: "0.625rem", color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Connection</div>
                                <div style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase" }}>{selectedNode.connectionType}</div>
                            </div>
                        </div>

                        {/* Bandwidth */}
                        <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div style={{ background: "var(--accent-soft)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                                <div style={{ fontSize: "0.625rem", color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>↑ Upload</div>
                                <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{selectedNode.uplinkGB} GB</div>
                            </div>
                            <div style={{ background: "var(--accent-soft)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                                <div style={{ fontSize: "0.625rem", color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>↓ Download</div>
                                <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{selectedNode.downlinkGB} GB</div>
                            </div>
                        </div>

                        {/* Versions */}
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {selectedNode.xrayVersion && (
                                <span style={{ fontSize: "0.6875rem", background: "var(--background)", border: "1px solid var(--card-border)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 600 }}>Xray {selectedNode.xrayVersion}</span>
                            )}
                            {selectedNode.nodeVersion && (
                                <span style={{ fontSize: "0.6875rem", background: "var(--background)", border: "1px solid var(--card-border)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 600 }}>Node {selectedNode.nodeVersion}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

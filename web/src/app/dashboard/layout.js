"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard/farmer", label: "Farmer View" },
        { href: "/dashboard/processor", label: "Processor View" },
        { href: "/dashboard/admin", label: "Admin View" },
        { href: "/dashboard/consumer", label: "Consumer View" },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Basic Sidebar */}
            <aside style={{ width: "250px", background: "rgba(15, 23, 42, 0.8)", borderRight: "1px solid rgba(255, 255, 255, 0.1)", padding: "2rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "3rem", color: "#fff" }}>
                    🌿 Blocky Dashboard
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>← Back to Home</Link>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    color: isActive ? "#4ade80" : "var(--text-muted)",
                                    textDecoration: "none",
                                    fontWeight: isActive ? "bold" : "normal"
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
                {children}
            </main>
        </div>
    );
}

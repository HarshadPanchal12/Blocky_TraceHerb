export default function DashboardLayout({ children }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Basic Sidebar */}
            <aside style={{ width: "250px", background: "rgba(15, 23, 42, 0.8)", borderRight: "1px solid rgba(255, 255, 255, 0.1)", padding: "2rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "3rem", color: "#fff" }}>
                    🌿 Blocky Dashboard
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>← Back to Home</a>
                    <a href="/dashboard/farmer" style={{ color: "#4ade80", textDecoration: "none", fontWeight: "bold" }}>Farmer View</a>
                    <a href="/dashboard/processor" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Processor View</a>
                    <a href="/dashboard/admin" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Admin View</a>
                    <a href="/dashboard/consumer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Consumer View</a>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
                {children}
            </main>
        </div>
    );
}

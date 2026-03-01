"use client";

import CanvasBackground from "@/components/CanvasBackground";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Leaf, Wheat, Factory, ShieldCheck, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <>
      <CanvasBackground />
      <nav className="navbar glass-panel" style={{ borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: 0, position: "fixed", top: 0, width: "100%", zIndex: 100 }}>
        <div className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Leaf size={28} color="#4ade80" />
          Blocky TraceHerb
        </div>
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#features">Features</a>
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
              <button style={{ padding: '0.5rem 1rem', background: '#4ade80', color: '#020617', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Sign In / Sign Up
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textDecoration: 'none', color: 'white' }}>
              Go to Dashboard
            </a>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <main className="hero-section">
        <h1 className="hero-title">Traceability Meets<br />Blockchain & AI</h1>
        <p className="hero-subtitle">
          End-to-end transparency for agricultural and herbal products.
          A single source of truth connecting farmers, processors, and consumers.
        </p>
        <div className="button-group">
          <button className="btn-primary">Explore Platform</button>
          <button className="btn-outline">Verify a Product</button>
        </div>
      </main>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="content-section glass-panel" style={{ margin: "2rem auto", maxWidth: "1200px", padding: "4rem 2rem" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center", color: "#4ade80" }}>The Complete Ecosystem</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>

          <div className="role-card glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", textAlign: "center" }}>
            <div className="icon" style={{ background: "rgba(96, 165, 250, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "1rem" }}>
              <Wheat size={40} color="#60a5fa" />
            </div>
            <h3>Farmers</h3>
            <p style={{ color: "var(--text-muted)" }}>Voice-assisted onboarding. Build immutable reputation linked to your wallet.</p>
          </div>

          <div className="role-card glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", textAlign: "center" }}>
            <div className="icon" style={{ background: "rgba(167, 139, 250, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "1rem" }}>
              <Factory size={40} color="#a78bfa" />
            </div>
            <h3>Processors</h3>
            <p style={{ color: "var(--text-muted)" }}>Seamlessly link raw material batches to output SKUs. Full chain of custody.</p>
          </div>

          <div className="role-card glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", textAlign: "center" }}>
            <div className="icon" style={{ background: "rgba(248, 113, 113, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "1rem" }}>
              <ShieldCheck size={40} color="#f87171" />
            </div>
            <h3>Brands & Admins</h3>
            <p style={{ color: "var(--text-muted)" }}>API integrations to display verified product badges on e-commerce platforms.</p>
          </div>

          <div className="role-card glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", textAlign: "center" }}>
            <div className="icon" style={{ background: "rgba(74, 222, 128, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "1rem" }}>
              <Smartphone size={40} color="#4ade80" />
            </div>
            <h3>Consumers</h3>
            <p style={{ color: "var(--text-muted)" }}>Scan the code. Know the origins. No app installation required.</p>
          </div>

        </div>
      </section>
    </>
  );
}

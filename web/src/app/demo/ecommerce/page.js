"use client";

import { useState } from "react";

export default function MockEcommerce() {
    const [orderId, setOrderId] = useState("ORD-98765-AYU");
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        try {
            // In a real scenario, the user just clicks a button and the e-commerce site
            // securely queries our backend using their order ID.
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/verify/${orderId}`);
            if (response.ok) {
                const data = await response.json();
                setVerificationResult({ success: true, ...data });
            } else {
                setVerificationResult({ success: false, error: "Product not found or not verified on blockchain." });
            }
        } catch (err) {
            setVerificationResult({ success: false, error: "Failed to connect to verification server." });
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "sans-serif" }}>
            {/* Fake E-Commerce Navbar */}
            <nav style={{ background: "#ffffff", padding: "1rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ color: "#2563eb", fontWeight: "bold", fontSize: "1.5rem", margin: 0 }}>MegaCart India</h1>
                <div style={{ display: "flex", gap: "1.5rem", color: "#475569" }}>
                    <span>Categories</span>
                    <span>Orders</span>
                    <span>Cart (1)</span>
                </div>
            </nav>

            {/* Product Page */}
            <main style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                {/* Fake Product Image */}
                <div style={{ background: "#e2e8f0", borderRadius: "12px", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "4rem" }}>🌿💊</span>
                </div>

                {/* Product Details */}
                <div>
                    <span style={{ background: "#dbeafe", color: "#1e40af", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.875rem", fontWeight: "bold" }}>
                        Ayurvedic Premium
                    </span>
                    <h2 style={{ fontSize: "2.5rem", marginTop: "1rem", marginBottom: "0.5rem" }}>Organic Ashwagandha Root Powder</h2>
                    <p style={{ color: "#64748b", fontSize: "1.125rem", marginBottom: "2rem" }}>Sold by: NatureHeal Farms</p>

                    <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>₹ 499.00</div>

                    <button style={{ background: "#2563eb", color: "white", border: "none", padding: "1rem 2rem", fontSize: "1.125rem", borderRadius: "8px", width: "100%", cursor: "pointer", fontWeight: "bold", marginBottom: "3rem" }}>
                        Add to Cart
                    </button>

                    {/* Blocky TraceHerb Widget Integration */}
                    <div style={{ background: "#ffffff", border: "2px solid #4ade80", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(74, 222, 128, 0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                            <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                            <h3 style={{ margin: 0, color: "#166534" }}>Verified by Blocky TraceHerb</h3>
                        </div>
                        <p style={{ color: "#475569", marginBottom: "1rem", fontSize: "0.9rem" }}>
                            This product's supply chain is tracked on the blockchain. Enter your Order ID to see exactly where your batch came from.
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                style={{ flex: 1, padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            />
                            <button
                                onClick={handleVerify}
                                disabled={loading}
                                style={{ background: "#16a34a", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                            >
                                {loading ? "Verifying..." : "Verify Origin"}
                            </button>
                        </div>

                        {verificationResult && (
                            <div style={{ marginTop: "1.5rem", padding: "1rem", background: verificationResult.success ? "#f0fdf4" : "#fef2f2", borderRadius: "8px", border: `1px solid ${verificationResult.success ? "#bbf7d0" : "#fecaca"}` }}>
                                {verificationResult.success ? (
                                    <>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <p style={{ color: "#166534", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>✅ Blockchain Match Found!</p>
                                                <p style={{ color: "#15803d", fontSize: "0.9rem", margin: 0 }}>Linked Batch ID: <strong>{verificationResult.linked_batch_id}</strong></p>
                                            </div>
                                            {/* Phase 3.5: Trust Status Badge */}
                                            <div style={{ fontSize: "0.8rem", fontWeight: "bold", padding: "0.25rem 0.5rem", borderRadius: "99px", background: verificationResult.is_farmer_verified ? "#dcfce7" : "#fef08a", color: verificationResult.is_farmer_verified ? "#166534" : "#854d0e", border: `1px solid ${verificationResult.is_farmer_verified ? "#86efac" : "#fde047"}` }}>
                                                {verificationResult.is_farmer_verified ? "🛡️ Verified Farmer" : "⏳ Verification Pending"}
                                            </div>
                                        </div>
                                        <p style={{ color: "#15803d", fontSize: "0.85rem", margin: "1rem 0 0 0" }}>Matched on: {new Date(verificationResult.verified_on).toLocaleString()}</p>
                                        <a href={`/trace/${verificationResult.linked_batch_id}`} style={{ display: "block", marginTop: "1rem", color: "#16a34a", fontWeight: "bold", textDecoration: "none" }}>→ View Global Supply Chain Journey</a>
                                    </>
                                ) : (
                                    <p style={{ color: "#991b1b", margin: 0 }}>❌ {verificationResult.error}</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}

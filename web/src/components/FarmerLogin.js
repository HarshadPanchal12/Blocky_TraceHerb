"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FarmerLogin() {
    const [isConnecting, setIsConnecting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();
        if (!phoneNumber) return alert("Phone number is required");

        try {
            setIsConnecting(true);

            // Generate a deterministic or random "Virtual Wallet" based on phone number for the backend
            // In a real app, the backend would handle this mapping securely.
            // Here we send a hash or pseudo-address to act as their identifier.
            const virtualAddress = "0xVIRTUAL" + phoneNumber.replace(/\D/g, '').padEnd(33, '0');

            // Register/Login user in the FastAPI Cloud Backend
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: virtualAddress,
                    name: name || `Farmer_${phoneNumber.slice(-4)}`,
                    phone_number: phoneNumber,
                    role: "farmer"
                })
            });

            // Store the virtual address in local storage so the dashboard knows who is logged in
            localStorage.setItem("farmer_wallet", virtualAddress);
            setShowModal(false);
            router.push("/dashboard/farmer");
        } catch (err) {
            console.error(err);
            alert("Failed to login.");
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <>
            <button className="btn-outline" onClick={() => setShowModal(true)}>
                Farmer Login
            </button>

            {showModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.8)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ padding: "2rem", width: "100%", maxWidth: "400px", position: "relative" }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: "absolute", top: "10px", right: "15px", background: "none", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" }}
                        >
                            &times;
                        </button>
                        <h2 style={{ color: "#4ade80", marginBottom: "1.5rem", textAlign: "center" }}>🌾 Farmer Access</h2>
                        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem" }}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+91 99999 99999"
                                    required
                                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "none" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem" }}>Full Name (Optional)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ramesh Kumar"
                                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "none" }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isConnecting} style={{ marginTop: "1rem", width: "100%" }}>
                                {isConnecting ? "Logging in..." : "Continue with Phone"}
                            </button>
                            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "1rem" }}>
                                No blockchain wallet required. Gas fees are sponsored by Blocky TraceHerb.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

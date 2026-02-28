"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Camera, X, Upload, Unlock, History, ArrowRight, Leaf } from "lucide-react";

export default function ConsumerDashboard() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [purchases, setPurchases] = useState([]);
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isLoaded && user) {
            fetchConsumerData();
        }
    }, [isLoaded, user]);

    useEffect(() => {
        if (isScanning) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(async (decodedText) => {
                scanner.clear(); // stop scanning
                setIsScanning(false);
                await handleDetectedQR(decodedText);
            }, (err) => {
                // Ignore ongoing scan failures
            });

            return () => {
                scanner.clear().catch(e => console.error("Failed to clear scanner", e));
            };
        }
    }, [isScanning, router, user]);

    const handleDetectedQR = async (decodedText) => {
        try {
            // Try to extract batch ID if it's a full URL
            let batchId = decodedText;
            if (decodedText.includes('/trace/')) {
                batchId = decodedText.split('/trace/')[1];
            }

            // Clean up any potential whitespace from the QR string
            batchId = batchId.trim();

            // Log scan in backend
            if (user?.id) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/scans/record`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ consumer_id: user.id, batch_id: batchId })
                }).catch(console.error);
            }

            router.push(`/trace/${batchId}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const html5QrCode = new Html5Qrcode("hidden-qr-reader");
            const decodedText = await html5QrCode.scanFile(file, true);
            html5QrCode.clear();

            await handleDetectedQR(decodedText);
        } catch (err) {
            console.error("Error scanning file", err);
            alert("Could not detect a valid TraceHerb QR code in this image. Please ensure the code is clear and well-lit.");
        }

        // Reset input so the same file can be uploaded again if needed
        event.target.value = null;
    };

    const fetchConsumerData = async () => {
        setLoading(true);
        try {
            const [purchasesRes, scansRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/${user.id}/purchases`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/${user.id}/scans`)
            ]);

            if (purchasesRes.ok) setPurchases(await purchasesRes.json());
            if (scansRes.ok) setScans(await scansRes.json());
        } catch (error) {
            console.error("Failed to fetch consumer data", error);
        }
        setLoading(false);
    };

    if (!isLoaded || loading) return <div style={{ padding: "3rem", color: "white" }}>Loading Consumer Dashboard...</div>;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
            {/* Hidden div strictly for the Html5Qrcode file ingestion instance */}
            <div id="hidden-qr-reader" style={{ display: 'none' }}></div>

            {/* Header & Profile */}
            <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <img
                        src={user.imageUrl}
                        alt="Profile"
                        style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px solid #3b82f6" }}
                    />
                    <div>
                        <h1 style={{ color: "white", fontSize: "1.8rem", marginBottom: "0.25rem" }}>
                            {user.fullName || "Valued Consumer"}
                        </h1>
                        <p style={{ color: "#94a3b8" }}>{user.primaryEmailAddress?.emailAddress}</p>
                        <span style={{ display: "inline-block", marginTop: "0.5rem", padding: "0.25rem 0.75rem", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>
                            ECO-CONSCIOUS SHOPPER
                        </span>
                    </div>
                </div>
                <div style={{ textAlign: "right", display: "flex", gap: "0.5rem", flexDirection: "column", alignItems: "flex-end" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            onClick={() => setIsScanning(!isScanning)}
                            className="btn-primary"
                            style={{ background: "#3b82f6", padding: "0.75rem 1rem", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                        >
                            {isScanning ? <><X size={18} /> Cancel Camera</> : <><Camera size={18} /> Camera Scan</>}
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="btn-primary"
                            style={{ background: "#10b981", padding: "0.75rem 1rem", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                        >
                            <Upload size={18} /> Upload image
                        </button>
                    </div>

                    <SignOutButton>
                        <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#cbd5e1", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", marginTop: "0.5rem" }}>
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>

            {/* In-App Scanner Modal */}
            {isScanning && (
                <div className="glass-panel" style={{ marginBottom: "2rem", padding: "2rem", textAlign: "center" }}>
                    <h2 style={{ color: "#60a5fa", marginBottom: "1rem" }}>Scan TraceHerb QR Code</h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Point your camera at the product label to instantly trace its origins.</p>
                    <div id="qr-reader" style={{ width: "100%", maxWidth: "500px", margin: "0 auto", background: "white", borderRadius: "12px", overflow: "hidden" }}></div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>

                {/* Purchased Full Reports */}
                <div className="glass-panel" style={{ padding: "2rem" }}>
                    <h2 style={{ color: "#4ade80", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Unlock size={24} /> Unlocked Reports
                    </h2>
                    {purchases.length === 0 ? (
                        <p style={{ color: "#64748b", fontStyle: "italic" }}>You haven't unlocked any high-res premium reports yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {purchases.map((p, i) => (
                                <div key={i} onClick={() => router.push(`/trace/${p.batch_id}`)} style={{ display: "flex", gap: "1rem", background: "rgba(0,0,0,0.4)", padding: "1rem", borderRadius: "8px", cursor: "pointer", border: "1px solid rgba(74, 222, 128, 0.2)", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    {p.image_url ? (
                                        <img src={p.image_url} alt="Crop" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                                    ) : (
                                        <div style={{ width: "60px", height: "60px", background: "#1e293b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80" }}>
                                            <Leaf size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h4 style={{ color: "white", marginBottom: "0.25rem" }}>{p.crop_name}</h4>
                                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontFamily: "monospace" }}>{p.batch_id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Scan History */}
                <div className="glass-panel" style={{ padding: "2rem" }}>
                    <h2 style={{ color: "#fcd34d", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <History size={24} /> Recent Scans
                    </h2>
                    {scans.length === 0 ? (
                        <p style={{ color: "#64748b", fontStyle: "italic" }}>No scanning history found.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {scans.slice(0, 5).map((s, i) => (
                                <div key={i} onClick={() => router.push(`/trace/${s.batch_id}`)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.4)", padding: "1rem", borderRadius: "8px", cursor: "pointer", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                    <div>
                                        <p style={{ color: "#e2e8f0", fontSize: "0.9rem", fontFamily: "monospace", marginBottom: "0.25rem" }}>{s.batch_id}</p>
                                        <p style={{ color: "#64748b", fontSize: "0.8rem" }}>{new Date(s.scanned_at).toLocaleString()}</p>
                                    </div>
                                    <span style={{ color: "#fcd34d" }}><ArrowRight size={18} /></span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

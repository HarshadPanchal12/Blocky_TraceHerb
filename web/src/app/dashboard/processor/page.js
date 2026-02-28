"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Camera, X, Upload, ScanLine, FileEdit, CheckCircle2, Lock, Building2 } from "lucide-react";

export default function ProcessorDashboard() {
    const { user, isLoaded } = useUser();

    const router = useRouter();

    const [batchId, setBatchId] = useState("");
    const [stepDescription, setStepDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isLoaded && user) {
            // Reverted: Allow admin and other roles to view
        }
    }, [isLoaded, user, router]);

    useEffect(() => {
        if (isScanning) {
            const scanner = new Html5QrcodeScanner(
                "processor-qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(async (decodedText) => {
                scanner.clear(); // stop scanning
                setIsScanning(false);
                handleDetectedQR(decodedText);
            }, (err) => {
                // Ignore ongoing scan failures
            });

            return () => {
                scanner.clear().catch(e => console.error("Failed to clear scanner", e));
            };
        }
    }, [isScanning]);

    const handleDetectedQR = (decodedText) => {
        // Try to extract batch ID if it's a full URL
        let extractedId = decodedText;
        if (decodedText.includes('/trace/')) {
            extractedId = decodedText.split('/trace/')[1];
        }
        setBatchId(extractedId.trim());
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const html5QrCode = new Html5Qrcode("processor-hidden-qr");
            const decodedText = await html5QrCode.scanFile(file, true);
            html5QrCode.clear();

            handleDetectedQR(decodedText);
        } catch (err) {
            console.error("Error scanning file", err);
            setError("Could not detect a valid QR code in this image.");
        }

        event.target.value = null;
    };

    const submitProcessingStep = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/batches/process?processor_wallet=${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    batch_id: batchId,
                    processor_name: user?.firstName || "Partner Processing Unit",
                    step_description: stepDescription,
                    location: location
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(`✅ Step recorded on Polygon Blockchain! Tx Hash: ${data.tx_hash}`);
                setBatchId("");
                setStepDescription("");
                setLocation("");
            } else {
                setError(data.detail || "Failed to record step.");
            }
        } catch (err) {
            console.error(err);
            setError("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) return <div style={{ padding: "2rem", color: "white" }}>Loading context...</div>;

    // Check authorization basic check (actual enforcement is role-based)
    if (user?.publicMetadata?.role !== 'processor' && user?.publicMetadata?.role !== 'admin') {
        return (
            <div style={{ padding: "4rem 2rem", background: "#020617", minHeight: "100vh", color: "white", textAlign: "center" }}>
                <h1 style={{ color: "#ef4444" }}>Unauthorized Access</h1>
                <p>This dashboard is strictly restricted to certified Processing Partners.</p>
                <div style={{ marginTop: "2rem" }}>
                    <SignOutButton>
                        <button className="btn-outline">Switch Account</button>
                    </SignOutButton>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#020617", minHeight: "100vh", color: "white" }}>
            {/* Header */}
            <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(10px)" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#60a5fa", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Building2 size={24} /> Processor Control Center
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Welcome, {user.firstName || "Partner"} ({user.primaryEmailAddress?.emailAddress})</p>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ background: "rgba(96, 165, 250, 0.1)", color: "#60a5fa", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: "bold", border: "1px solid rgba(96, 165, 250, 0.2)" }}>
                        Verified Partner
                    </span>
                    <SignOutButton>
                        <button className="btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.9rem" }}>Sign Out</button>
                    </SignOutButton>
                </div>
            </header>

            <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>

                    {/* Scanner Column */}
                    <div>
                        <div className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <ScanLine size={20} color="#60a5fa" /> Incoming Batch Scanner
                            </h2>
                            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                                Scan the physical QR code on the arriving product sack.
                            </p>

                            {!isScanning ? (
                                <button
                                    className="btn-primary"
                                    style={{ width: "100%", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                                    onClick={() => { setError(null); setIsScanning(true); }}
                                >
                                    <Camera size={18} /> Start Camera Scan
                                </button>
                            ) : (
                                <button
                                    className="btn-outline"
                                    style={{ width: "100%", marginBottom: "1rem", borderColor: "#ef4444", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                                    onClick={() => setIsScanning(false)}
                                >
                                    <X size={18} /> Stop Camera
                                </button>
                            )}

                            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.5rem" }}>— or upload a picture —</p>
                                <button
                                    className="btn-outline"
                                    style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", width: "auto" }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <Upload size={16} /> Upload Waybill QR Image
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        {/* Scanner Div */}
                        {isScanning && (
                            <div className="glass-panel" style={{ padding: "1rem", borderRadius: "16px", background: "white" }}>
                                <div id="processor-qr-reader" style={{ width: "100%" }}></div>
                            </div>
                        )}
                        <div id="processor-hidden-qr" style={{ display: "none" }}></div>
                    </div>

                    {/* Data Entry Column */}
                    <div>
                        <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", position: "relative" }}>
                            <h2 style={{ fontSize: "1.5rem", color: "white", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <FileEdit size={24} color="#4ade80" /> Log Supply Chain Step
                            </h2>

                            {message && (
                                <div style={{ background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.2)", color: "#4ade80", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem", wordBreak: "break-all", display: "flex", gap: "0.5rem" }}>
                                    <CheckCircle2 size={18} /> {message}
                                </div>
                            )}

                            {error && (
                                <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                                    ⚠️ {error}
                                </div>
                            )}

                            <form onSubmit={submitProcessingStep}>
                                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Batch ID</label>
                                    <input
                                        type="text"
                                        placeholder="Scan QR or Enter BATCH-XXX"
                                        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                                        value={batchId}
                                        onChange={(e) => setBatchId(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Action Performed</label>
                                    <select
                                        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                                        value={stepDescription}
                                        onChange={(e) => setStepDescription(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled style={{ color: "black" }}>Select processing type...</option>
                                        <option value="Sorting & Cleaning" style={{ color: "black" }}>Sorting & Cleaning</option>
                                        <option value="Washing & Drying" style={{ color: "black" }}>Washing & Drying</option>
                                        <option value="Powdering / Extraction" style={{ color: "black" }}>Powdering / Extraction</option>
                                        <option value="Quality Testing" style={{ color: "black" }}>Quality Testing</option>
                                        <option value="Packaging & Sealing" style={{ color: "black" }}>Packaging & Sealing</option>
                                        <option value="Distribution Transit" style={{ color: "black" }}>Distribution Transit</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: "2.5rem" }}>
                                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Facility Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mumbai, Maharashtra"
                                        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ width: "100%", padding: "1rem", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                                    disabled={loading}
                                >
                                    {loading ? "Recording to Blockchain..." : <><Lock size={18} /> Append to Immutable Ledger</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

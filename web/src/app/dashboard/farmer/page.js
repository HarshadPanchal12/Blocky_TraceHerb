"use client";

import { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Trees, Mic, MicOff, BrainCircuit, ScanText, Globe, Key, Leaf, QrCode, ClipboardCopy, Lock, Hash, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "@clerk/nextjs";

export default function FarmerDashboard() {
    const { user, isLoaded } = useUser();
    const walletAddress = user?.id || "0xLoading";

    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [extractionLoading, setExtractionLoading] = useState(false);
    const [formData, setFormData] = useState({
        crop_name: "",
        quantity: "",
        location: "",
        gps_location: ""
    });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [mintedBatchId, setMintedBatchId] = useState("");
    const [txHash, setTxHash] = useState("");
    const recognitionRef = useRef(null);

    // Verification Request State
    const [verificationDoc, setVerificationDoc] = useState("");
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState("Unverified");
    const [verificationFeedback, setVerificationFeedback] = useState("");

    // Load existing verification status
    useEffect(() => {
        if (!user?.id) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/verification_status/${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status) setVerificationStatus(data.status);
                if (data.feedback) setVerificationFeedback(data.feedback);
            })
            .catch(console.error);
    }, [user?.id]);

    // Initialize Web Speech API
    const startRecording = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            alert("Speech Recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-IN"; // Indian English by default

        recognitionRef.current.onstart = () => setIsRecording(true);
        recognitionRef.current.onerror = (e) => {
            console.error("Speech error", e.error);
            if (e.error === 'not-allowed') {
                alert("Microphone access was denied. Please allow microphone permissions in your browser site settings.");
            }
            setIsRecording(false);
        };
        recognitionRef.current.onend = () => setIsRecording(false);

        recognitionRef.current.onresult = (event) => {
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscript((prev) => prev + " " + finalTranscript);
            }
        };

        recognitionRef.current.start();
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    };

    const handleExtract = async () => {
        if (!transcript) return;
        setExtractionLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/nlp/extract`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: transcript })
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({
                    crop_name: data.crop_name || "",
                    quantity: data.quantity || "",
                    location: data.location || ""
                });
            } else {
                alert("Failed to extract data using NLP.");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to AI Backend. Ensure the FastAPI server Python backend is running on port 8000.");
        }
        setExtractionLoading(false);
    };

    const handleGetLocation = (e) => {
        e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData({
                    ...formData,
                    gps_location: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
                });
            }, (err) => {
                alert("Please allow location access to verify origin.");
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setExtractionLoading(true);
        try {
            // Send to our FastAPI Gasless Relayer
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/batches/mint?owner_wallet=` + walletAddress, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    batch_id: "BATCH-" + Date.now().toString().slice(-6) + "-" + walletAddress.slice(2, 6).toUpperCase(),
                    gps_location: formData.gps_location || "Not Provided"
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Registered via Gasless Relayer:", data);
                setMintedBatchId(data.batch_id);
                setTxHash(data.tx_hash || "0xMockTransactionHashForInternalUseOnly");
                setRegistrationSuccess(true);
                // Phase 4: Show a mock transaction hash or success state
                alert("Batch successfully secured on the blockchain (Gas paid by Blocky Admin).");
            } else {
                const errData = await response.json();
                alert(`Error: ${errData.detail || 'Failed to mint'}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to Blockchain Relayer.");
        }
        setExtractionLoading(false);
    };

    return (
        <div className="glass-panel" style={{ padding: "3rem" }}>
            <h1 style={{ color: "#4ade80", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Trees size={32} /> Farmer Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>
                Welcome back. Use your voice to effortlessly register newly harvested batches to the blockchain.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

                {/* Voice Input Section */}
                <div className="glass-panel" style={{ padding: "2rem", background: "rgba(255,255,255,0.02)" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#60a5fa", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Mic size={20} /> Voice Registration
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                        Click the microphone and speak your details (e.g., "I just harvested 500 kilos of organic Turmeric in Pune").
                    </p>

                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                        <button
                            className={isRecording ? "btn-primary" : "btn-outline"}
                            onClick={isRecording ? stopRecording : startRecording}
                            style={{
                                backgroundColor: isRecording ? "#ef4444" : "transparent",
                                borderColor: isRecording ? "#ef4444" : "#cbd5e1",
                                color: isRecording ? "white" : "white",
                                display: "flex", alignItems: "center", gap: "0.5rem"
                            }}
                        >
                            {isRecording ? <><MicOff size={18} /> Stop Recording</> : <><Mic size={18} /> Start Recording</>}
                        </button>
                        <button className="btn-outline" onClick={() => setTranscript("")} disabled={!transcript}>Clear</button>
                    </div>

                    <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Your spoken text will appear here. You can also type directly..."
                        style={{ width: "100%", height: "120px", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid #334155", marginBottom: "1rem" }}
                    />

                    <button
                        className="btn-primary"
                        onClick={handleExtract}
                        disabled={!transcript || extractionLoading}
                        style={{ width: "100%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                    >
                        {extractionLoading ? <><BrainCircuit size={18} className="animate-pulse" /> AI Extracting Data...</> : <><ScanText size={18} /> Auto-Fill Form with AI</>}
                    </button>
                </div>

                {/* Structured Form Section */}
                <div className="glass-panel" style={{ padding: "2rem", background: "rgba(255,255,255,0.02)", border: "1px solid #4ade80" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#4ade80", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Leaf size={20} /> Extracted Blockchain Batch Data
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                        Review the AI-extracted data before committing it permanently to the blockchain ledger.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#86efac" }}>Crop/Herb Name</label>
                            <input
                                type="text"
                                value={formData.crop_name}
                                onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "none", outline: "none" }}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#86efac" }}>Quantity & Unit</label>
                            <input
                                type="text"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "none", outline: "none" }}
                            />
                        </div>
                        <div style={{ marginBottom: "2rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#86efac" }}>Harvest Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "none", outline: "none", marginBottom: "0.5rem" }}
                            />

                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <button onClick={handleGetLocation} className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }} type="button">
                                    <Globe size={14} /> Match GPS Location
                                </button>
                                <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{formData.gps_location || "Not matching"}</span>
                            </div>
                        </div>

                        {!registrationSuccess ? (
                            <button type="submit" className="btn-primary" style={{ width: "100%", fontWeight: "bold", background: "#f59e0b" }}>
                                🔗 Mint Batch to Blockchain
                            </button>
                        ) : (
                            <div style={{ marginTop: "1rem", padding: "1.5rem", background: "rgba(74, 222, 128, 0.1)", borderRadius: "8px", textAlign: "center", border: "1px solid #4ade80" }}>
                                <div style={{ color: "#4ade80", fontWeight: "bold", marginBottom: "1rem", fontSize: "1.1rem" }}>
                                    ✅ Successfully registered batch on Polygon!
                                </div>
                                <h3 style={{ marginBottom: "1rem", color: "#60a5fa", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <QrCode size={20} /> Success: Batch Minted on Polygon
                                </h3>
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                                    <Key size={14} color="#fcd34d" />
                                    Batch ID: <span style={{ color: "#f8fafc", fontFamily: "monospace" }}>{mintedBatchId}</span>
                                </p>
                                <p style={{ margin: "0.5rem 0 1rem", fontSize: "0.85rem", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                                    <Hash size={14} color="#fcd34d" />
                                    Transaction Hash: <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <Globe size={14} /> {txHash.slice(0, 6)}...{txHash.slice(-4)}
                                    </a>
                                </p>
                                <div style={{ background: "white", padding: "1rem", display: "inline-block", borderRadius: "8px", marginBottom: "1rem" }}>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/trace/${mintedBatchId}`}
                                        alt="Batch QR Code"
                                        style={{ width: 150, height: 150 }}
                                    />
                                </div>
                                <p style={{ marginTop: "1rem", color: "#cbd5e1", fontSize: "0.85rem" }}>
                                    Take a screenshot of this QR code to attach it to the batch sack for physical traceability.
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Verification Request Section */}
                <div className="glass-panel" style={{ padding: "2rem", background: "rgba(255,255,255,0.02)", gridColumn: "1 / -1", border: "1px solid #60a5fa" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#60a5fa" }}>🛡️ Official Profile Verification</h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                        Submit lab test reports, farm photos, or business licenses to get verified by Admin. Verified farmers get a trust badge on consumer scans!
                    </p>

                    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 300px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "8px", border: `1px solid ${verificationStatus === 'Approved' ? '#4ade80' : verificationStatus === 'Pending' ? '#f59e0b' : verificationStatus === 'Declined' ? '#ef4444' : '#334155'}` }}>
                                <span>Current Status: <strong style={{ color: verificationStatus === 'Approved' ? '#4ade80' : verificationStatus === 'Pending' ? '#f59e0b' : verificationStatus === 'Declined' ? '#ef4444' : 'white' }}>{verificationStatus}</strong></span>
                            </div>
                            {verificationFeedback && (
                                <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid #ef4444", borderRadius: "4px" }}>
                                    <p style={{ fontSize: "0.85rem", color: "#cbd5e1" }}><strong>Admin Feedback:</strong> {verificationFeedback}</p>
                                </div>
                            )}
                        </div>

                        <div style={{ flex: "1 1 400px" }}>
                            {verificationStatus !== 'Approved' && (
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setVerificationLoading(true);
                                    try {
                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/verify_request`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ farmer_id: user.id, document_url: verificationDoc })
                                        });
                                        if (res.ok) {
                                            setVerificationStatus("Pending");
                                            setVerificationFeedback("");
                                            alert("Verification requested successfully!");
                                        } else {
                                            alert("Failed to submit request.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Network error.");
                                    }
                                    setVerificationLoading(false);
                                }}>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#cbd5e1" }}>Link to Supporting Document or Photo</label>
                                    <input
                                        type="text"
                                        placeholder="https://example.com/my-lab-report.pdf"
                                        value={verificationDoc}
                                        onChange={(e) => setVerificationDoc(e.target.value)}
                                        required
                                        style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #334155", background: "rgba(0,0,0,0.5)", color: "white", marginBottom: "1rem", outline: "none" }}
                                    />
                                    <button type="submit" disabled={verificationLoading || verificationStatus === 'Pending'} className="btn-primary" style={{ width: "100%", background: "#3b82f6" }}>
                                        {verificationLoading ? "Submitting..." : verificationStatus === 'Pending' ? "Request in Review..." : "Submit for Admin Review"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

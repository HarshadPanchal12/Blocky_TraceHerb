"use client";

import { useEffect, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { addAdminByEmail } from "./actions";
import { ShieldAlert, Users, FileText, CheckCircle, XCircle, Building2 } from "lucide-react";

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({});

    // Add Admin State
    const [isPending, startTransition] = useTransition();
    const [adminMessage, setAdminMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (isLoaded && user) {
            // Strict Admin Check Restored
            if (user.publicMetadata?.role !== 'admin') {
                router.push('/dashboard');
                return;
            }
            fetchRequests();
        }
    }, [isLoaded, user, router]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/admin/verification_requests`);
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const updateRequestStatus = async (requestId, status, adminFeedback) => {
        if (status === "Declined" && !adminFeedback) {
            alert("Feedback is required when declining a request.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/admin/verification_requests/${requestId}/review?status=${status}&feedback=${encodeURIComponent(adminFeedback || "")}`, {
                method: "POST"
            });
            if (res.ok) {
                alert(`Request ${status} successfully.`);
                fetchRequests();
            } else {
                alert("Failed to update request.");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server.");
        }
    };

    const handleAddAdmin = async (formData) => {
        setAdminMessage({ type: '', text: '' });
        startTransition(async () => {
            const result = await addAdminByEmail(formData);
            if (result?.error) {
                setAdminMessage({ type: 'error', text: result.error });
            } else if (result?.success) {
                setAdminMessage({ type: 'success', text: result.success });
                formData.set("email", ""); // Clear input visually if possible, though Native form reset is better
            }
        });
    };

    if (!isLoaded || loading) return <p style={{ color: "white", padding: "2rem" }}>Loading Admin Portal...</p>;

    return (
        <div className="glass-panel" style={{ padding: "3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
                <div>
                    <h1 style={{ color: "#f87171", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <ShieldAlert size={28} /> Admin Verification Portal
                    </h1>
                    <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>
                        Review and approve official farmer profiles.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/processor')}
                        style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                        <Building2 size={20} /> Access Processor Portal
                    </button>
                </div>

                {/* --- Add New Admin Feature --- */}
                <div style={{ background: "rgba(0,0,0,0.5)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", minWidth: "350px" }}>
                    <h3 style={{ color: "white", marginBottom: "1rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Users size={20} color="#60a5fa" /> Modify User Role
                    </h3>
                    <form action={handleAddAdmin} style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter user's email address..."
                            required
                            style={{ padding: "0.75rem", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
                        />
                        <select name="role" required style={{ padding: "0.75rem", borderRadius: "6px", background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.2)", color: "white", appearance: "none" }}>
                            <option value="admin">Admin</option>
                            <option value="processor">Processor</option>
                        </select>
                        <button type="submit" disabled={isPending} style={{ padding: "0.75rem", background: "#f87171", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: isPending ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
                            {isPending ? "Updating..." : "Update Role"}
                        </button>
                    </form>
                    {adminMessage.text && (
                        <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: adminMessage.type === 'error' ? '#ef4444' : '#4ade80' }}>
                            {adminMessage.text}
                        </p>
                    )}
                </div>
            </div>

            {requests.length === 0 ? (
                <div style={{ padding: "2rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", textAlign: "center", marginTop: "2rem" }}>
                    <p style={{ color: "#cbd5e1" }}>No verification requests at this time.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
                    {requests.map((req) => (
                        <div key={req.id} style={{ padding: "1.5rem", background: "rgba(0,0,0,0.4)", borderRadius: "8px", border: `1px solid ${req.status === 'Approved' ? '#4ade80' : req.status === 'Declined' ? '#ef4444' : '#334155'}`, display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 300px" }}>
                                <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>{req.farmer_name}</div>
                                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1rem" }}>ID: {req.farmer_id}</div>
                                <div style={{ marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "0.85rem", color: "#cbd5e1", marginRight: "0.5rem" }}>Status:</span>
                                    <strong style={{ color: req.status === 'Approved' ? '#4ade80' : req.status === 'Declined' ? '#ef4444' : '#f59e0b' }}>
                                        {req.status}
                                    </strong>
                                </div>
                                <a href={req.document_url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "0.9rem" }}>
                                    <FileText size={16} /> View Provided Document
                                </a>
                            </div>

                            {req.status === 'Pending' && (
                                <div style={{ flex: "1 1 300px", background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <h4 style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>Admin Action</h4>
                                    <textarea
                                        placeholder="Optional feedback (Required if declining)..."
                                        value={feedback[req.id] || ""}
                                        onChange={(e) => setFeedback({ ...feedback, [req.id]: e.target.value })}
                                        style={{ width: "100%", height: "80px", padding: "0.75rem", borderRadius: "4px", border: "1px solid #334155", background: "rgba(0,0,0,0.5)", color: "white", marginBottom: "1rem", outline: "none" }}
                                    />
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <button
                                            onClick={() => updateRequestStatus(req.id, "Approved", "Verified by Blocky TraceHerb Administration")}
                                            style={{ flex: 1, background: "#10b981", padding: "0.5rem", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateRequestStatus(req.id, "Declined", prompt("Reason for declining?"))}
                                            style={{ flex: 1, borderColor: "#ef4444", color: "#ef4444", padding: "0.5rem", background: "none", border: "1px solid", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                                        >
                                            <XCircle size={16} /> Decline
                                        </button>
                                    </div>
                                </div>
                            )}

                            {req.status !== 'Pending' && req.admin_feedback && (
                                <div style={{ flex: "1 1 300px" }}>
                                    <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Admin Feedback Left:</div>
                                    <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "4px", color: "#e2e8f0", fontSize: "0.9rem" }}>
                                        {req.admin_feedback}
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

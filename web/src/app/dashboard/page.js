import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function DashboardController() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    let role = user.publicMetadata?.role;
    const email = user.primaryEmailAddress?.emailAddress;

    if (role) {
        if (role === 'admin') redirect('/dashboard/admin');
        if (role === 'farmer') redirect('/dashboard/farmer');
        if (role === 'consumer') redirect('/dashboard/consumer');
        if (role === 'processor') redirect('/dashboard/processor');
    }

    // Server Action to update role
    async function selectRole(formData) {
        'use server';
        const selectedRole = formData.get('role');
        const user = await currentUser();
        if (!user) return;

        const email = user.primaryEmailAddress?.emailAddress;

        // Processor Whitelist Check
        if (selectedRole === 'processor') {
            const isPartnerDomain = email && (email.endsWith('@amazon.com') || email.endsWith('@partner.com'));
            const isTestEmail = email === 'harshadpanchal122006@gmail.com';

            if (!isPartnerDomain && !isTestEmail) {
                // Not authorized
                redirect('/dashboard?error=unauthorized_processor');
            }
        }

        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                role: selectedRole
            }
        });

        // Create the user profile in FastAPI backend
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: user.id, // We use Clerk ID instead of wallet
                    name: user.firstName || "Anonymous",
                    phone_number: user.primaryEmailAddress?.emailAddress || user.id,
                    role: selectedRole
                })
            });
        } catch (e) {
            console.error("Failed to sync Clerk User to FastAPI Backend", e);
        }

        revalidatePath('/dashboard');
        redirect(`/dashboard/${selectedRole}`);
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4ade80' }}>Welcome to Blocky TraceHerb</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>
                To get started, please tell us how you will be using the platform.
            </p>

            <form action={selectRole} style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
                <button
                    type="submit"
                    name="role"
                    value="farmer"
                    className="glass-panel"
                    style={{ cursor: 'pointer', padding: '3rem 1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</span>
                    <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>I am a Farmer</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Register new batches and request verification.</p>
                </button>
                <button
                    type="submit"
                    name="role"
                    value="processor"
                    className="glass-panel"
                    style={{ cursor: 'pointer', padding: '3rem 1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏭</span>
                    <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '0.5rem' }}>I am a Processor</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Record processing steps (Partners only).</p>
                </button>
                <button
                    type="submit"
                    name="role"
                    value="consumer"
                    className="glass-panel"
                    style={{ cursor: 'pointer', padding: '3rem 1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</span>
                    <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>I am a Consumer</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scan QR codes and trace product origins.</p>
                </button>
            </form>

            <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
                Admin accounts are provisioned separately.
            </p>
        </div>
    );
}

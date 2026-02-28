"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addAdminByEmail(formData) {
    const caller = await currentUser();
    if (!caller || caller.publicMetadata?.role !== 'admin') {
        return { error: "Unauthorized. Only admins can modify roles." };
    }

    const email = formData.get("email");
    const role = formData.get("role") || "admin";

    if (!email) return { error: "Email is required" };

    try {
        const client = await clerkClient();
        const users = await client.users.getUserList({ emailAddress: [email] });

        if (!users.data || users.data.length === 0) {
            return { error: "User not found. They must sign in to the platform at least once before they can be promoted." };
        }

        const targetUser = users.data[0];

        await client.users.updateUserMetadata(targetUser.id, {
            publicMetadata: { role: role }
        });

        // Also update our FastAPI backend if needed (optional for Admin, but good practice)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: targetUser.id,
                    name: targetUser.firstName || `${role} User`,
                    phone_number: email,
                    role: role
                })
            });
        } catch (e) {
            console.error(`Failed to sync new ${role} to backend.`, e);
        }

        revalidatePath("/dashboard/admin");
        return { success: `Successfully granted ${role.toUpperCase()} role to ${email}` };
    } catch (err) {
        console.error(err);
        return { error: "Internal server error occurred while promoting user." };
    }
}

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	// 1. Verify Supabase Session
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!
	);

	const authHeader = request.headers.get("Authorization");
	if (!authHeader) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const token = authHeader.replace("Bearer ", "");
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser(token);

	if (authError || !user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// 2. Get Discord ID from user metadata
	// Supabase stores provider info in user_metadata or identities
	const discordIdentity = user.identities?.find((id) => id.provider === "discord");
	const discordId = discordIdentity?.id;

	// Check for Legacy Session (Has metadata but no identity)
	if (!discordId && user.user_metadata.provider_id) {
		console.warn("Legacy session detected for user:", user.id);
		return NextResponse.json(
			{ action: "relogin", error: "Session upgrade required" },
			{ status: 200 } // Return 200 to let frontend handle it gracefully
		);
	}

	if (!discordId) {
		console.error("No Discord ID found for user:", user.id);
		return NextResponse.json({ error: "Discord account not linked" }, { status: 400 });
	}

	// 3. Fetch User Roles from Discord API
	const guildId = process.env.DISCORD_GUILD_ID;
	const botToken = process.env.DISCORD_BOT_TOKEN;
	const subscriberRoleId = process.env.DISCORD_SUBSCRIBER_ROLE_ID;

	if (!guildId || !botToken || !subscriberRoleId) {
		console.error("Missing Discord configuration");
		return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
	}

	try {
		const response = await fetch(
			`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`,
			{
				headers: {
					Authorization: `Bot ${botToken}`,
				},
			}
		);

		if (!response.ok) {
			console.error("Discord API Error:", response.status, await response.text());
			// If user is not in the guild, they are a guest
			if (response.status === 404) {
				await updateUserProfile(supabase, user.id, "Misafir", 1, user.user_metadata);
				return NextResponse.json({ role: "Misafir", multiplier: 1 });
			}
			return NextResponse.json({ error: "Failed to fetch Discord roles" }, { status: 500 });
		}

		const memberData = await response.json();
		const roles = memberData.roles as string[];

		// 4. Determine Role and Multiplier
		const isSubscriber = roles.includes(subscriberRoleId);
		const newRole = isSubscriber ? "Abone" : "Üye";
		const newMultiplier = isSubscriber ? 2 : 1;

		// 5. Update Supabase Profile
		await updateUserProfile(supabase, user.id, newRole, newMultiplier, user.user_metadata);

		return NextResponse.json({ role: newRole, multiplier: newMultiplier });
	} catch (error) {
		console.error("Sync Error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

interface ProfileUpdates {
	id: string;
	role: string;
	multiplier: number;
	last_active_at: string;
	username?: string;
	avatar_url?: string;
}

interface UserMetadata {
	full_name?: string;
	name?: string;
	avatar_url?: string;
	picture?: string;
	[key: string]: unknown;
}

async function updateUserProfile(
	supabase: SupabaseClient,
	userId: string,
	role: string,
	multiplier: number,
	userMetadata?: UserMetadata
) {
	const updates: ProfileUpdates = {
		id: userId,
		role,
		multiplier,
		last_active_at: new Date().toISOString(),
	};

	if (userMetadata) {
		if (typeof userMetadata.full_name === "string" || typeof userMetadata.name === "string") {
			updates.username = userMetadata.full_name || userMetadata.name;
		}
		if (
			typeof userMetadata.avatar_url === "string" ||
			typeof userMetadata.picture === "string"
		) {
			updates.avatar_url = userMetadata.avatar_url || userMetadata.picture;
		}
	}

	const { error } = await supabase.from("profiles").upsert(updates);

	if (error) {
		console.error("Supabase Update Error:", error);
		throw error;
	}
}

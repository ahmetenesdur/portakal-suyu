"use server";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { createServerSupabase } from "@/lib/services/supabase/server";
import { DiscordUserData, ProfileUpdates } from "@/types/auth";

export async function syncDiscordRoles() {
	const supabase = await createServerSupabase();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return { error: "Unauthorized" };
	}

	// 2. Get Discord ID from user metadata
	const discordIdentity = user.identities?.find((id) => id.provider === "discord");
	const discordId = discordIdentity?.id;

	// Check for Legacy Session
	if (!discordId && user.user_metadata.provider_id) {
		return { action: "relogin", error: "Session upgrade required" };
	}

	if (!discordId) {
		return { error: "Discord account not linked" };
	}

	// 3. Fetch User Roles from Discord API
	const guildId = process.env.DISCORD_GUILD_ID;
	const botToken = process.env.DISCORD_BOT_TOKEN;
	const subscriberRoleId = process.env.DISCORD_SUBSCRIBER_ROLE_ID;
	const broadcasterId = process.env.DISCORD_BROADCASTER_ID;

	if (!guildId || !botToken || !subscriberRoleId) {
		console.error("Missing Discord configuration");
		return { error: "Server configuration error" };
	}

	// Create Admin Client for database updates
	const supabaseAdmin = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!
	);

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
			console.error("Discord API Error:", response.status);
			// If not in guild, set as Guest (no Discord user data available)
			if (response.status === 404) {
				await updateUserProfile(supabaseAdmin, user.id, "Misafir", 1);
				return { role: "Misafir", multiplier: 1 };
			}
			return { error: "Failed to fetch Discord roles" };
		}

		const memberData = await response.json();
		const roles = memberData.roles as string[];

		// Extract fresh user data from Discord API response
		const discordUser = memberData.user as DiscordUserData;

		// 4. Determine Role and Multiplier
		const isSubscriber = roles.includes(subscriberRoleId);
		const isBroadcaster = discordId === broadcasterId;

		const newRole = isBroadcaster ? "Yayıncı" : isSubscriber ? "Abone" : "Üye";

		const newMultiplier = isSubscriber ? 2 : 1;

		// 5. Update Supabase Profile with fresh Discord data
		await updateUserProfile(supabaseAdmin, user.id, newRole, newMultiplier, discordUser);

		return { role: newRole, multiplier: newMultiplier };
	} catch (error) {
		console.error("Sync Error:", error);
		return { error: "Internal Server Error" };
	}
}

async function updateUserProfile(
	supabase: SupabaseClient,
	userId: string,
	role: string,
	multiplier: number,
	discordUser?: DiscordUserData
) {
	const updates: ProfileUpdates = {
		id: userId,
		role,
		multiplier,
		last_active_at: new Date().toISOString(),
	};

	if (discordUser) {
		// Use username instead of global_name to avoid storing display names
		updates.username = discordUser.username;

		// Build Discord CDN avatar URL
		if (discordUser.avatar) {
			updates.avatar_url = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
		}
	}

	const { error } = await supabase.from("profiles").upsert(updates);

	if (error) {
		console.error("Supabase Update Error:", error);
		throw error;
	}
}

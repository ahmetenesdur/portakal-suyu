"use server";

const KICK_API_BASE = "https://api.kick.com/public/v1";
const KICK_OAUTH_URL = "https://id.kick.com/oauth/token";

interface KickChannelResponse {
	data?: Array<{
		stream?: {
			is_live: boolean;
		};
	}>;
}

export async function checkKickLiveStatus(username: string): Promise<boolean> {
	try {
		const clientId = process.env.KICK_CLIENT_ID;
		const clientSecret = process.env.KICK_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			console.warn("[KickLiveStatus] Missing API credentials in environment variables.");
			return false;
		}

		// 1. Get OAuth Token
		const tokenResponse = await fetch(KICK_OAUTH_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "client_credentials",
				client_id: clientId,
				client_secret: clientSecret,
			}),
			next: { revalidate: 3600 }, // Cache token for 1 hour
		});

		if (!tokenResponse.ok) {
			console.error(
				`[KickLiveStatus] OAuth token fetch failed. HTTP ${tokenResponse.status}`
			);
			return false;
		}

		const { access_token: accessToken } = await tokenResponse.json();

		// 2. Fetch Channel Status
		const channelResponse = await fetch(`${KICK_API_BASE}/channels?slug=${username}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			},
			next: { revalidate: 60 }, // Cache status for 60 seconds
		});

		if (!channelResponse.ok) {
			console.error(`[KickLiveStatus] Channel fetch failed. HTTP ${channelResponse.status}`);
			return false;
		}

		const channelData = (await channelResponse.json()) as KickChannelResponse;

		return channelData.data?.[0]?.stream?.is_live ?? false;
	} catch (error) {
		console.error("[KickLiveStatus] Unexpected error:", error);
		return false;
	}
}

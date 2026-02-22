"use server";

import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

import { getTurkeyDateString, getTurkeyWeekStart } from "@/lib/utils/date";
import { Profile } from "@/types/game";
import { LeaderboardDaily, LeaderboardMode, LeaderboardWeekly } from "@/types/leaderboard";

// Create a simple client for public data fetching without auth context
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LeaderboardItem =
	| (Partial<Profile> & { lifetime_score?: number })
	| LeaderboardDaily
	| LeaderboardWeekly;

export async function getCachedLeaderboard(timeframe: LeaderboardMode, limit: number = 50) {
	"use cache";
	cacheLife("minutes"); // Cache for default minutes (usually 60s or config dependent)
	cacheTag("leaderboard", `leaderboard-${timeframe}`);

	let query;

	if (timeframe === "daily") {
		query = supabase
			.from("leaderboard_daily")
			.select(
				"score, total_clicks, profiles!inner(id, username, avatar_url, role, multiplier)"
			)
			.eq("date", getTurkeyDateString())
			.gt("score", 0)
			.neq("profiles.role", "Misafir")
			.order("score", { ascending: false });
	} else if (timeframe === "weekly") {
		// Calculate Monday of current week in Turkey
		const mondayStr = getTurkeyWeekStart();

		query = supabase
			.from("leaderboard_weekly")
			.select(
				"score, total_clicks, profiles!inner(id, username, avatar_url, role, multiplier)"
			)
			.eq("week_start", mondayStr)
			.gt("score", 0)
			.neq("profiles.role", "Misafir")
			.order("score", { ascending: false });
	} else {
		query = supabase
			.from("profiles")
			.select("id, username, avatar_url, lifetime_score, role, multiplier, total_clicks")
			.gt("lifetime_score", 0)
			.neq("role", "Misafir")
			.order("lifetime_score", { ascending: false });
	}

	const { data, error } = await query.limit(limit + 1);

	if (error) {
		console.error("Error fetching leaderboard:", error);
		throw new Error("Failed to fetch leaderboard");
	}

	// Normalize data structure
	const mapLeaderboardItem = (item: LeaderboardItem) => {
		if (timeframe === "all") {
			const entry = item as Profile & {
				lifetime_score: number;
			};
			return {
				...entry,
				score: entry.lifetime_score, // Use lifetime_score for all-time
			};
		}
		// Flatten structure for daily/weekly
		const entry = item as LeaderboardDaily | LeaderboardWeekly;
		return {
			...(entry.profiles as Profile),
			score: entry.score,
			total_clicks: entry.total_clicks,
		};
	};

	const formattedData = (data || []).map(mapLeaderboardItem);

	return formattedData;
}

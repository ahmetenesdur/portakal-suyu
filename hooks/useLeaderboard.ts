import { useCallback, useEffect, useState } from "react";

import { GAME_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase";
import { getTurkeyDateString, getTurkeyWeekStart } from "@/lib/utils";

export interface LeaderboardEntry {
	username: string;
	avatar_url: string;
	score: number;
	total_clicks?: number;
	id: string;
}

export type LeaderboardMode = "daily" | "weekly" | "all";

export function useLeaderboard(mode: LeaderboardMode) {
	const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [supabase] = useState(() => createClient());

	const fetchLeaders = useCallback(async () => {
		try {
			let query;

			if (mode === "daily") {
				query = supabase
					.from("leaderboard_daily")
					.select("score, total_clicks, profiles!inner(id, username, avatar_url, role)")
					.eq("date", getTurkeyDateString());
			} else if (mode === "weekly") {
				query = supabase
					.from("leaderboard_weekly")
					.select("score, total_clicks, profiles!inner(id, username, avatar_url, role)")
					.eq("week_start", getTurkeyWeekStart());
			} else {
				query = supabase
					.from("profiles")
					.select("id, username, avatar_url, lifetime_score, role, total_clicks");
			}

			const sortColumn = mode === "all" ? "lifetime_score" : "score";

			query = query
				.gt(sortColumn, 0)
				.neq(mode === "all" ? "role" : "profiles.role", "Misafir")
				.order(sortColumn, { ascending: false })
				.limit(3);

			const { data, error } = await query;

			if (error) throw error;

			if (data) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const formattedData = data.map((item: any) => {
					const raw = item;

					// All Time mode
					if (mode === "all") {
						return {
							id: raw.id,
							username: raw.username,
							avatar_url: raw.avatar_url,
							score: raw.lifetime_score,
							total_clicks: raw.total_clicks,
						};
					}

					// Daily/Weekly mode
					const profile = Array.isArray(raw.profiles) ? raw.profiles[0] : raw.profiles;

					return {
						id: profile.id,
						username: profile.username,
						avatar_url: profile.avatar_url,
						score: raw.score,
						total_clicks: raw.total_clicks,
					};
				});
				setLeaders(formattedData);
			}
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
		} finally {
			setLoading(false);
		}
	}, [mode, supabase]);

	useEffect(() => {
		fetchLeaders();

		const interval = setInterval(fetchLeaders, GAME_CONFIG.REFRESH_INTERVALS.LEADERBOARD);

		return () => clearInterval(interval);
	}, [fetchLeaders]);

	return { leaders, loading };
}

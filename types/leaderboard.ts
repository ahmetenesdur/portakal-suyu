import { Profile } from "./game";

export interface LeaderboardDaily {
	date: string;
	user_id: string;
	score: number;
	total_clicks: number;
	profiles?: Profile; // Linked data
}

export interface LeaderboardWeekly {
	week_start: string;
	user_id: string;
	score: number;
	total_clicks: number;
	profiles?: Profile; // Linked data
}

export type LeaderboardMode = "daily" | "weekly" | "all";

export interface Profile {
	id: string;
	username: string | null;
	avatar_url: string | null;
	role: string | null;
	multiplier: number;
	score: number;
	total_spent: number;
	base_power: number;
	total_clicks?: number;
	active_buffs: { id: string; expires_at: number; multiplier?: number }[];
}

export interface ShopItem {
	id: number;
	name: string;
	description: string | null;
	price: number;
	type: "upgrade" | "face" | "consumable";
	effect_value: number;
	tier?: number;
	required_item_id?: number;
	duration_minutes?: number;
	image_url: string | null;
	is_owned?: boolean; // Helper for UI
	is_locked?: boolean;
}

export interface InventoryItem {
	id: number;
	user_id: string;
	item_id: number;
	created_at: string;
}

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

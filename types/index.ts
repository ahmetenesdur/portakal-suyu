export interface Profile {
	id: string;
	username: string | null;
	avatar_url: string | null;
	role: string | null;
	multiplier: number;
	score: number;
}

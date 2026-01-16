import { User } from "@supabase/supabase-js";

import { Profile } from "./game";

export interface ProfileUpdates {
	id: string;
	role: string;
	multiplier: number;
	last_active_at: string;
	username?: string;
	avatar_url?: string;
}

export interface UserMetadata {
	full_name?: string;
	name?: string;
	avatar_url?: string;
	picture?: string;
	[key: string]: unknown;
}

export type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	signInWithDiscord: () => Promise<void>;
	signOut: () => Promise<void>;
	loading: boolean;
	unlockedFaceIndices: number[];
};

"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type Profile = {
	role: string;
	multiplier: number;
	score: number;
};

type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	signInWithDiscord: () => Promise<void>;
	signOut: () => Promise<void>;
	loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	const fetchProfile = useCallback(
		async (userId: string) => {
			const { data } = await supabase
				.from("profiles")
				.select("role, multiplier, score")
				.eq("id", userId)
				.single();

			if (data) {
				setProfile(data as Profile);
			}
		},
		[supabase]
	);

	const syncRoles = useCallback(async (sessionToken: string) => {
		try {
			const res = await fetch("/api/sync-roles", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${sessionToken}`,
				},
			});
			if (res.ok) {
				const data = await res.json();
				setProfile((prev) => (prev ? { ...prev, ...data } : data));
			}
		} catch (error) {
			console.error("Failed to sync roles:", error);
		}
	}, []);

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			setUser(session?.user ?? null);

			if (session?.user) {
				await fetchProfile(session.user.id);
				// Sync roles in background
				syncRoles(session.access_token);
			}

			setLoading(false);

			const {
				data: { subscription },
			} = supabase.auth.onAuthStateChange(async (_event, session) => {
				setUser(session?.user ?? null);
				if (session?.user) {
					await fetchProfile(session.user.id);
					syncRoles(session.access_token);
				} else {
					setProfile(null);
				}
			});

			return () => subscription.unsubscribe();
		};

		checkUser();
	}, [supabase.auth, fetchProfile, syncRoles]);

	const signInWithDiscord = useCallback(async () => {
		await supabase.auth.signInWithOAuth({
			provider: "discord",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	}, [supabase.auth]);

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setProfile(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, profile, signInWithDiscord, signOut, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

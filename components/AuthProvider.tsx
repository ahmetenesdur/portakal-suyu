"use client";

import { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { syncDiscordRoles } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase";
import { InventoryItem, Profile, ShopItem } from "@/types";

type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	signInWithDiscord: () => Promise<void>;
	signOut: () => Promise<void>;
	loading: boolean;
	unlockedFaceIndices: number[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [unlockedFaceIndices, setUnlockedFaceIndices] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [supabase] = useState(() => createClient());

	const fetchProfile = useCallback(
		async (userId: string) => {
			const { data } = await supabase
				.from("profiles")
				.select(
					"id, username, avatar_url, role, multiplier, score, total_spent, base_power, active_buffs"
				)
				.eq("id", userId)
				.single();

			if (data) {
				setProfile(data as Profile);
			}

			// Fetch Inventory for Faces
			const { data: inventoryData } = await supabase
				.from("user_inventory")
				.select(
					`
                    item_id,
                    shop_items!inner (
                        type,
                        effect_value
                    )
                `
				)
				.eq("user_id", userId)
				.eq("shop_items.type", "face");

			if (inventoryData) {
				type InventoryWithFace = InventoryItem & {
					shop_items: Pick<ShopItem, "type" | "effect_value"> | null;
				};

				const indices = (inventoryData as unknown as InventoryWithFace[])
					.map((item) => item.shop_items?.effect_value)
					.filter((val): val is number => val !== null && val !== undefined);
				setUnlockedFaceIndices(indices);
			}
		},
		[supabase]
	);

	const signOut = useCallback(async () => {
		await supabase.auth.signOut();
		setUser(null);
		setProfile(null);
	}, [supabase.auth]);

	const syncRoles = useCallback(async () => {
		try {
			const data = await syncDiscordRoles();

			if (data.error) {
				console.error("Failed to sync roles:", data.error);
				return;
			}

			// Handle Session Migration (Legacy -> Identity)
			if (data.action === "relogin") {
				console.log("Legacy session detected, forcing re-login...");
				await signOut();
				return;
			}

			// Optimistically update profile if valid data returned
			if (data.role) {
				setProfile((prev) => (prev ? { ...prev, ...data } : (data as unknown as Profile))); // Partial update safe here
			}
		} catch (error) {
			console.error("Failed to sync roles:", error);
		}
	}, [signOut]);

	useEffect(() => {
		let channel: ReturnType<typeof supabase.channel> | null = null;
		let authListener: { subscription: { unsubscribe: () => void } } | null = null;

		const initAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			setUser(session?.user ?? null);
			setLoading(true);

			if (session?.user) {
				await fetchProfile(session.user.id);
				syncRoles();

				// Initial Realtime Subscription
				channel = supabase
					.channel("realtime-profile")
					.on(
						"postgres_changes",
						{
							event: "UPDATE",
							schema: "public",
							table: "profiles",
							filter: `id=eq.${session.user.id}`,
						},
						(payload) => {
							setProfile((prev) =>
								prev ? { ...prev, ...payload.new } : (payload.new as Profile)
							);
						}
					)
					.subscribe();
			}

			setLoading(false);

			const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
				setUser(session?.user ?? null);
				if (session?.user) {
					await fetchProfile(session.user.id);
					syncRoles();

					// Re-subscribe Realtime if user changed
					if (channel) supabase.removeChannel(channel);
					channel = supabase
						.channel("realtime-profile")
						.on(
							"postgres_changes",
							{
								event: "UPDATE",
								schema: "public",
								table: "profiles",
								filter: `id=eq.${session.user.id}`,
							},
							(payload) => {
								setProfile((prev) =>
									prev ? { ...prev, ...payload.new } : (payload.new as Profile)
								);
							}
						)
						.subscribe();
				} else {
					setProfile(null);
					if (channel) supabase.removeChannel(channel);
					channel = null;
				}
			});
			authListener = data;
		};

		initAuth();

		return () => {
			if (authListener) authListener.subscription.unsubscribe();
			if (channel) supabase.removeChannel(channel);
		};
	}, [supabase, fetchProfile, syncRoles]);

	const signInWithDiscord = useCallback(async () => {
		await supabase.auth.signInWithOAuth({
			provider: "discord",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	}, [supabase.auth]);

	return (
		<AuthContext.Provider
			value={{
				user,
				profile,
				signInWithDiscord,
				signOut,
				loading,
				unlockedFaceIndices,
			}}
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

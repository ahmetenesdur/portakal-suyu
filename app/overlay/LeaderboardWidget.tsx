"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import NextImage from "next/image";
import { getTurkeyDateString, getTurkeyWeekStart } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface LeaderboardEntry {
	username: string;
	avatar_url: string;
	score: number;
	id: string;
}

export default function LeaderboardWidget() {
	const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [supabase] = useState(() => createClient());
	const searchParams = useSearchParams();
	const mode =
		(searchParams.get("lb_mode") as "daily" | "weekly" | "all") || "daily";

	const getTitle = () => {
		switch (mode) {
			case "weekly":
				return "Haftanın Liderleri";
			case "all":
				return "Tüm Zamanlar";
			default:
				return "Günün Liderleri";
		}
	};

	const fetchLeaders = async () => {
		try {
			let query;

			if (mode === "daily") {
				query = supabase
					.from("leaderboard_daily")
					.select(
						"score, profiles!inner(id, username, avatar_url, role)"
					)
					.eq("date", getTurkeyDateString());
			} else if (mode === "weekly") {
				query = supabase
					.from("leaderboard_weekly")
					.select(
						"score, profiles!inner(id, username, avatar_url, role)"
					)
					.eq("week_start", getTurkeyWeekStart());
			} else {
				// All Time
				query = supabase
					.from("profiles")
					.select("id, username, avatar_url, score, role");
			}

			// Common filters
			query = query
				.gt("score", 0)
				.neq(mode === "all" ? "role" : "profiles.role", "Misafir")
				.order("score", { ascending: false })
				.limit(3);

			const { data, error } = await query;

			if (error) throw error;

			if (data) {
				const formattedData = data.map(
					(item: {
						score: number;
						profiles?:
							| {
									id: string;
									username: string;
									avatar_url: string;
							  }
							| {
									id: string;
									username: string;
									avatar_url: string;
							  }[];
						id?: string;
						username?: string;
						avatar_url?: string;
					}) => {
						// Handle different data structures
						if (mode === "all") {
							const profileItem = item as {
								id: string;
								username: string;
								avatar_url: string;
								score: number;
							};
							return {
								id: profileItem.id,
								username: profileItem.username,
								avatar_url: profileItem.avatar_url,
								score: profileItem.score,
							};
						} else {
							// Daily/Weekly structure
							const itemWithProfile = item as {
								score: number;
								profiles:
									| {
											id: string;
											username: string;
											avatar_url: string;
									  }
									| {
											id: string;
											username: string;
											avatar_url: string;
									  }[];
							};

							const profile = Array.isArray(
								itemWithProfile.profiles
							)
								? itemWithProfile.profiles[0]
								: itemWithProfile.profiles;
							return {
								id: profile.id,
								username: profile.username,
								avatar_url: profile.avatar_url,
								score: itemWithProfile.score,
							};
						}
					}
				);
				setLeaders(formattedData);
			}
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLeaders();

		// Poll every 10 seconds to keep it fresh without heavy realtime subscription
		const interval = setInterval(fetchLeaders, 10000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode]);

	if (loading && leaders.length === 0) return null;
	if (leaders.length === 0) return null;

	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			className="fixed top-8 right-8 z-50 flex flex-col gap-3 w-72"
		>
			{/* Header */}
			<div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg transform -skew-x-6 self-end">
				<Icon
					icon="ph:trophy-fill"
					className="w-5 h-5 text-yellow-400 animate-pulse"
				/>
				<span className="text-white font-bold text-sm uppercase tracking-wider">
					{getTitle()}
				</span>
			</div>

			{/* List */}
			<motion.div
				className="flex flex-col gap-2"
				variants={{
					hidden: { opacity: 0 },
					show: {
						opacity: 1,
						transition: {
							staggerChildren: 0.1,
						},
					},
				}}
				initial="hidden"
				animate="show"
			>
				<AnimatePresence mode="popLayout">
					{leaders.map((leader, index) => (
						<motion.div
							key={leader.id}
							layoutId={leader.id}
							variants={{
								hidden: { opacity: 0, x: 20 },
								show: { opacity: 1, x: 0 },
							}}
							animate={{
								opacity: 1,
								x: 0,
								y: index === 0 ? [0, -2, 0] : 0, // Subtle float for #1
							}}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 30,
								y: {
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								},
							}}
							className={`relative flex items-center gap-3 p-3 rounded-xl border backdrop-blur-md shadow-lg overflow-hidden group bg-black/20 ${
								index === 0
									? "bg-linear-to-r from-yellow-500/60 to-orange-500/60 border-yellow-500/30"
									: index === 1
									? "bg-linear-to-r from-slate-300/40 to-slate-400/40 border-slate-300/20"
									: "bg-linear-to-r from-orange-800/40 to-amber-900/40 border-orange-800/20"
							}`}
						>
							{/* Rank Badge */}
							<div
								className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
									index === 0
										? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
										: index === 1
										? "bg-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.3)]"
										: "bg-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.3)]"
								}`}
							/>

							{/* Avatar */}
							<div className="relative w-10 h-10 shrink-0 ml-2">
								<NextImage
									src={
										leader.avatar_url ||
										`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.id}`
									}
									alt={leader.username}
									fill
									className={`rounded-full object-cover border-2 ${
										index === 0
											? "border-yellow-400"
											: index === 1
											? "border-slate-300"
											: "border-amber-700"
									}`}
								/>
								{/* Rank Icon */}
								<div className="absolute -top-2 -right-1">
									{index === 0 && (
										<Icon
											icon="ph:crown-fill"
											className="w-5 h-5 text-yellow-400 drop-shadow-md transform rotate-12"
										/>
									)}
									{index === 1 && (
										<Icon
											icon="ph:medal-fill"
											className="w-5 h-5 text-slate-300 drop-shadow-md transform rotate-12"
										/>
									)}
									{index === 2 && (
										<Icon
											icon="ph:medal-fill"
											className="w-5 h-5 text-amber-700 drop-shadow-md transform rotate-12"
										/>
									)}
								</div>
							</div>

							{/* Info */}
							<div className="flex flex-col min-w-0 flex-1">
								<span
									className={`font-bold text-sm truncate ${
										index === 0
											? "text-yellow-100"
											: index === 1
											? "text-slate-100"
											: "text-orange-100"
									}`}
								>
									{leader.username}
								</span>
								<span
									className={`text-xs font-mono font-bold ${
										index === 0
											? "text-yellow-200"
											: index === 1
											? "text-slate-300"
											: "text-orange-200"
									}`}
								>
									{new Intl.NumberFormat("tr-TR").format(
										leader.score
									)}{" "}
									lt
								</span>
							</div>

							{/* Shine Effect */}
							<motion.div
								className={`absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12`}
								animate={{
									x: ["-100%", "200%"],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatDelay: 3 + index, // Staggered shine
									ease: "easeInOut",
								}}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}

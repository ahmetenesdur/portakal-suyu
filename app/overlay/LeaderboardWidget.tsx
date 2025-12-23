"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase";
import { getTurkeyDateString, getTurkeyWeekStart } from "@/lib/utils";

interface LeaderboardEntry {
	username: string;
	avatar_url: string;
	score: number;
	total_clicks?: number;
	id: string;
}

export default function LeaderboardWidget() {
	const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [supabase] = useState(() => createClient());
	const searchParams = useSearchParams();
	const mode = (searchParams.get("lb_mode") as "daily" | "weekly" | "all") || "daily";

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
				const formattedData = data.map(
					(item: {
						score?: number;
						lifetime_score?: number;
						total_clicks?: number;
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
								lifetime_score: number; // Use lifetime score
								total_clicks: number;
							};
							return {
								id: profileItem.id,
								username: profileItem.username,
								avatar_url: profileItem.avatar_url,
								score: profileItem.lifetime_score, // Display lifetime score as 'score'
								total_clicks: profileItem.total_clicks,
							};
						} else {
							// Daily/Weekly structure
							const itemWithProfile = item as {
								score: number;
								total_clicks: number;
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

							const profile = Array.isArray(itemWithProfile.profiles)
								? itemWithProfile.profiles[0]
								: itemWithProfile.profiles;
							return {
								id: profile.id,
								username: profile.username,
								avatar_url: profile.avatar_url,
								score: itemWithProfile.score,
								total_clicks: itemWithProfile.total_clicks,
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
			className="fixed top-8 right-8 z-50 flex w-72 flex-col gap-3"
		>
			<div className="flex -skew-x-6 transform items-center gap-2 self-end rounded-xl border border-white/10 bg-black/60 px-4 py-2 shadow-lg backdrop-blur-xl">
				<Icon icon="ph:trophy-fill" className="h-5 w-5 animate-pulse text-yellow-400" />
				<span className="text-sm font-bold tracking-wider text-white uppercase">
					{getTitle()}
				</span>
			</div>

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
								y: index === 0 ? [0, -2, 0] : 0,
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
							className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border bg-black/20 p-3 shadow-lg backdrop-blur-md ${
								index === 0
									? "border-yellow-500/30 bg-linear-to-r from-yellow-500/60 to-orange-500/60"
									: index === 1
										? "border-slate-300/20 bg-linear-to-r from-slate-300/40 to-slate-400/40"
										: "border-orange-800/20 bg-linear-to-r from-orange-800/40 to-amber-900/40"
							}`}
						>
							<div
								className={`absolute top-1/2 -left-1 h-8 w-1 -translate-y-1/2 rounded-r-full ${
									index === 0
										? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
										: index === 1
											? "bg-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.3)]"
											: "bg-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.3)]"
								}`}
							/>

							<div className="relative ml-2 h-10 w-10 shrink-0">
								<NextImage
									src={
										leader.avatar_url ||
										`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.id}`
									}
									alt={leader.username}
									fill
									className={`rounded-full border-2 object-cover ${
										index === 0
											? "border-yellow-400"
											: index === 1
												? "border-slate-300"
												: "border-amber-700"
									}`}
								/>

								<div className="absolute -top-2 -right-1">
									{index === 0 && (
										<Icon
											icon="ph:crown-fill"
											className="h-5 w-5 rotate-12 transform text-yellow-400 drop-shadow-md"
										/>
									)}
									{index === 1 && (
										<Icon
											icon="ph:medal-fill"
											className="h-5 w-5 rotate-12 transform text-slate-300 drop-shadow-md"
										/>
									)}
									{index === 2 && (
										<Icon
											icon="ph:medal-fill"
											className="h-5 w-5 rotate-12 transform text-amber-700 drop-shadow-md"
										/>
									)}
								</div>
							</div>

							<div className="flex min-w-0 flex-1 flex-col">
								<span
									className={`truncate text-sm font-bold ${
										index === 0
											? "text-yellow-100"
											: index === 1
												? "text-slate-100"
												: "text-orange-100"
									}`}
								>
									{leader.username}
								</span>
								<div className="flex items-center gap-2">
									<span
										className={`font-mono text-xs font-bold ${
											index === 0
												? "text-yellow-200"
												: index === 1
													? "text-slate-300"
													: "text-orange-200"
										}`}
									>
										{new Intl.NumberFormat("tr-TR").format(leader.score)} lt
									</span>
									{leader.total_clicks && (
										<span className="text-[10px] font-medium text-white/50">
											•{" "}
											{new Intl.NumberFormat("tr-TR").format(
												leader.total_clicks
											)}{" "}
											Tık
										</span>
									)}
								</div>
							</div>

							<motion.div
								className={`absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent`}
								animate={{
									x: ["-100%", "200%"],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatDelay: 3 + index,
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

"use client";

import { createClient } from "@/lib/supabase";
import { Icon } from "@iconify/react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import InfoModal from "@/components/InfoModal";

import { Profile } from "@/types";
import { getTurkeyDateString, getTurkeyWeekStart } from "@/lib/utils";

export default function LeaderboardPage() {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);
	const [timeframe, setTimeframe] = useState<"all" | "weekly" | "daily">(
		"all"
	);
	const [limit, setLimit] = useState(50);
	const [hasMore, setHasMore] = useState(true);
	const { user } = useAuth();
	const [supabase] = useState(() => createClient());
	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function fetchLeaderboard() {
			setLoading(true);
			try {
				let query;

				if (timeframe === "daily") {
					query = supabase
						.from("leaderboard_daily")
						.select(
							"score, profiles!inner(id, username, avatar_url, role, multiplier)"
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
							"score, profiles!inner(id, username, avatar_url, role, multiplier)"
						)
						.eq("week_start", mondayStr)
						.gt("score", 0)
						.neq("profiles.role", "Misafir")
						.order("score", { ascending: false });
				} else {
					// All Time
					query = supabase
						.from("profiles")
						.select(
							"id, username, avatar_url, score, role, multiplier"
						)
						.gt("score", 0)
						.neq("role", "Misafir")
						.order("score", { ascending: false });
				}

				const { data, error } = await query
					.limit(limit + 1)
					.abortSignal(signal);

				if (error) throw error;

				if (data && data.length > limit) {
					setHasMore(true);
					// Normalize data structure
					const formattedData = data
						.slice(0, limit)
						.map((item: unknown) => {
							if (timeframe === "all") return item as Profile;
							// Flatten structure for daily/weekly
							const entry = item as {
								score: number;
								profiles: Profile;
							};
							return {
								...entry.profiles,
								score: entry.score,
							};
						});
					setProfiles(formattedData);
				} else {
					setHasMore(false);
					const formattedData = (data || []).map((item: unknown) => {
						if (timeframe === "all") return item as Profile;
						const entry = item as {
							score: number;
							profiles: Profile;
						};
						return {
							...entry.profiles,
							score: entry.score,
						};
					});
					setProfiles(formattedData);
				}
			} catch (error: unknown) {
				if (
					typeof error === "object" &&
					error !== null &&
					"name" in error &&
					(error as { name: string }).name !== "AbortError"
				) {
					console.error("Error fetching leaderboard:", error);
				}
			} finally {
				if (!signal.aborted) {
					setLoading(false);
				}
			}
		}

		fetchLeaderboard();

		return () => {
			controller.abort();
		};
	}, [supabase, timeframe, limit]);

	const getRankStyle = (rank: number) => {
		switch (rank) {
			case 1:
				return "text-yellow-500 drop-shadow-sm";
			case 2:
				return "text-gray-400 drop-shadow-sm";
			case 3:
				return "text-amber-700 drop-shadow-sm";
			default:
				return "text-orange-900/60";
		}
	};

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return "ph:crown-fill";
			case 2:
				return "ph:medal-fill";
			case 3:
				return "ph:medal-fill";
			default:
				return null;
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-start pb-16 relative overflow-hidden bg-orange-50">
			<Navbar onOpenInfo={() => setIsInfoModalOpen(true)} />
			<InfoModal
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
			/>

			{/* Background Elements */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-300/20 rounded-full blur-[120px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-300/20 rounded-full blur-[120px]" />
			</div>

			<div className="z-10 flex flex-col items-center justify-start flex-1 w-full max-w-4xl px-4 pt-8 md:pt-0">
				{/* Header Section */}
				<div className="relative mb-8 flex flex-col items-center text-center w-full">
					{/* Back Button - Desktop (Absolute Left) & Mobile (Top Left of Container) */}
					<Link
						href="/"
						className="absolute left-0 top-0 md:top-1/2 md:-translate-y-1/2 p-3 md:px-5 md:py-2.5 bg-white/40 hover:bg-white/60 text-orange-700 rounded-2xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 border border-white/50 backdrop-blur-md group flex items-center gap-2 z-20"
						title="Ana Sayfaya Dön"
					>
						<Icon
							icon="ph:arrow-left-bold"
							className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform"
						/>
						<span className="hidden md:inline font-bold text-lg">
							Geri
						</span>
					</Link>

					{/* Title Icon */}
					<div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-orange-100 to-white/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-orange-500/10 mb-6 border border-white/60 mt-12 md:mt-0">
						<Icon
							icon="ph:trophy-fill"
							className="w-10 h-10 text-orange-500 drop-shadow-sm"
						/>
					</div>

					<h1 className="text-4xl md:text-6xl font-black text-orange-900 mb-4 tracking-tight drop-shadow-sm">
						Liderlik Tablosu
					</h1>
					<p className="text-orange-800/70 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
						Portakal Vadisi&apos;nin en yetenekli sihirdarları.{" "}
						<br className="hidden md:block" />
						Zirveye çıkmak için daha çok portakal sık!
					</p>
				</div>

				{/* Timeframe Tabs */}
				<div className="flex justify-center mb-8">
					<div className="flex p-1 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm">
						{(["daily", "weekly", "all"] as const).map((t) => (
							<button
								key={t}
								onClick={() => {
									setTimeframe(t);
									setLimit(50);
								}}
								className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
									timeframe === t
										? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
										: "text-orange-800/60 hover:bg-white/50 hover:text-orange-800"
								}`}
							>
								{t === "daily"
									? "Günlük"
									: t === "weekly"
									? "Haftalık"
									: "Tüm Zamanlar"}
							</button>
						))}
					</div>
				</div>

				{/* Leaderboard Card */}
				<div className="w-full bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-orange-500/5 overflow-hidden">
					{/* Table Header */}
					<div className="grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-orange-100/50 bg-white/30 text-xs md:text-sm font-bold text-orange-900/50 uppercase tracking-wider">
						<div className="col-span-2 md:col-span-1 text-center">
							#
						</div>
						<div className="col-span-7 md:col-span-8">Sihirdar</div>
						<div className="col-span-3 text-right">Litre</div>
					</div>

					{/* List */}
					<div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
						{loading && profiles.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20 gap-4">
								<div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
								<span className="text-orange-800/50 font-medium animate-pulse">
									Sıralama yükleniyor...
								</span>
							</div>
						) : profiles.length === 0 ? (
							<div className="text-center py-20 text-orange-800/50 font-medium">
								Henüz kimse portakal suyu sıkmamış. İlk sen ol!
							</div>
						) : (
							<>
								{profiles.map((profile, index) => {
									const rank = index + 1;
									const isCurrentUser =
										user?.id === profile.id;
									const score = profile.score;

									return (
										<div
											key={profile.id}
											className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors border-b border-orange-50/50 last:border-0 ${
												isCurrentUser
													? "bg-orange-500/10 hover:bg-orange-500/15"
													: "hover:bg-white/40"
											}`}
										>
											{/* Rank */}
											<div className="col-span-2 md:col-span-1 flex justify-center">
												<div
													className={`font-black text-lg md:text-xl flex items-center justify-center w-8 h-8 ${getRankStyle(
														rank
													)}`}
												>
													{rank <= 3 ? (
														<Icon
															icon={
																getRankIcon(
																	rank
																)!
															}
															width="24"
															height="24"
														/>
													) : (
														rank
													)}
												</div>
											</div>

											{/* User */}
											<div className="col-span-7 md:col-span-8 flex items-center gap-3 md:gap-4">
												<div className="relative w-8 h-8 md:w-10 md:h-10 shrink-0">
													<NextImage
														src={
															profile.avatar_url ||
															`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
														}
														alt={
															profile.username ||
															"User"
														}
														fill
														sizes="(max-width: 768px) 32px, 40px"
														className={`rounded-full object-cover border-2 shadow-sm ${
															rank === 1
																? "border-yellow-400"
																: rank === 2
																? "border-gray-300"
																: rank === 3
																? "border-amber-600"
																: "border-white"
														}`}
													/>
													{rank <= 3 && (
														<div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
															<Icon
																icon="ph:star-fill"
																className="w-3 h-3 text-yellow-400"
															/>
														</div>
													)}
												</div>
												<div className="flex flex-col min-w-0">
													<span
														className={`font-bold text-sm md:text-base truncate ${
															isCurrentUser
																? "text-orange-700"
																: "text-orange-900"
														}`}
													>
														{profile.username ||
															"İsimsiz Sihirdar"}
														{isCurrentUser && (
															<span className="ml-2 text-[10px] bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded-full uppercase tracking-wide align-middle">
																Sen
															</span>
														)}
													</span>
													<span className="text-xs text-orange-800/40 font-medium truncate">
														{profile.role ||
															"Sihirdar"}
													</span>
												</div>
											</div>

											{/* Score */}
											<div className="col-span-3 text-right">
												<span
													className={`font-black text-sm md:text-lg tracking-tight ${
														rank <= 3
															? "text-orange-600"
															: "text-orange-900/60"
													}`}
												>
													{new Intl.NumberFormat(
														"tr-TR"
													).format(score)}
												</span>
											</div>
										</div>
									);
								})}
								{hasMore && (
									<div className="p-4 text-center">
										<button
											onClick={() =>
												setLimit((prev) => prev + 50)
											}
											disabled={loading}
											className="px-6 py-2 bg-orange-100 text-orange-700 rounded-xl font-bold hover:bg-orange-200 transition-colors disabled:opacity-50"
										>
											{loading
												? "Yükleniyor..."
												: "Daha Fazla Yükle"}
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}

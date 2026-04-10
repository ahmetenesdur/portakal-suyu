"use client";

import { Icon } from "@iconify/react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { getCachedLeaderboard } from "@/app/actions/leaderboard";
import { useAuth } from "@/components/AuthProvider";
import { Profile } from "@/types/game";
import { LeaderboardMode } from "@/types/leaderboard";

interface LeaderboardClientProps {
	initialData: Profile[];
	initialTimeframe: LeaderboardMode;
}

export default function LeaderboardClient({
	initialData,
	initialTimeframe,
}: LeaderboardClientProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [profiles, setProfiles] = useState<Profile[]>(initialData);
	const [loading, setLoading] = useState(false);
	const [limit, setLimit] = useState(50);
	const [hasMore, setHasMore] = useState(initialData.length >= 50);
	const failedAvatars = useRef<Set<string>>(new Set());

	const getAvatarSrc = (profile: Profile) => {
		if (failedAvatars.current.has(profile.id) || !profile.avatar_url) {
			const initial = (profile.username || "?")[0].toUpperCase();
			const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fed7aa"/><stop offset="100%" stop-color="%23fdba74"/></linearGradient></defs><rect width="80" height="80" rx="40" fill="url(%23g)"/><text x="40" y="40" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-weight="700" font-size="36" fill="%23c2410c">${initial}</text></svg>`;
			return `data:image/svg+xml,${svg}`;
		}
		return profile.avatar_url;
	};

	// Reset state when server data changes (navigation)
	useEffect(() => {
		setProfiles(initialData);
		setLimit(50);
		setHasMore(initialData.length >= 50);
		setLoading(false);
	}, [initialData]);

	const { user } = useAuth();
	// Pass initialTimeframe to local variable for UI consistency,
	// though actual switching is done via Link (URL)
	const timeframe = initialTimeframe;

	const handleLoadMore = async () => {
		setLoading(true);
		try {
			const newLimit = limit + 50;
			const data = await getCachedLeaderboard(timeframe, newLimit);

			if (data && data.length > newLimit) {
				setHasMore(true);
				setProfiles(data.slice(0, newLimit));
			} else {
				setHasMore(false);
				setProfiles(data);
			}
			setLimit(newLimit);
		} catch (error) {
			console.error("Error loading more:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleTimeframeChange = (newTimeframe: "daily" | "weekly" | "all") => {
		if (newTimeframe === timeframe) return;

		startTransition(() => {
			router.replace(`/leaderboard?timeframe=${newTimeframe}`);
		});
	};

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
		<div className="z-10 flex w-full max-w-4xl flex-1 flex-col items-center justify-start px-4 pt-8 md:pt-0">
			<div className="relative mb-8 flex w-full flex-col items-center text-center">
				{/* Back Button */}
				<Link
					href="/"
					className="group absolute top-0 left-0 z-20 flex items-center gap-2 rounded-2xl border border-white/50 bg-white/40 p-3 text-orange-700 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/60 hover:shadow-lg hover:shadow-orange-500/10 md:top-1/2 md:-translate-y-1/2 md:px-5 md:py-2.5"
					title="Ana Sayfaya Dön"
				>
					<Icon
						icon="lucide:arrow-left"
						className="h-5 w-5 transition-transform group-hover:-translate-x-1 md:h-6 md:w-6"
					/>
					<span className="hidden text-lg font-bold md:inline">Geri</span>
				</Link>

				<div className="mt-12 mb-6 inline-flex items-center justify-center rounded-3xl border border-white/60 bg-linear-to-br from-orange-100 to-white/50 p-4 shadow-xl shadow-orange-500/10 backdrop-blur-xl md:mt-0">
					<Icon
						icon="lucide:medal"
						className="h-10 w-10 text-orange-500 drop-shadow-sm"
					/>
				</div>

				<h1 className="mb-4 text-4xl font-black tracking-tight text-orange-900 drop-shadow-sm md:text-6xl">
					Liderlik Tablosu
				</h1>
				<p className="max-w-lg text-lg leading-relaxed font-medium text-orange-800/70 md:text-xl">
					Portakal Vadisi&apos;nin en yetenekli sihirdarları.{" "}
					<br className="hidden md:block" />
					Zirveye çıkmak için daha çok portakal sık!
				</p>
			</div>

			<div className="mb-8 flex justify-center">
				<div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/50 bg-white/30 p-1.5 shadow-sm backdrop-blur-md">
					{(["daily", "weekly", "all"] as const).map((t) => (
						<button
							key={t}
							onClick={() => handleTimeframeChange(t)}
							className={`flex cursor-pointer items-center justify-center rounded-xl px-6 py-2 text-sm font-bold transition-all ${
								timeframe === t
									? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
									: "text-orange-900/60 hover:scale-105 hover:bg-white/50 active:scale-95"
							}`}
						>
							{t === "daily" ? (
								"Günlük"
							) : t === "weekly" ? (
								"Haftalık"
							) : (
								<>
									<span className="md:hidden">Tümü</span>
									<span className="hidden md:inline">Tüm Zamanlar</span>
								</>
							)}
						</button>
					))}
				</div>
			</div>

			<div className="w-full overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-xl shadow-orange-500/5 backdrop-blur-xl">
				{/* Loading Overlay */}
				{isPending && (
					<div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
						<div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
					</div>
				)}

				<div
					className={`custom-scrollbar max-h-[60vh] w-full overflow-y-auto transition-opacity duration-200 ${
						isPending ? "opacity-30" : "opacity-100"
					}`}
				>
					<div className="sticky top-0 z-10 grid grid-cols-12 gap-4 border-b border-orange-100/50 bg-white/80 p-4 text-xs font-bold tracking-wider text-orange-900/50 uppercase backdrop-blur-md md:p-6 md:text-sm">
						<div className="col-span-2 text-center md:col-span-1">#</div>
						<div className="col-span-7 md:col-span-8">Sihirdar</div>
						<div className="col-span-3 text-right">Litre</div>
					</div>

					{profiles.length === 0 ? (
						<div className="py-20 text-center font-medium text-orange-800/50">
							Henüz kimse portakal suyu sıkmamış. İlk sen ol!
						</div>
					) : (
						<>
							{profiles.map((profile, index) => {
								const rank = index + 1;
								const isCurrentUser = user?.id === profile.id;
								const score = profile.score;

								return (
									<div
										key={profile.id}
										className={`grid grid-cols-12 items-center gap-4 border-b border-orange-50/50 p-4 transition-colors last:border-0 ${
											isCurrentUser
												? "bg-orange-500/10 hover:bg-orange-500/15"
												: "hover:bg-white/40"
										}`}
									>
										<div className="col-span-2 flex justify-center md:col-span-1">
											<div
												className={`flex h-8 w-8 items-center justify-center text-lg font-black md:text-xl ${getRankStyle(
													rank
												)}`}
											>
												{rank <= 3 ? (
													<Icon
														icon={getRankIcon(rank)!}
														width="24"
														height="24"
													/>
												) : (
													rank
												)}
											</div>
										</div>

										<div className="col-span-7 flex items-center gap-3 md:col-span-8 md:gap-4">
											<div className="relative h-8 w-8 shrink-0 md:h-10 md:w-10">
												<NextImage
													src={getAvatarSrc(profile)}
													alt={profile.username || "User"}
													fill
													unoptimized={failedAvatars.current.has(
														profile.id
													)}
													sizes="(max-width: 768px) 32px, 40px"
													onError={() => {
														failedAvatars.current.add(profile.id);
														setProfiles((prev) => [...prev]);
													}}
													className={`rounded-full border-2 object-cover shadow-sm ${
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
													<div className="absolute -top-1 -right-1 rounded-full bg-white p-0.5 shadow-sm">
														<Icon
															icon="ph:star-fill"
															className="h-3 w-3 text-yellow-400"
														/>
													</div>
												)}
											</div>
											<div className="flex min-w-0 flex-col">
												<span
													className={`truncate text-sm font-bold md:text-base ${
														isCurrentUser
															? "text-orange-700"
															: "text-orange-900"
													}`}
												>
													{profile.username || "İsimsiz Sihirdar"}
													{isCurrentUser && (
														<span className="ml-2 rounded-full bg-orange-200 px-1.5 py-0.5 align-middle text-[10px] tracking-wide text-orange-800 uppercase">
															Sen
														</span>
													)}
												</span>
												<span className="truncate text-xs font-medium text-orange-800/40">
													{profile.role || "Sihirdar"}
												</span>
											</div>
										</div>

										<div className="col-span-3 flex flex-col items-end justify-center text-right">
											<span
												className={`text-sm font-black tracking-tight md:text-lg ${
													rank <= 3
														? "text-orange-600"
														: "text-orange-900/60"
												}`}
											>
												{new Intl.NumberFormat("tr-TR").format(score)}
											</span>
											{profile.total_clicks && (
												<span className="text-[10px] font-semibold text-orange-900/30 md:text-xs">
													{new Intl.NumberFormat("tr-TR").format(
														profile.total_clicks
													)}{" "}
													Tık
												</span>
											)}
										</div>
									</div>
								);
							})}
							{hasMore && (
								<div className="p-4 text-center">
									<button
										onClick={handleLoadMore}
										disabled={loading}
										className="rounded-xl bg-orange-100 px-6 py-2 font-bold text-orange-700 transition-colors hover:bg-orange-200 disabled:opacity-50"
									>
										{loading ? "Yükleniyor..." : "Daha Fazla Yükle"}
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

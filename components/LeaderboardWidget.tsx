"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import { useSearchParams } from "next/navigation";

import { LeaderboardMode, useLeaderboard } from "../hooks/useLeaderboard";

const LEADERBOARD_STYLES = {
	0: {
		container: "border-yellow-500/30 bg-linear-to-r from-yellow-500/60 to-orange-500/60",
		bar: "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]",
		border: "border-yellow-400",
		icon: "text-yellow-400",
		text: "text-yellow-100",
		subText: "text-yellow-200",
	},
	1: {
		container: "border-slate-300/20 bg-linear-to-r from-slate-300/40 to-slate-400/40",
		bar: "bg-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.3)]",
		border: "border-slate-300",
		icon: "text-slate-300",
		text: "text-slate-100",
		subText: "text-slate-300",
	},
	2: {
		container: "border-orange-800/20 bg-linear-to-r from-orange-800/40 to-amber-900/40",
		bar: "bg-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.3)]",
		border: "border-amber-700",
		icon: "text-amber-700",
		text: "text-orange-100",
		subText: "text-orange-200",
	},
} as const;

export default function LeaderboardWidget() {
	const searchParams = useSearchParams();
	const mode = (searchParams.get("lb_mode") as LeaderboardMode) || "daily";

	const { leaders } = useLeaderboard(mode);

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

	if (leaders.length === 0) return null;

	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			className="fixed top-8 right-8 z-10 flex w-72 flex-col gap-3"
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
					{leaders.map((leader, index) => {
						// Get style for rank, fallback to rank 2 (generic bronze/orange) if > 2 (though limit is 3)
						const style =
							LEADERBOARD_STYLES[index as keyof typeof LEADERBOARD_STYLES] ||
							LEADERBOARD_STYLES[2];

						return (
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
								className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 shadow-lg backdrop-blur-md ${style.container}`}
							>
								<div
									className={`absolute top-1/2 -left-1 h-8 w-1 -translate-y-1/2 rounded-r-full ${style.bar}`}
								/>

								<div className="relative ml-2 h-10 w-10 shrink-0">
									<NextImage
										src={
											leader.avatar_url ||
											`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.id}`
										}
										alt={leader.username}
										fill
										className={`rounded-full border-2 object-cover ${style.border}`}
									/>

									<div className="absolute -top-2 -right-1">
										<Icon
											icon={index === 0 ? "ph:crown-fill" : "ph:medal-fill"}
											className={`h-5 w-5 rotate-12 transform drop-shadow-md ${style.icon}`}
										/>
									</div>
								</div>

								<div className="flex min-w-0 flex-1 flex-col">
									<span className={`truncate text-sm font-bold ${style.text}`}>
										{leader.username}
									</span>
									<div className="flex items-center gap-2">
										<span
											className={`font-mono text-xs font-bold ${style.subText}`}
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
									className="absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent"
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
						);
					})}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}

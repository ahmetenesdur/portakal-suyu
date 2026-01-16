"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

import { BUFF_DURATIONS, BUFF_ICONS, BUFF_THEMES } from "@/constants/buffs";

type Buff = {
	id: string;
	expires_at: number;
	multiplier?: number;
};

type BuffHUDProps = {
	activeBuffs: Buff[];
	currentBuffMultiplier: number;
	now: number;
};

function BuffItem({ buff, now }: { buff: Buff; now: number }) {
	const timeLeftSeconds = Math.max(0, (buff.expires_at - now) / 1000);
	const displaySeconds = Math.ceil(timeLeftSeconds);
	const m = Math.floor(displaySeconds / 60);
	const s = displaySeconds % 60;
	// Mobile: simpler time format (just seconds if <60? or Keep M:SS but small)
	const timeString = `${m}:${s.toString().padStart(2, "0")}`;

	const icon = BUFF_ICONS[buff.id.toString()] || "lucide:zap";

	const theme = BUFF_THEMES[buff.id.toString()] || {
		text: "text-yellow-400",
		bg: "bg-yellow-500/20",
		border: "border-yellow-500/20",
	};

	const isLowTime = displaySeconds < 10;

	const totalDuration = BUFF_DURATIONS[buff.id.toString()] || 60000;
	const percentage = Math.min(100, Math.max(0, ((buff.expires_at - now) / totalDuration) * 100));

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.8, y: 10 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
			className={`relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border border-orange-500/10 bg-orange-950/80 px-3 py-1.5 shadow-xl backdrop-blur-md md:gap-3 md:rounded-xl md:p-2 ${
				isLowTime ? "animate-pulse border-red-500/50" : ""
			}`}
		>
			<div
				className={`shrink-0 rounded-full p-1 md:rounded-lg md:p-2 ${theme.bg} border ${theme.border} ${theme.text}`}
			>
				<Icon icon={icon} className="h-4 w-4 md:h-5 md:w-5" />
			</div>

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-center justify-between gap-2">
					<span className={`text-[10px] font-black md:text-xs ${theme.text}`}>
						{buff.multiplier}x <span className="hidden md:inline">BOOST</span>
					</span>
					{/* Mobile Timer moved here for compactness */}
					<span className="font-mono text-[9px] leading-none text-white/50 tabular-nums md:hidden">
						{timeString}
					</span>
				</div>

				<div className="mt-1 hidden items-center gap-2 md:flex">
					<div className="h-1 w-full flex-1 overflow-hidden rounded-full bg-white/10">
						<motion.div
							initial={{ width: `${percentage}%` }}
							animate={{ width: "0%" }}
							transition={{
								duration: timeLeftSeconds,
								ease: "linear",
							}}
							className="h-full bg-white/50"
						/>
					</div>
					<span className="w-8 text-right font-mono text-[10px] text-white/50 tabular-nums">
						{timeString}
					</span>
				</div>
			</div>
		</motion.div>
	);
}

export default function BuffHUD({ activeBuffs, currentBuffMultiplier, now }: BuffHUDProps) {
	// Don't render anything if no buffs and no multiplier increase
	if (currentBuffMultiplier <= 1 && activeBuffs.length === 0) return null;

	return (
		<div className="pointer-events-none absolute -top-12 left-1/2 z-30 flex w-[120%] max-w-100 -translate-x-1/2 items-start justify-between transition-all duration-300 md:top-0 md:right-[-10rem] md:left-auto md:w-32 md:max-w-none md:translate-x-0 md:flex-col md:items-stretch md:justify-start md:gap-3">
			{/* Left Side (Mobile) / Top Item (Desktop) - Total Boost */}
			<div className="flex flex-col items-start gap-2 md:w-full md:items-stretch">
				<AnimatePresence mode="popLayout">
					{currentBuffMultiplier > 1 && (
						<motion.div
							layout
							initial={{ opacity: 0, scale: 0.8, x: -10 }}
							animate={{ opacity: 1, scale: 1, x: 0 }}
							exit={{ opacity: 0, scale: 0.8, x: -10 }}
							className="group relative flex shrink-0 items-center justify-between gap-2 overflow-hidden rounded-full border border-orange-500/30 bg-orange-950/60 px-2 py-1.5 shadow-2xl backdrop-blur-xl md:rounded-xl md:px-3 md:py-2"
						>
							<div className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-red-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
							<div className="relative z-10 flex w-full items-center gap-1.5 md:gap-2">
								<div className="shrink-0 rounded-full border border-orange-500/20 bg-orange-500/20 p-1 md:rounded-lg md:p-1.5">
									<Icon
										icon="lucide:biceps-flexed"
										className="h-3 w-3 text-orange-400 md:h-4 md:w-4"
									/>
								</div>
								<div className="flex flex-col leading-none">
									<span className="hidden text-[9px] font-bold tracking-widest text-orange-200/60 uppercase md:block">
										TOPLAM BOOST
									</span>
									<span className="text-xs font-black tracking-tight text-white tabular-nums md:text-sm">
										{currentBuffMultiplier.toFixed(1)}x
									</span>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Right Side (Mobile) / List (Desktop) - Active Buffs */}
			<div className="flex flex-col items-end gap-2 md:w-full md:items-stretch md:gap-3">
				<AnimatePresence mode="popLayout">
					{activeBuffs
						.filter((b) => b.expires_at > now)
						.sort((a, b) => a.expires_at - b.expires_at)
						.map((buff) => (
							<BuffItem key={`${buff.id}-${buff.expires_at}`} buff={buff} now={now} />
						))}
				</AnimatePresence>
			</div>
		</div>
	);
}

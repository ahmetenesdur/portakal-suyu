"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { BUFF_ICONS, BUFF_THEMES, BUFF_DURATIONS } from "@/lib/constants";

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
	const timeString = `${m}:${s.toString().padStart(2, "0")}`;

	const icon = BUFF_ICONS[buff.id.toString()] || "lucide:zap";

	const theme = BUFF_THEMES[buff.id.toString()] || {
		text: "text-yellow-400",
		bg: "bg-yellow-500/20",
		border: "border-yellow-500/20",
	};

	const isLowTime = displaySeconds < 10;

	const totalDuration = BUFF_DURATIONS[buff.id.toString()] || 60000;
	const percentage = Math.min(
		100,
		Math.max(0, ((buff.expires_at - now) / totalDuration) * 100)
	);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, x: 20, scale: 0.95 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
			transition={{ type: "spring", stiffness: 500, damping: 30 }}
			className={`relative flex items-center gap-3 p-2 bg-orange-950/80 backdrop-blur-md rounded-xl border border-orange-500/10 shadow-xl overflow-hidden ${
				isLowTime ? "border-red-500/50 animate-pulse" : ""
			}`}
		>
			<div
				className={`shrink-0 p-2 rounded-lg ${theme.bg} border ${theme.border} ${theme.text}`}
			>
				<Icon icon={icon} className="w-5 h-5 min-w-5 min-h-5" />
			</div>

			<div className="flex flex-col min-w-0 flex-1">
				<div className="flex items-center justify-between">
					<span className={`text-xs font-black ${theme.text}`}>
						{buff.multiplier}x BOOST
					</span>
				</div>

				<div className="flex items-center gap-2 mt-1">
					<div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex-1">
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
					<span className="text-[10px] font-mono text-white/50 w-8 text-right tabular-nums">
						{timeString}
					</span>
				</div>
			</div>
		</motion.div>
	);
}

export default function BuffHUD({
	activeBuffs,
	currentBuffMultiplier,
	now,
}: BuffHUDProps) {
	// Don't render anything if no buffs and no multiplier increase
	if (currentBuffMultiplier <= 1 && activeBuffs.length === 0) return null;

	return (
		<div className="absolute top-0 -right-35 flex flex-col gap-3 z-30 w-32 pointer-events-none">
			<AnimatePresence>
				{currentBuffMultiplier > 1 && (
					<motion.div
						layout
						initial={{ opacity: 0, scale: 0.8, x: -10 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						exit={{ opacity: 0, scale: 0.8, x: -10 }}
						className="relative flex items-center justify-between gap-2 px-3 py-2 bg-orange-950/60 backdrop-blur-xl rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden group"
					>
						<div className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="flex items-center gap-2 relative z-10 w-full">
							<div className="p-1.5 bg-orange-500/20 rounded-lg border border-orange-500/20 shrink-0">
								<Icon
									icon="lucide:biceps-flexed"
									className="w-4 h-4 text-orange-400"
								/>
							</div>
							<div className="flex flex-col leading-none">
								<span className="text-[9px] font-bold text-orange-200/60 uppercase tracking-widest">
									TOPLAM BOOST
								</span>
								<span className="text-sm font-black text-white tabular-nums tracking-tight">
									{currentBuffMultiplier.toFixed(1)}x
								</span>
							</div>
						</div>
					</motion.div>
				)}

				{activeBuffs
					.filter((b) => b.expires_at > now)
					.sort((a, b) => a.expires_at - b.expires_at)
					.map((buff) => (
						<BuffItem
							key={`${buff.id}-${buff.expires_at}`}
							buff={buff}
							now={now}
						/>
					))}
			</AnimatePresence>
		</div>
	);
}

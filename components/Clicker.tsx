"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useClickerGame } from "@/hooks/useClickerGame";

import { useAuth } from "./AuthProvider";
import BuffHUD from "./BuffHUD";
import OrangeCharacter from "./OrangeCharacter";

type ClickerProps = {
	onPop?: () => void;
	onShowLoginPrompt?: () => void;
};

export default function Clicker({ onPop, onShowLoginPrompt }: ClickerProps) {
	const { user, profile, unlockedFaceIndices } = useAuth(); // Consume unlockedFaceIndices

	const activeBuffs = profile?.active_buffs || [];

	// Combine default faces (0-6) with unlocked ones
	const allUnlockedFaces = [0, 1, 2, 3, 4, 5, 6, ...unlockedFaceIndices];

	// Consuming 'now' from the hook (Single Source of Truth)
	const {
		count,
		isLoading,
		clicks,
		particles,
		currentFace,
		clickAmount,
		handleGameClick,
		currentBuffMultiplier,
		now, // Using centralized timer
	} = useClickerGame({
		user,
		role: profile?.role ?? undefined,
		basePower: profile?.base_power || 1,
		activeBuffs: profile?.active_buffs || [],
		unlockedFaces: allUnlockedFaces,
	});

	const [localClicks, setLocalClicks] = useState(0);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onPop?.();
		handleGameClick(e);

		// Trigger prompt if user is not logged in OR is a guest (Misafir)
		if (!user || profile?.role === "Misafir") {
			const newClicks = localClicks + 1;
			setLocalClicks(newClicks);
			if (newClicks === 10) {
				onShowLoginPrompt?.();
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center gap-12">
			<div className="group relative">
				<OrangeCharacter currentFace={currentFace} onClick={handleClick} />

				<BuffHUD
					activeBuffs={activeBuffs}
					currentBuffMultiplier={currentBuffMultiplier}
					now={now}
				/>

				<AnimatePresence>
					{particles.map((p) => (
						<motion.div
							key={p.id}
							initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
							animate={{
								x: p.x + Math.cos(p.angle) * 100,
								y: p.y + Math.sin(p.angle) * 100 + 200, // Gravity effect
								scale: 0,
								opacity: 0,
							}}
							transition={{ duration: 0.6, ease: "easeOut" }}
							className="pointer-events-none absolute z-20 h-3 w-3 rounded-full bg-orange-400"
						/>
					))}
				</AnimatePresence>

				<AnimatePresence>
					{clicks.map((click) => (
						<motion.span
							key={click.id}
							initial={{
								opacity: 1,
								y: 0,
								scale: 0.5,
								rotate: -10,
							}}
							animate={{
								opacity: 0,
								y: -150,
								scale: 1.5,
								rotate: 10,
							}}
							exit={{ opacity: 0 }}
							className="pointer-events-none absolute z-50 text-5xl font-black text-white drop-shadow-[0_4px_0_rgba(234,88,12,1)] select-none"
							style={{ left: click.x, top: click.y }}
						>
							+{clickAmount}
						</motion.span>
					))}
				</AnimatePresence>
			</div>

			<div className="relative text-center">
				<div className="absolute inset-0 -z-10 rounded-full bg-white/50 blur-2xl" />
				<h2 className="mb-2 text-2xl font-bold tracking-widest text-orange-900/60">
					TOPLAM SIKILAN
				</h2>
				<div
					className="bg-linear-to-b from-orange-500 to-orange-700 bg-clip-text font-mono text-7xl font-black tracking-tight text-transparent drop-shadow-sm"
					aria-live="polite"
				>
					{isLoading ? (
						<div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
					) : (
						count.toLocaleString()
					)}
				</div>
				<p className="mt-2 text-lg font-medium text-orange-800/80">Litre Portakal Suyu</p>
			</div>
		</div>
	);
}

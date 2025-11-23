"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { useClickerGame } from "@/hooks/useClickerGame";
import OrangeCharacter from "./OrangeCharacter";

type ClickerProps = {
	onPop?: () => void;
};

export default function Clicker({ onPop }: ClickerProps) {
	const { user, profile } = useAuth();
	const multiplier = profile?.multiplier || 1;

	const {
		count,
		clicks,
		particles,
		currentFace,
		clickAmount,
		handleGameClick,
	} = useClickerGame({ user, multiplier });

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onPop?.();
		handleGameClick(e);
	};

	return (
		<div className="flex flex-col items-center justify-center gap-12">
			<div className="relative group">
				<OrangeCharacter
					currentFace={currentFace}
					onClick={handleClick}
				/>

				{/* Juice Particles */}
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
							className="absolute w-3 h-3 bg-orange-400 rounded-full pointer-events-none z-20"
						/>
					))}
				</AnimatePresence>

				{/* Click Effects (+1) */}
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
							className="absolute text-5xl font-black text-white pointer-events-none select-none drop-shadow-[0_4px_0_rgba(234,88,12,1)] z-50"
							style={{ left: click.x, top: click.y }}
						>
							+{clickAmount}
						</motion.span>
					))}
				</AnimatePresence>
			</div>

			{/* Counter */}
			<div className="text-center relative">
				<div className="absolute inset-0 bg-white/50 blur-2xl -z-10 rounded-full" />
				<h2 className="text-2xl font-bold text-orange-900/60 mb-2 tracking-widest">
					TOPLAM SIKILAN
				</h2>
				<div className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-b from-orange-500 to-orange-700 drop-shadow-sm font-mono tracking-tight">
					{count.toLocaleString()}
				</div>
				<p className="text-lg text-orange-800/80 mt-2 font-medium">
					Litre Portakal Suyu
				</p>
			</div>
		</div>
	);
}

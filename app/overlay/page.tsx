"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Snowfall from "react-snowfall";

import { GAME_CONFIG } from "@/lib/constants";

import LeaderboardWidget from "../../components/LeaderboardWidget";
import {
	FloatingParticles,
	GodRays,
	Sparkles,
	SplashBurst,
	WaveSVG,
} from "../../components/OverlayVisuals";
import { useOverlayStats } from "../../hooks/useOverlayStats";

function OverlayContent() {
	const [isClient, setIsClient] = useState(false);
	const searchParams = useSearchParams();
	const isTestMode = searchParams.get("test") === "true";

	const { count, showSpill, lastMilestoneUser, testActions } = useOverlayStats();

	const progress = ((count % GAME_CONFIG.GOAL) / GAME_CONFIG.GOAL) * 100;

	useEffect(() => {
		const timer = setTimeout(() => setIsClient(true), 0);
		return () => clearTimeout(timer);
	}, []);

	if (!isClient) return null; // Prevent hydration mismatch

	return (
		<div className="relative flex h-screen w-full flex-col items-start gap-4 overflow-hidden p-8 font-sans">
			<Snowfall
				snowflakeCount={GAME_CONFIG.PARTICLES.SNOWFLAKE_COUNT}
				radius={[0.5, 2.0]}
				speed={[0.5, 1.5]}
				wind={[-0.5, 1.0]}
				color="#fff"
				style={{
					position: "fixed",
					width: "100vw",
					height: "100vh",
					zIndex: 0,
				}}
			/>
			<style jsx global>{`
				@keyframes wave-slide {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
				.animate-wave-slide {
					animation: wave-slide ${GAME_CONFIG.ANIMATION.WAVE_DURATION}s linear infinite;
				}
			`}</style>

			{isTestMode && (
				<div className="fixed bottom-4 left-4 z-100 flex flex-col gap-2 rounded-xl border border-white/20 bg-black/80 p-4 text-white backdrop-blur-md">
					<h3 className="mb-2 font-bold text-orange-400">Test Controls</h3>
					<button
						onClick={testActions.testSpill}
						className="rounded bg-orange-600 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-orange-500"
					>
						Simulate Spill
					</button>
					<button
						onClick={testActions.testAdd}
						className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-blue-500"
					>
						Add 10 Liters
					</button>
					<button
						onClick={testActions.testReset}
						className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-red-500"
					>
						Reset
					</button>
				</div>
			)}

			<AnimatePresence>
				{showSpill && (
					<>
						{/* 0. Screen Shake Wrapper & Flash */}
						<motion.div
							className="pointer-events-none absolute inset-0 z-50"
							initial={{ x: 0, y: 0 }}
							animate={{
								x: [0, -20, 20, -10, 10, -5, 5, 0],
								y: [0, 10, -10, 5, -5, 0],
							}}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						>
							{/* Flash Impact */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: [0, 1, 0] }}
								transition={{
									duration: 0.3,
									times: [0, 0.1, 1],
								}}
								className="absolute inset-0 z-60 bg-white mix-blend-overlay"
							/>
						</motion.div>

						{/* 1. Rising Liquid Background (Parallax) */}
						<motion.div
							initial={{ y: "100%" }}
							animate={{ y: "0%" }}
							exit={{ y: "100%" }}
							transition={{
								duration: 0.8,
								ease: [0.22, 1, 0.36, 1],
							}} // Custom easing for "heavy" liquid feel
							className="absolute inset-0 z-40 flex flex-col justify-end"
						>
							<div
								className="animate-wave-slide absolute top-0 left-0 -mt-12 flex h-48 w-[200%] opacity-60"
								style={{
									animationDuration: `${GAME_CONFIG.ANIMATION.WAVE_DURATION}s`,
								}}
							>
								<WaveSVG />
								<WaveSVG />
							</div>

							<div className="animate-wave-slide relative z-10 -mb-1 flex h-32 w-[200%]">
								<WaveSVG />
								<WaveSVG />
							</div>

							<div className="relative z-10 w-full flex-1 overflow-hidden bg-orange-500">
								<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-size-[40px_40px] opacity-20" />
							</div>
						</motion.div>

						<GodRays />

						<div className="pointer-events-none absolute inset-0 z-50">
							<FloatingParticles count={GAME_CONFIG.PARTICLES.FLOATING_COUNT} />
						</div>

						<div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
							<SplashBurst />
						</div>

						<Sparkles />

						<motion.div
							initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
							animate={{ scale: 1, opacity: 1, rotate: -6 }}
							exit={{ scale: 1.5, opacity: 0 }}
							transition={{
								delay: 0.2,
								type: "spring",
								stiffness: 200,
								damping: 20,
							}}
							className="absolute inset-0 z-70 flex flex-col items-center justify-center gap-8"
						>
							<div className="group relative text-center">
								<h1 className="transform text-center text-9xl font-black tracking-tighter text-white italic drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
									HEDEF
									<br />
									<span className="relative inline-block text-yellow-300">
										TAMAMLANDI!
										<motion.span
											className="absolute inset-0 skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent"
											initial={{ x: "-100%" }}
											animate={{ x: "200%" }}
											transition={{
												repeat: Infinity,
												duration: 1.5,
												ease: "linear",
											}}
										/>
									</span>
								</h1>
							</div>

							{lastMilestoneUser && (
								<motion.div
									initial={{ opacity: 0, y: 50, scale: 0.8 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									transition={{ delay: 0.5, type: "spring" }}
									className="flex rotate-6 transform flex-col items-center gap-4 rounded-3xl border border-white/20 bg-black/40 p-6 shadow-2xl backdrop-blur-md"
								>
									<div className="relative">
										<div className="h-24 w-24 overflow-hidden rounded-full border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]">
											<Image
												src={
													lastMilestoneUser.avatar_url ||
													"https://api.dicebear.com/7.x/avataaars/svg?seed=" +
														lastMilestoneUser.username
												}
												alt={lastMilestoneUser.username}
												fill
												className="rounded-2xl object-cover"
											/>
										</div>
										<div className="absolute -right-2 -bottom-2 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-orange-900 shadow-lg">
											MVP
										</div>
									</div>
									<div className="text-center">
										<div className="mb-1 text-sm font-bold tracking-widest text-orange-200 uppercase">
											Hedefi Tamamlayan
										</div>
										<div className="text-3xl font-black text-white drop-shadow-md">
											{lastMilestoneUser.username}
										</div>
									</div>
								</motion.div>
							)}
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Liquid Bar */}
			<div className="relative z-10 h-16 w-100 overflow-hidden rounded-full border-4 border-white/20 bg-black/60 shadow-2xl backdrop-blur-xl">
				<motion.div
					className="relative h-full bg-linear-to-r from-orange-600 via-orange-500 to-yellow-400"
					initial={{ width: "0%" }}
					animate={{ width: `${progress}%` }}
					transition={{ type: "spring", stiffness: 40, damping: 15 }}
				>
					<div className="absolute top-0 right-0 left-0 h-1/2 rounded-t-full bg-white/20" />

					<div className="absolute inset-0 animate-pulse bg-[url('/bubbles.svg')] opacity-30" />
				</motion.div>

				<div className="absolute inset-0 flex items-center justify-center gap-3">
					<span className="font-mono text-3xl font-black tracking-tighter text-white drop-shadow-lg">
						{count.toLocaleString()}
					</span>
					<span className="mt-1 text-lg font-bold tracking-widest text-orange-200 uppercase opacity-80">
						Litre
					</span>
				</div>
			</div>

			<div className="z-10 flex -skew-x-12 transform items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-4 py-2 shadow-2xl backdrop-blur-xl">
				<div className="h-3 w-3 animate-pulse rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]" />
				<span className="skew-x-12 transform text-lg font-bold tracking-wide text-white/90">
					HEDEF:{" "}
					<span className="text-xl text-white">
						{(
							(Math.floor(count / GAME_CONFIG.GOAL) + 1) *
							GAME_CONFIG.GOAL
						).toLocaleString()}
					</span>
				</span>
			</div>

			<LeaderboardWidget />
		</div>
	);
}

export default function OverlayPage() {
	return (
		<Suspense fallback={null}>
			<OverlayContent />
		</Suspense>
	);
}

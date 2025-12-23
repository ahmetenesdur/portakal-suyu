"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Snowfall from "react-snowfall";

import { GAME_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase";

import LeaderboardWidget from "./LeaderboardWidget";

const OrangeSliceSVG = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" r="48" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />

		<circle cx="50" cy="50" r="44" fill="#FFF7ED" />

		{[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
			<g key={angle} transform={`rotate(${angle} 50 50)`}>
				<path
					d="M50 44 L36 16 Q50 8 64 16 L50 44 Z"
					fill="#F97316"
					stroke="#FB923C"
					strokeWidth="0.5"
				/>
				<circle cx="50" cy="18" r="2" fill="#FDBA74" fillOpacity="0.8" />
				<circle cx="45" cy="22" r="1.5" fill="#FDBA74" fillOpacity="0.6" />
				<circle cx="55" cy="22" r="1.5" fill="#FDBA74" fillOpacity="0.6" />
				<circle cx="50" cy="26" r="1.5" fill="#FDBA74" fillOpacity="0.4" />
			</g>
		))}

		<circle cx="50" cy="50" r="3" fill="#FFF7ED" />
	</svg>
);

const DropletSVG = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 2C12 2 18 8 18 14C18 17.3137 15.3137 20 12 20C8.68629 20 6 17.3137 6 14C6 8 12 2 12 2Z"
			fill="#F97316"
		/>

		<path
			d="M12 18C15 18 17 16 17 14C17 11 14 6 14 6"
			stroke="#C2410C"
			strokeWidth="0"
			fill="#C2410C"
			fillOpacity="0.2"
		/>

		<path
			d="M10 8C10 8 8.5 10 8.5 12.5"
			stroke="white"
			strokeWidth="1.5"
			strokeLinecap="round"
			opacity="0.9"
		/>
	</svg>
);

const WaveSVG = () => (
	<svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
		<path
			fill="#F97316"
			fillOpacity="1"
			d="M0,160 C320,280 480,100 720,160 C960,220 1120,100 1440,160 V320 H0 Z"
		/>
	</svg>
);

const FloatingParticles = ({ count = 25 }: { count?: number }) => {
	const [particles, setParticles] = useState<
		{
			id: number;
			left: number;
			delay: number;
			duration: number;
			scale: number;
			rotation: number;
			isSlice: boolean;
		}[]
	>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setParticles(
				Array.from({ length: count }).map((_, i) => ({
					id: i,
					left: Math.random() * 100,
					delay: Math.random() * 2,
					duration: 3 + Math.random() * 4,
					scale: 0.5 + Math.random() * 1,
					rotation: Math.random() * 360,
					isSlice: Math.random() > 0.5,
				}))
			);
		}, 0);
		return () => clearTimeout(timer);
	}, [count]);

	return (
		<>
			{particles.map((p) => (
				<motion.div
					key={p.id}
					className="absolute bottom-0"
					style={{ left: `${p.left}%` }}
					initial={{ y: 100, opacity: 0, rotate: 0 }}
					animate={{
						y: -1000,
						opacity: [0, 1, 1, 0],
						rotate: p.rotation + 360,
					}}
					transition={{
						duration: p.duration,
						delay: p.delay,
						repeat: Infinity,
						ease: "linear",
					}}
				>
					{p.isSlice ? (
						<OrangeSliceSVG className="h-12 w-12 opacity-80" />
					) : (
						<DropletSVG className="h-6 w-6 opacity-60" />
					)}
				</motion.div>
			))}
		</>
	);
};

const SplashBurst = () => {
	const [particles, setParticles] = useState<
		{
			id: number;
			angle: number;
			distance: number;
			scale: number;
			rotation: number;
		}[]
	>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setParticles(
				Array.from({ length: 24 }).map((_, i) => ({
					id: i,
					angle: (i / 24) * 360,
					distance: 150 + Math.random() * 250,
					scale: 0.5 + Math.random() * 1.5,
					rotation: Math.random() * 360,
				}))
			);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
			{particles.map((p) => (
				<motion.div
					key={p.id}
					className="absolute"
					initial={{
						x: 0,
						y: 0,
						scale: 0,
						opacity: 1,
						rotate: p.rotation,
					}}
					animate={{
						x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
						y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
						scale: p.scale,
						opacity: 0,
						rotate: p.rotation + 180,
					}}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<DropletSVG className="h-8 w-8 fill-current text-orange-500" />
				</motion.div>
			))}
		</div>
	);
};

const GodRays = () => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(false), 4000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, rotate: 0 }}
			animate={{
				opacity: isVisible ? 0.4 : 0,
				rotate: 360,
			}}
			transition={{
				opacity: { duration: 2 },
				rotate: { duration: 20, ease: "linear", repeat: Infinity },
			}}
			className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
		>
			<div className="h-[200vw] w-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,white_15deg,transparent_30deg,white_45deg,transparent_60deg,white_75deg,transparent_90deg,white_105deg,transparent_120deg,white_135deg,transparent_150deg,white_165deg,transparent_180deg,white_195deg,transparent_210deg,white_225deg,transparent_240deg,white_255deg,transparent_270deg,white_285deg,transparent_300deg,white_315deg,transparent_330deg,white_345deg,transparent_360deg)] opacity-20 mix-blend-overlay" />
		</motion.div>
	);
};

const SparkleSVG = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
			fill="currentColor"
		/>
	</svg>
);

const Sparkles = () => {
	const [sparkles, setSparkles] = useState<
		{
			id: number;
			x: number;
			y: number;
			scale: number;
			delay: number;
			repeatDelay: number;
		}[]
	>([]);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSparkles(
				Array.from({ length: 15 }).map((_, i) => ({
					id: i,
					x: Math.random() * 100,
					y: Math.random() * 100,
					scale: 0.5 + Math.random() * 0.5,
					delay: Math.random() * 1,
					repeatDelay: Math.random() * 2,
				}))
			);
		}, 0);

		const fadeTimer = setTimeout(() => setIsVisible(false), 4000);

		return () => {
			clearTimeout(timer);
			clearTimeout(fadeTimer);
		};
	}, []);

	return (
		<motion.div
			className="pointer-events-none absolute inset-0 z-50"
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 2 }}
		>
			{sparkles.map((s) => (
				<motion.div
					key={s.id}
					className="absolute text-yellow-200"
					style={{ left: `${s.x}%`, top: `${s.y}%` }}
					initial={{ scale: 0, opacity: 0 }}
					animate={{
						scale: [0, s.scale, 0],
						opacity: [0, 1, 0],
						rotate: [0, 180],
					}}
					transition={{
						duration: 1.5,
						delay: s.delay,
						repeat: Infinity,
						repeatDelay: s.repeatDelay,
					}}
				>
					<SparkleSVG className="h-6 w-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
				</motion.div>
			))}
		</motion.div>
	);
};

function OverlayContent() {
	const [count, setCount] = useState(0);
	const [showSpill, setShowSpill] = useState(false);
	const [prevLevel, setPrevLevel] = useState(0);
	const [isClient, setIsClient] = useState(false);
	interface MilestoneUser {
		username: string;
		avatar_url: string;
		id: string;
	}

	const [lastMilestoneUser, setLastMilestoneUser] = useState<MilestoneUser | null>(null);

	const searchParams = useSearchParams();
	const isTestMode = searchParams.get("test") === "true";

	const [supabase] = useState(() => createClient());

	useEffect(() => {
		const timer = setTimeout(() => setIsClient(true), 0);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const fetchStats = async () => {
			const { data } = await supabase
				.from("global_stats")
				.select("total_clicks, last_milestone_user")
				.eq("id", 1)
				.single();
			if (data) {
				setCount(data.total_clicks);
				setPrevLevel(Math.floor(data.total_clicks / GAME_CONFIG.GOAL));
				if (data.last_milestone_user) {
					setLastMilestoneUser(data.last_milestone_user as unknown as MilestoneUser);
				}
			}
		};

		fetchStats();

		const channel = supabase
			.channel("overlay_updates")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "global_stats",
					filter: "id=eq.1",
				},
				(payload) => {
					const newCount = payload.new.total_clicks;
					const newLevel = Math.floor(newCount / GAME_CONFIG.GOAL);
					const newUser = payload.new.last_milestone_user;

					setCount(newCount);
					if (newUser) {
						setLastMilestoneUser(newUser as unknown as MilestoneUser);
					}

					if (newLevel > prevLevel) {
						setShowSpill(true);
						setTimeout(() => setShowSpill(false), GAME_CONFIG.ANIMATION.SPILL_DURATION);
						setPrevLevel(newLevel);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, prevLevel]);

	const progress = ((count % GAME_CONFIG.GOAL) / GAME_CONFIG.GOAL) * 100;

	const handleTestSpill = () => {
		setShowSpill(true);
		setTimeout(() => setShowSpill(false), GAME_CONFIG.ANIMATION.SPILL_DURATION);
	};

	const handleTestAdd = () => {
		setCount((prev) => prev + 10);
	};

	const handleTestReset = () => {
		setCount(0);
		setPrevLevel(0);
	};

	if (!isClient) return null; // Prevent hydration mismatch

	return (
		<div className="relative flex h-screen w-full flex-col items-start gap-4 overflow-hidden p-8 font-sans">
			<Snowfall
				snowflakeCount={100}
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
					animation: wave-slide 10s linear infinite;
				}
			`}</style>

			{isTestMode && (
				<div className="fixed bottom-4 left-4 z-100 flex flex-col gap-2 rounded-xl border border-white/20 bg-black/80 p-4 text-white backdrop-blur-md">
					<h3 className="mb-2 font-bold text-orange-400">Test Controls</h3>
					<button
						onClick={handleTestSpill}
						className="rounded bg-orange-600 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-orange-500"
					>
						Simulate Spill
					</button>
					<button
						onClick={handleTestAdd}
						className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-blue-500"
					>
						Add 10 Liters
					</button>
					<button
						onClick={handleTestReset}
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
								duration: 1.2,
								ease: [0.22, 1, 0.36, 1],
							}} // Custom easing for "heavy" liquid feel
							className="absolute inset-0 z-40 flex flex-col justify-end"
						>
							<div
								className="animate-wave-slide absolute top-0 left-0 -mt-12 flex h-48 w-[200%] opacity-60"
								style={{ animationDuration: "15s" }}
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
							<FloatingParticles count={25} />
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
												className="object-cover"
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

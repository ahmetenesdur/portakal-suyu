"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { GAME_CONFIG } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

// --- SVG ASSETS (High Fidelity) ---

const OrangeSliceSVG = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 100 100"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{/* Outer Rind (Skin) with slight gradient feel via stroke */}
		<circle
			cx="50"
			cy="50"
			r="48"
			fill="#EA580C"
			stroke="#C2410C"
			strokeWidth="1"
		/>
		{/* Inner Pith (White) */}
		<circle cx="50" cy="50" r="44" fill="#FFF7ED" />

		{/* Juicy Segments */}
		{[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
			<g key={angle} transform={`rotate(${angle} 50 50)`}>
				{/* Segment Shape - Organic Kernel */}
				<path
					d="M50 44 L36 16 Q50 8 64 16 L50 44 Z"
					fill="#F97316"
					stroke="#FB923C"
					strokeWidth="0.5"
				/>
				{/* Juice Sacs / Texture Details */}
				<circle
					cx="50"
					cy="18"
					r="2"
					fill="#FDBA74"
					fillOpacity="0.8"
				/>
				<circle
					cx="45"
					cy="22"
					r="1.5"
					fill="#FDBA74"
					fillOpacity="0.6"
				/>
				<circle
					cx="55"
					cy="22"
					r="1.5"
					fill="#FDBA74"
					fillOpacity="0.6"
				/>
				<circle
					cx="50"
					cy="26"
					r="1.5"
					fill="#FDBA74"
					fillOpacity="0.4"
				/>
			</g>
		))}

		{/* Center Core */}
		<circle cx="50" cy="50" r="3" fill="#FFF7ED" />
	</svg>
);

const DropletSVG = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{/* Main Body */}
		<path
			d="M12 2C12 2 18 8 18 14C18 17.3137 15.3137 20 12 20C8.68629 20 6 17.3137 6 14C6 8 12 2 12 2Z"
			fill="#F97316"
		/>
		{/* Volume Shadow (Bottom Right) */}
		<path
			d="M12 18C15 18 17 16 17 14C17 11 14 6 14 6"
			stroke="#C2410C"
			strokeWidth="0"
			fill="#C2410C"
			fillOpacity="0.2"
		/>
		{/* Highlight (Top Left) */}
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
	<svg
		className="w-full h-full"
		viewBox="0 0 1440 320"
		preserveAspectRatio="none"
	>
		<path
			fill="#F97316"
			fillOpacity="1"
			d="M0,160 C320,280 480,100 720,160 C960,220 1120,100 1440,160 V320 H0 Z"
		/>
	</svg>
);

// --- COMPONENTS ---

const FloatingParticle = () => {
	const [config, setConfig] = useState<{
		left: number;
		delay: number;
		duration: number;
		scale: number;
		rotation: number;
		isSlice: boolean;
	} | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setConfig({
				left: Math.random() * 100,
				delay: Math.random() * 2,
				duration: 3 + Math.random() * 4,
				scale: 0.5 + Math.random() * 1,
				rotation: Math.random() * 360,
				isSlice: Math.random() > 0.5,
			});
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	if (!config) return null;

	return (
		<motion.div
			className="absolute bottom-0"
			style={{ left: `${config.left}%` }}
			initial={{ y: 100, opacity: 0, rotate: 0 }}
			animate={{
				y: -1000, // Move up off screen
				opacity: [0, 1, 1, 0],
				rotate: config.rotation + 360,
			}}
			transition={{
				duration: config.duration,
				delay: config.delay,
				repeat: Infinity,
				ease: "linear",
			}}
		>
			{config.isSlice ? (
				<OrangeSliceSVG className="w-12 h-12 opacity-80" />
			) : (
				<DropletSVG className="w-6 h-6 opacity-60" />
			)}
		</motion.div>
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
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
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
					<DropletSVG className="w-8 h-8 text-orange-500 fill-current" />
				</motion.div>
			))}
		</div>
	);
};

const GodRays = () => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(false), 4000); // Fade out after 4s (was 3s)
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
				opacity: { duration: 2 }, // Slower fade (was 1s)
				rotate: { duration: 20, ease: "linear", repeat: Infinity },
			}}
			className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
		>
			<div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,white_15deg,transparent_30deg,white_45deg,transparent_60deg,white_75deg,transparent_90deg,white_105deg,transparent_120deg,white_135deg,transparent_150deg,white_165deg,transparent_180deg,white_195deg,transparent_210deg,white_225deg,transparent_240deg,white_255deg,transparent_270deg,white_285deg,transparent_300deg,white_315deg,transparent_330deg,white_345deg,transparent_360deg)] opacity-20 mix-blend-overlay" />
		</motion.div>
	);
};

const SparkleSVG = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
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

		const fadeTimer = setTimeout(() => setIsVisible(false), 4000); // Fade out after 4s (was 3s)

		return () => {
			clearTimeout(timer);
			clearTimeout(fadeTimer);
		};
	}, []);

	return (
		<motion.div
			className="absolute inset-0 z-50 pointer-events-none"
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 2 }} // Slower fade (was 1s)
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
					<SparkleSVG className="w-6 h-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
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
				.select("total_clicks")
				.eq("id", 1)
				.single();
			if (data) {
				setCount(data.total_clicks);
				setPrevLevel(Math.floor(data.total_clicks / GAME_CONFIG.GOAL));
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
					console.log("Realtime update received:", payload);
					const newCount = payload.new.total_clicks;
					const newLevel = Math.floor(newCount / GAME_CONFIG.GOAL);

					setCount(newCount);

					if (newLevel > prevLevel) {
						setShowSpill(true);
						setTimeout(
							() => setShowSpill(false),
							GAME_CONFIG.ANIMATION.SPILL_DURATION
						);
						setPrevLevel(newLevel);
					}
				}
			)
			.subscribe((status) => {
				console.log("Subscription status:", status);
			});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, prevLevel]);

	const progress = ((count % GAME_CONFIG.GOAL) / GAME_CONFIG.GOAL) * 100;

	const handleTestSpill = () => {
		setShowSpill(true);
		setTimeout(
			() => setShowSpill(false),
			GAME_CONFIG.ANIMATION.SPILL_DURATION
		);
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
		<div className="p-8 flex flex-col items-start gap-4 relative w-full h-screen overflow-hidden font-sans">
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

			{/* --- TEST CONTROLS PANEL --- */}
			{isTestMode && (
				<div className="fixed top-4 right-4 z-[100] bg-black/80 text-white p-4 rounded-xl border border-white/20 backdrop-blur-md flex flex-col gap-2">
					<h3 className="font-bold text-orange-400 mb-2">
						Test Controls
					</h3>
					<button
						onClick={handleTestSpill}
						className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 rounded text-sm font-medium transition-colors"
					>
						Simulate Spill
					</button>
					<button
						onClick={handleTestAdd}
						className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
					>
						Add 10 Liters
					</button>
					<button
						onClick={handleTestReset}
						className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition-colors"
					>
						Reset
					</button>
				</div>
			)}

			{/* --- SPILL ANIMATION --- */}
			<AnimatePresence>
				{showSpill && (
					<>
						{/* 0. Screen Shake Wrapper & Flash */}
						<motion.div
							className="absolute inset-0 z-50 pointer-events-none"
							initial={{ x: 0, y: 0 }}
							animate={{
								x: [0, -20, 20, -10, 10, -5, 5, 0],
								y: [0, 10, -10, 5, -5, 0],
							}}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						>
							{/* White Flash Impact */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: [0, 1, 0] }}
								transition={{
									duration: 0.3,
									times: [0, 0.1, 1],
								}}
								className="absolute inset-0 bg-white mix-blend-overlay z-60"
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
							{/* Back Wave */}
							<div
								className="absolute top-0 left-0 w-[200%] h-48 -mt-12 flex animate-wave-slide opacity-60"
								style={{ animationDuration: "15s" }}
							>
								<WaveSVG />
								<WaveSVG />
							</div>

							{/* Front Wave */}
							<div className="w-[200%] h-32 -mb-1 flex animate-wave-slide relative z-10">
								<WaveSVG />
								<WaveSVG />
							</div>

							{/* Solid Body */}
							<div className="w-full flex-1 bg-orange-500 relative overflow-hidden z-10">
								{/* Bubbles Pattern */}
								<div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-size-[40px_40px]" />
							</div>
						</motion.div>

						{/* 1.5 God Rays (Background for Text) */}
						<GodRays />

						{/* 2. Floating Particles (Slices & Droplets) */}
						<div className="absolute inset-0 z-50 pointer-events-none">
							{[...Array(25)].map(
								(
									_,
									i // Increased count
								) => (
									<FloatingParticle key={i} />
								)
							)}
						</div>

						{/* 3. Splash Burst Effect (Updated to use Droplets) */}
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
							<SplashBurst />
						</div>

						{/* 3.5 Sparkles */}
						<Sparkles />

						{/* 4. Celebration Text (Slam Effect) */}
						<motion.div
							initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
							animate={{ scale: 1, opacity: 1, rotate: -6 }}
							exit={{ scale: 1.5, opacity: 0 }}
							transition={{
								delay: 0.2,
								type: "spring",
								stiffness: 200, // Reduced from 300 for less wobble
								damping: 20, // Increased from 15 for more stability
							}}
							className="absolute inset-0 z-70 flex items-center justify-center"
						>
							<div className="relative group">
								<h1 className="text-9xl font-black text-white text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] tracking-tighter italic transform">
									HEDEF
									<br />
									<span className="text-yellow-300 relative inline-block">
										TAMAMLANDI!
										{/* Shine Effect on Text */}
										<motion.span
											className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-12"
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
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* --- WIDGETS --- */}

			{/* Progress Bar */}
			<div className="w-[600px] h-24 bg-black/60 rounded-full border-4 border-white/20 backdrop-blur-xl relative overflow-hidden shadow-2xl z-10">
				{/* Liquid Fill */}
				<motion.div
					className="h-full bg-linear-to-r from-orange-600 via-orange-500 to-yellow-400 relative"
					initial={{ width: "0%" }}
					animate={{ width: `${progress}%` }}
					transition={{ type: "spring", stiffness: 40, damping: 15 }}
				>
					{/* Glossy Shine */}
					<div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full" />
					{/* Wave Pattern Overlay */}
					<div className="absolute inset-0 opacity-30 bg-[url('/bubbles.svg')] animate-pulse" />
				</motion.div>

				{/* Text */}
				<div className="absolute inset-0 flex items-center justify-center gap-4">
					<span className="text-5xl font-black text-white font-mono tracking-tighter drop-shadow-lg">
						{count.toLocaleString()}
					</span>
					<span className="text-2xl font-bold text-orange-200 uppercase tracking-widest opacity-80 mt-2">
						Litre
					</span>
				</div>
			</div>

			{/* Goal Badge */}
			<div className="flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-10 transform -skew-x-12">
				<div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse shadow-[0_0_15px_rgba(249,115,22,1)]" />
				<span className="text-white/90 font-bold text-xl tracking-wide transform skew-x-12">
					HEDEF:{" "}
					<span className="text-white text-2xl">
						{(
							(Math.floor(count / GAME_CONFIG.GOAL) + 1) *
							GAME_CONFIG.GOAL
						).toLocaleString()}
					</span>
				</span>
			</div>
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

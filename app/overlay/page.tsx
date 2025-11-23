import { useSearchParams } from "next/navigation";

// ... imports

export default function OverlayPage() {
	const [count, setCount] = useState(0);
	const [showSpill, setShowSpill] = useState(false);
	const [prevLevel, setPrevLevel] = useState(0);
	const [isClient, setIsClient] = useState(false);

	const searchParams = useSearchParams();
	const isTestMode = searchParams.get("test") === "true";

	const supabase = useMemo(() => createClient(), []);

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
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, prevLevel]);

	const progress = ((count % GAME_CONFIG.GOAL) / GAME_CONFIG.GOAL) * 100;

	// --- TEST CONTROLS ---
	const [isTestMode, setIsTestMode] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			setIsTestMode(params.get("test") === "true");
		}
	}, []);

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

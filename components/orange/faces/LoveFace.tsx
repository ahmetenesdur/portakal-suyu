export default function LoveFace() {
	return (
		<>
			<div className="relative flex translate-y-2 items-center gap-8">
				{/* Left Heart Eye */}
				<svg width="40" height="40" viewBox="0 0 24 24" className="animate-pulse">
					<defs>
						<linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#ec4899" />
							<stop offset="100%" stopColor="#ef4444" />
						</linearGradient>
					</defs>
					<path
						d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
						fill="url(#heartGradient)"
						stroke="#be123c"
						strokeWidth="1"
					/>
				</svg>
				{/* Right Heart Eye */}
				<svg width="40" height="40" viewBox="0 0 24 24" className="animate-pulse">
					<path
						d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
						fill="url(#heartGradient)"
						stroke="#be123c"
						strokeWidth="1"
					/>
				</svg>
			</div>

			{/* Happy Mouth */}
			<div className="absolute top-12 left-1/2 -translate-x-1/2">
				<svg width="40" height="20" viewBox="0 0 40 20">
					<path
						d="M5,5 Q20,25 35,5"
						fill="none"
						stroke="#1e293b"
						strokeWidth="4"
						strokeLinecap="round"
					/>
				</svg>
			</div>

			{/* Blush spread */}
			<div className="absolute top-8 left-0 -ml-4 h-6 w-8 rounded-full bg-pink-400/30 blur-md" />
			<div className="absolute top-8 right-0 -mr-4 h-6 w-8 rounded-full bg-pink-400/30 blur-md" />
		</>
	);
}

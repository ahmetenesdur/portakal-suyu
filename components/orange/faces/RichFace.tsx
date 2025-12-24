export default function RichFace() {
	return (
		<>
			<div className="relative -top-2 flex items-center gap-8">
				{/* Left Eye ($) */}
				<div className="relative flex h-12 w-10 items-center justify-center">
					<span className="text-4xl font-bold text-green-700">$</span>
				</div>

				{/* Right Eye (Monocle + $) */}
				<div className="relative flex h-12 w-12 items-center justify-center">
					<span className="text-4xl font-bold text-green-700">$</span>

					{/* Monocle */}
					<div className="absolute inset-0 rounded-full border-4 border-yellow-500 bg-white/10 shadow-lg" />
					<div className="pointer-events-none absolute top-1/2 right-0 h-20 w-20 translate-x-1/4 -translate-y-full">
						<svg width="80" height="80" viewBox="0 0 80 80">
							<path
								d="M10,40 Q10,80 40,80"
								fill="none"
								stroke="#eab308"
								strokeWidth="2"
							/>
						</svg>
					</div>
				</div>
			</div>

			{/* Smug, Rich Smile */}
			<div className="absolute top-10 left-1/2 -translate-x-1/2">
				<svg width="50" height="20" viewBox="0 0 50 20">
					<path
						d="M10,12 Q25,18 40,10"
						fill="none"
						stroke="#1e293b"
						strokeWidth="3"
						strokeLinecap="round"
					/>
				</svg>
			</div>

			{/* Mustachio (Optional, maybe too much? Let's keep it clean but add a cigar effect or just sophisticated) */}
			{/* Let's add a golden tooth sparkle instead */}
			<div className="absolute top-10 left-1/2 translate-x-3 translate-y-1">
				<svg width="10" height="10" viewBox="0 0 10 10">
					<path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#fbbf24" />
				</svg>
			</div>
		</>
	);
}

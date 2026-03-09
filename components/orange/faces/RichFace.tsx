export default function RichFace() {
	return (
		<>
			{/* Top Hat */}
			<div className="absolute -top-20 left-1/2 -translate-x-1/2">
				<svg width="120" height="70" viewBox="0 0 120 70">
					<defs>
						<linearGradient id="topHatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="#1e293b" />
							<stop offset="100%" stopColor="#0f172a" />
						</linearGradient>
					</defs>
					{/* Hat brim */}
					<ellipse cx="60" cy="62" rx="58" ry="8" fill="#0f172a" />
					{/* Hat body */}
					<rect x="20" y="10" width="80" height="52" rx="3" fill="url(#topHatGrad)" />
					{/* Hat top */}
					<ellipse cx="60" cy="10" rx="40" ry="6" fill="#1e293b" />
					{/* Gold band */}
					<rect x="20" y="48" width="80" height="8" fill="#b45309" />
					<rect
						x="20"
						y="48"
						width="80"
						height="8"
						fill="none"
						stroke="#fbbf24"
						strokeWidth="1"
					/>
					{/* Dollar buckle */}
					<circle cx="60" cy="52" r="6" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
					<text
						x="60"
						y="56"
						textAnchor="middle"
						fontSize="9"
						fontWeight="bold"
						fill="#92400e"
					>
						$
					</text>
				</svg>
			</div>

			{/* Eyes */}
			<div className="relative -top-1 flex items-center gap-8">
				{/* Left Eye ($) */}
				<div className="relative flex h-12 w-10 items-center justify-center">
					<span className="text-4xl font-black text-green-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
						$
					</span>
				</div>

				{/* Right Eye (Monocle + $) */}
				<div className="relative flex h-12 w-12 items-center justify-center">
					<span className="relative z-10 text-4xl font-black text-green-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
						$
					</span>
					{/* Monocle */}
					<div className="absolute inset-0 rounded-full border-[3px] border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
					{/* Monocle highlight */}
					<div className="absolute top-0.5 left-1 h-3 w-5 rotate-[-20deg] rounded-full bg-white/20" />
					{/* Monocle chain */}
					<svg
						className="pointer-events-none absolute top-1/2 right-0 translate-x-1"
						width="20"
						height="40"
						viewBox="0 0 20 40"
					>
						<path d="M0,0 Q15,15 5,40" fill="none" stroke="#eab308" strokeWidth="1.5" />
					</svg>
				</div>
			</div>

			{/* Smug Smile */}
			<div className="absolute top-10 left-1/2 -translate-x-1/2">
				<svg width="55" height="22" viewBox="0 0 55 22">
					<path
						d="M8,12 Q28,20 47,8"
						fill="none"
						stroke="#1e293b"
						strokeWidth="3.5"
						strokeLinecap="round"
					/>
					{/* Gold tooth sparkle */}
					<path
						d="M38,11 L39.5,7 L43,11.5 L39.5,10 L36,11.5 L39.5,7 Z"
						fill="#fbbf24"
						opacity="0.9"
					/>
				</svg>
			</div>

			{/* Floating money sparkles */}
			<div className="absolute -top-4 -right-4 animate-bounce">
				<svg width="16" height="16" viewBox="0 0 16 16">
					<path
						d="M8 0 L9.5 6 L16 8 L9.5 10 L8 16 L6.5 10 L0 8 L6.5 6 Z"
						fill="#fbbf24"
						opacity="0.7"
					/>
				</svg>
			</div>
			<div className="absolute -top-2 -left-6 animate-pulse">
				<svg width="12" height="12" viewBox="0 0 16 16">
					<path
						d="M8 0 L9.5 6 L16 8 L9.5 10 L8 16 L6.5 10 L0 8 L6.5 6 Z"
						fill="#fde047"
						opacity="0.5"
					/>
				</svg>
			</div>
		</>
	);
}

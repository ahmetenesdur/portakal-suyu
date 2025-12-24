export default function KingFace() {
	return (
		<>
			{/* Crown */}
			<div className="absolute -top-20 left-1/2 -translate-x-1/2">
				<svg width="140" height="80" viewBox="0 0 140 80">
					<defs>
						<linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#fcd34d" />
							<stop offset="50%" stopColor="#f59e0b" />
							<stop offset="100%" stopColor="#b45309" />
						</linearGradient>
						<filter id="glow">
							<feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
							<feMerge>
								<feMergeNode in="coloredBlur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					<path
						d="M10,70 L10,30 L40,60 L70,10 L100,60 L130,30 L130,70 Z"
						fill="url(#crownGradient)"
						stroke="#78350f"
						strokeWidth="2"
						strokeLinejoin="round"
						filter="url(#glow)"
					/>
					{/* Gemstones */}
					<circle cx="70" cy="50" r="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
					<circle cx="40" cy="62" r="3" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
					<circle
						cx="100"
						cy="62"
						r="3"
						fill="#3b82f6"
						stroke="#1e3a8a"
						strokeWidth="1"
					/>
				</svg>
			</div>

			{/* Eyes */}
			<div className="relative mt-2 flex items-center gap-12">
				{/* Left Eye */}
				<div className="h-4 w-4 rounded-full bg-slate-900" />
				{/* Right Eye */}
				<div className="h-4 w-4 rounded-full bg-slate-900" />
			</div>

			{/* Smug Smile */}
			<div className="absolute top-8 left-1/2 -translate-x-1/2">
				<svg width="60" height="20" viewBox="0 0 60 20">
					<path
						d="M10,5 Q30,15 50,5"
						fill="none"
						stroke="#1e293b"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<path d="M5,5 L10,5" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
					<path d="M50,5 L55,5" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
				</svg>
			</div>
		</>
	);
}

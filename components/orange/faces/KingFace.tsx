export default function KingFace() {
	return (
		<>
			{/* Crown */}
			<div className="absolute -top-20 left-1/2 -translate-x-1/2">
				<svg width="150" height="90" viewBox="0 0 150 90">
					<defs>
						<linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#fde047" />
							<stop offset="40%" stopColor="#f59e0b" />
							<stop offset="100%" stopColor="#92400e" />
						</linearGradient>
						<filter id="crownGlow">
							<feGaussianBlur stdDeviation="3" result="blur" />
							<feMerge>
								<feMergeNode in="blur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					{/* Crown Body */}
					<path
						d="M10,75 L10,35 L35,60 L55,20 L75,50 L95,20 L115,60 L140,35 L140,75 Z"
						fill="url(#crownGold)"
						stroke="#78350f"
						strokeWidth="2.5"
						strokeLinejoin="round"
						filter="url(#crownGlow)"
					/>
					{/* Band */}
					<rect
						x="10"
						y="65"
						width="130"
						height="12"
						rx="2"
						fill="#b45309"
						opacity="0.6"
					/>
					{/* Center Ruby */}
					<circle
						cx="75"
						cy="52"
						r="7"
						fill="#dc2626"
						stroke="#7f1d1d"
						strokeWidth="1.5"
					/>
					<circle cx="73" cy="49" r="2" fill="#fca5a5" opacity="0.7" />
					{/* Left Sapphire */}
					<circle
						cx="40"
						cy="63"
						r="4.5"
						fill="#3b82f6"
						stroke="#1e3a8a"
						strokeWidth="1"
					/>
					<circle cx="38" cy="61" r="1.5" fill="#93c5fd" opacity="0.6" />
					{/* Right Sapphire */}
					<circle
						cx="110"
						cy="63"
						r="4.5"
						fill="#3b82f6"
						stroke="#1e3a8a"
						strokeWidth="1"
					/>
					<circle cx="108" cy="61" r="1.5" fill="#93c5fd" opacity="0.6" />
					{/* Tip decorations */}
					<circle cx="55" cy="18" r="3" fill="#fde047" stroke="#b45309" strokeWidth="1" />
					<circle cx="95" cy="18" r="3" fill="#fde047" stroke="#b45309" strokeWidth="1" />
					<circle cx="75" cy="48" r="0" />
				</svg>
			</div>

			{/* Royal Eyes (half-closed, confident) */}
			<div className="relative mt-2 flex items-center gap-12">
				{/* Left Eye */}
				<div className="relative h-5 w-8 overflow-hidden rounded-b-full">
					<div className="absolute inset-0 bg-slate-900" />
					<div className="absolute bottom-1 left-2 h-2 w-2 rounded-full bg-amber-200/40" />
				</div>
				{/* Right Eye */}
				<div className="relative h-5 w-8 overflow-hidden rounded-b-full">
					<div className="absolute inset-0 bg-slate-900" />
					<div className="absolute bottom-1 left-2 h-2 w-2 rounded-full bg-amber-200/40" />
				</div>
			</div>

			{/* Confident Smirk */}
			<div className="absolute top-10 left-1/2 -translate-x-1/2">
				<svg width="60" height="25" viewBox="0 0 60 25">
					<path
						d="M8,8 Q30,22 52,8"
						fill="none"
						stroke="#1e293b"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					{/* Lip corners */}
					<path d="M5,7 L10,9" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
					<path d="M50,9 L55,7" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
				</svg>
			</div>
		</>
	);
}

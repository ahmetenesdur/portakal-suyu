export default function NinjaFace() {
	return (
		<>
			{/* Headband with flowing tails */}
			<div className="absolute -top-12 left-1/2 -translate-x-1/2">
				<svg width="200" height="70" viewBox="0 0 200 70">
					<defs>
						<linearGradient id="ninjaPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#cbd5e1" />
							<stop offset="50%" stopColor="#f1f5f9" />
							<stop offset="100%" stopColor="#94a3b8" />
						</linearGradient>
						<linearGradient id="ninjaFabricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="#1e3a8a" />
							<stop offset="100%" stopColor="#172554" />
						</linearGradient>
					</defs>

					{/* Fabric Band */}
					<path
						d="M8,25 Q100,8 192,25 L192,42 Q100,25 8,42 Z"
						fill="url(#ninjaFabricGrad)"
					/>
					{/* Upper edge highlight */}
					<path
						d="M8,25 Q100,8 192,25"
						fill="none"
						stroke="#3b82f6"
						strokeWidth="0.7"
						opacity="0.5"
					/>

					{/* Metal Plate */}
					<rect x="58" y="18" width="84" height="30" rx="4" fill="url(#ninjaPlateGrad)" />
					<rect
						x="58"
						y="18"
						width="84"
						height="30"
						rx="4"
						fill="none"
						stroke="#64748b"
						strokeWidth="1.2"
					/>
					{/* Inner bevel */}
					<rect
						x="62"
						y="22"
						width="76"
						height="22"
						rx="2"
						fill="none"
						stroke="#94a3b8"
						strokeWidth="0.5"
						opacity="0.4"
					/>

					{/* Rivets with highlights */}
					<circle cx="65" cy="25" r="2.5" fill="#475569" />
					<circle cx="64" cy="24" r="0.8" fill="#e2e8f0" opacity="0.7" />
					<circle cx="65" cy="41" r="2.5" fill="#475569" />
					<circle cx="64" cy="40" r="0.8" fill="#e2e8f0" opacity="0.7" />
					<circle cx="135" cy="25" r="2.5" fill="#475569" />
					<circle cx="134" cy="24" r="0.8" fill="#e2e8f0" opacity="0.7" />
					<circle cx="135" cy="41" r="2.5" fill="#475569" />
					<circle cx="134" cy="40" r="0.8" fill="#e2e8f0" opacity="0.7" />

					{/* Engraved kanji-style symbol */}
					<text
						x="100"
						y="38"
						textAnchor="middle"
						fontSize="16"
						fontWeight="900"
						fill="#334155"
						opacity="0.8"
					>
						忍
					</text>

					{/* Flowing tail ribbons */}
					<path
						d="M192,30 Q210,22 220,35 Q215,28 205,32 Q210,25 215,35"
						fill="none"
						stroke="#1e3a8a"
						strokeWidth="4"
						strokeLinecap="round"
						opacity="0.8"
					/>
					<path
						d="M192,35 Q215,45 225,30 Q220,40 210,38 Q218,42 220,32"
						fill="none"
						stroke="#172554"
						strokeWidth="3.5"
						strokeLinecap="round"
						opacity="0.6"
					/>
				</svg>
			</div>

			{/* Intense Narrowed Eyes */}
			<div className="relative flex translate-y-2 items-center gap-8">
				{/* Left Eye */}
				<svg width="48" height="24" viewBox="0 0 48 24">
					{/* Eyelid shadow */}
					<path d="M2,16 L24,4 L46,16" fill="#0f172a" opacity="0.95" />
					{/* Eye white */}
					<path d="M6,16 L24,8 L42,16 Z" fill="white" />
					{/* Iris highlight */}
					<circle cx="20" cy="12.5" r="1.2" fill="white" opacity="0.9" />
					{/* Secondary highlight */}
					<circle cx="24" cy="15" r="0.6" fill="white" opacity="0.5" />
				</svg>

				{/* Right Eye */}
				<svg width="48" height="24" viewBox="0 0 48 24">
					<path d="M2,16 L24,4 L46,16" fill="#0f172a" opacity="0.95" />
					<path d="M6,16 L24,8 L42,16 Z" fill="white" />
					<circle cx="24" cy="12.5" r="1.2" fill="white" opacity="0.9" />
					<circle cx="28" cy="15" r="0.6" fill="white" opacity="0.5" />
				</svg>
			</div>

			{/* Mask / Face Cover */}
			<div className="absolute top-10 left-1/2 -translate-x-1/2">
				<svg width="100" height="50" viewBox="0 0 100 50">
					<defs>
						<linearGradient id="ninjaMaskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="#1e3a8a" />
							<stop offset="100%" stopColor="#1e40af" />
						</linearGradient>
					</defs>
					{/* Mask shape */}
					<path d="M8,5 Q50,50 92,5" fill="url(#ninjaMaskGrad)" opacity="0.92" />
					{/* Fabric texture lines */}
					<path
						d="M25,15 Q50,30 75,15"
						fill="none"
						stroke="#2563eb"
						strokeWidth="0.6"
						opacity="0.3"
					/>
					<path
						d="M30,22 Q50,33 70,22"
						fill="none"
						stroke="#2563eb"
						strokeWidth="0.5"
						opacity="0.2"
					/>
				</svg>
			</div>

			{/* Decorative throwing star (shuriken) */}
			<div className="absolute -top-2 -right-6 animate-[spin_8s_linear_infinite]">
				<svg width="18" height="18" viewBox="0 0 20 20">
					<path
						d="M10,0 L12,8 L20,10 L12,12 L10,20 L8,12 L0,10 L8,8 Z"
						fill="#94a3b8"
						stroke="#475569"
						strokeWidth="0.5"
					/>
					<circle cx="10" cy="10" r="2" fill="#334155" />
				</svg>
			</div>
		</>
	);
}

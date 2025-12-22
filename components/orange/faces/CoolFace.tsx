export default function CoolFace() {
	return (
		<>
			<div className="flex gap-10 items-center relative -top-2">
				{/* Sunglasses SVG adapted for Face size */}
				<svg width="120" height="60" viewBox="0 0 240 120">
					<defs>
						<linearGradient
							id="faceLensGradient"
							x1="0%"
							y1="0%"
							x2="0%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#0f172a" />
							<stop offset="100%" stopColor="#334155" />
						</linearGradient>
					</defs>
					{/* Left Lens */}
					<path
						d="M20,30 Q20,10 50,10 L100,10 Q120,10 120,40 L115,80 Q110,100 70,100 L40,100 Q20,95 20,40 Z"
						fill="#111"
					/>
					<path
						d="M28,38 Q28,18 50,18 L95,18 Q110,18 110,40 L106,75 Q102,90 70,90 L45,90 Q28,85 28,45 Z"
						fill="url(#faceLensGradient)"
						opacity="0.95"
					/>
					{/* Right Lens */}
					<path
						d="M140,40 Q140,10 160,10 L210,10 Q240,10 240,40 Q240,95 220,100 L190,100 Q150,100 145,80 L140,40 Z"
						fill="#111"
					/>
					<path
						d="M148,45 Q148,18 165,18 L210,18 Q230,18 230,40 Q230,85 215,90 L190,90 Q155,90 152,75 L148,45 Z"
						fill="url(#faceLensGradient)"
						opacity="0.95"
					/>
					{/* Bridge */}
					<path
						d="M120,35 Q130,25 140,35"
						fill="none"
						stroke="#111"
						strokeWidth="8"
						strokeLinecap="round"
					/>
					{/* Reflections */}
					<path
						d="M40,25 L90,25 L70,80 L30,60 Z"
						fill="white"
						opacity="0.1"
					/>
					<path
						d="M160,25 L210,25 L190,80 L150,60 Z"
						fill="white"
						opacity="0.1"
					/>
				</svg>
			</div>
			{/* Cool Smirk */}
			{/* Cool Smirk */}
			<div className="absolute top-11 left-1/2 -translate-x-1/2">
				<svg width="40" height="20" viewBox="0 0 40 20">
					<path
						d="M5,12 Q20,18 35,8"
						fill="none"
						stroke="#1e293b"
						strokeWidth="4"
						strokeLinecap="round"
					/>
				</svg>
			</div>
		</>
	);
}

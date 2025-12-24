export default function NinjaFace() {
	return (
		<>
			{/* Headband */}
			<div className="absolute -top-16 left-1/2 flex w-48 -translate-x-1/2 justify-center">
				<svg width="180" height="60" viewBox="0 0 180 60">
					<defs>
						<linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#94a3b8" />
							<stop offset="50%" stopColor="#e2e8f0" />
							<stop offset="100%" stopColor="#64748b" />
						</linearGradient>
						<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
							<feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
						</filter>
					</defs>

					{/* Fabric Band */}
					<path d="M10,20 Q90,5 170,20 L170,35 Q90,20 10,35 Z" fill="#1e3a8a" />
					{/* Tied Knot (suggested) on sides? Skip for simplicity/clarity */}

					{/* Metal Plate */}
					<rect
						x="50"
						y="15"
						width="80"
						height="25"
						rx="2"
						fill="url(#metalGradient)"
						filter="url(#shadow)"
					/>
					{/* Rivets */}
					<circle cx="55" cy="20" r="1.5" fill="#334155" />
					<circle cx="55" cy="35" r="1.5" fill="#334155" />
					<circle cx="125" cy="20" r="1.5" fill="#334155" />
					<circle cx="125" cy="35" r="1.5" fill="#334155" />

					{/* Symbol (Spiral/Leaf-ish) */}
					<path
						d="M80,27 a3,3 0 1,1 0,-0.1"
						fill="none"
						stroke="#334155"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
					<path
						d="M90,27 l-5,5 l5,0"
						fill="none"
						stroke="#334155"
						strokeWidth="1.5"
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			{/* Eyes */}
			<div className="relative flex translate-y-2 items-center gap-10">
				{/* Left Eye - Fierce */}
				<div className="relative h-6 w-10 overflow-hidden">
					<div className="absolute top-0 h-4 w-10 origin-left rotate-12 bg-slate-900" />
					<div className="absolute bottom-0 h-2 w-10 bg-white" />
					<div className="absolute top-2 left-3 h-2 w-2 rounded-full bg-black" />
				</div>

				{/* Right Eye - Fierce */}
				<div className="relative h-6 w-10 overflow-hidden">
					<div className="absolute top-0 h-4 w-10 origin-right -rotate-12 bg-slate-900" />
					<div className="absolute bottom-0 h-2 w-10 bg-white" />
					<div className="absolute top-2 right-3 h-2 w-2 rounded-full bg-black" />
				</div>
			</div>

			{/* Mask (simulated by darkness or actual shape) */}
			{/* Since the orange is orange, let's put a dark mask over the mouth area */}
			<div className="absolute top-8 left-1/2 -translate-x-1/2">
				<svg width="100" height="60" viewBox="0 0 100 60">
					<path d="M10,10 Q50,60 90,10" fill="#1e3a8a" opacity="0.9" />
				</svg>
			</div>
		</>
	);
}

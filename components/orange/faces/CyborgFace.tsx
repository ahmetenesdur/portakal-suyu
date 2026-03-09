export default function CyborgFace() {
	return (
		<>
			{/* Metal Face Plate (Half face) */}
			<div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-full">
				<div className="absolute inset-0 bg-slate-400/90 mix-blend-multiply" />
				{/* Plate Lines */}
				<svg
					className="absolute inset-0 h-full w-full"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
				>
					<path
						d="M0,20 L50,20 L50,80 L0,80"
						fill="none"
						stroke="#334155"
						strokeWidth="2"
					/>
					<path d="M50,50 L100,50" fill="none" stroke="#334155" strokeWidth="2" />
					<circle cx="20" cy="20" r="2" fill="#1e293b" />
					<circle cx="20" cy="80" r="2" fill="#1e293b" />
					<circle cx="80" cy="50" r="2" fill="#1e293b" />
				</svg>
			</div>

			<div className="mt-2 flex gap-12">
				{/* Left Normal Eye */}
				<div className="h-6 w-4 rounded-full bg-slate-900" />

				{/* Right Robotic Eye */}
				<div className="relative -mt-1 h-8 w-8 rounded-full border-4 border-slate-700 bg-black">
					<div className="absolute inset-1 animate-pulse rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]" />
					<div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300" />
				</div>
			</div>

			{/* Cyborg Mouth */}
			<div className="absolute top-14 left-1/2 -translate-x-1/2">
				<svg width="50" height="20" viewBox="0 0 50 20">
					<path d="M5,10 L45,10" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
					{/* Stitches/Grille */}
					<path d="M15,5 L15,15" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
					<path d="M25,5 L25,15" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
					<path d="M35,5 L35,15" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
				</svg>
			</div>
		</>
	);
}

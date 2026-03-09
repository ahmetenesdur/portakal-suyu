export default function RobotFace() {
	return (
		<>
			{/* Antenna */}
			<div className="absolute -top-16 left-1/2 -translate-x-1/2">
				<svg width="36" height="55" viewBox="0 0 36 55">
					{/* Antenna stick */}
					<line x1="18" y1="55" x2="18" y2="18" stroke="#64748b" strokeWidth="3.5" />
					{/* Antenna segments */}
					<line x1="14" y1="35" x2="22" y2="35" stroke="#475569" strokeWidth="2" />
					{/* Antenna ball (outer glow) */}
					<circle cx="18" cy="14" r="12" fill="#22d3ee" opacity="0.2" />
					{/* Antenna ball (inner) */}
					<circle cx="18" cy="14" r="8" fill="#22d3ee" opacity="0.9" />
					{/* Highlight */}
					<circle cx="15" cy="11" r="3" fill="white" opacity="0.6" />
					{/* Lightning bolts */}
					<path
						d="M6,14 L10,12 L8,14 L12,12"
						stroke="#22d3ee"
						strokeWidth="1"
						fill="none"
						opacity="0.5"
					/>
					<path
						d="M24,14 L28,12 L26,14 L30,12"
						stroke="#22d3ee"
						strokeWidth="1"
						fill="none"
						opacity="0.5"
					/>
				</svg>
			</div>

			{/* Digital Eyes */}
			<div className="relative flex translate-y-1 items-center gap-8">
				{/* Left LED Eye */}
				<div className="relative flex h-14 w-16 items-center justify-center rounded-lg border-2 border-slate-600 bg-slate-900 shadow-[inset_0_0_10px_rgba(34,211,238,0.15)]">
					<div className="grid grid-cols-3 gap-0.5">
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400/30" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400/30" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
					</div>
					{/* Scanline */}
					<div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-400/10 to-transparent" />
					{/* Glass reflection */}
					<div className="absolute top-0.5 left-1 h-2 w-6 rounded-full bg-white/10" />
				</div>

				{/* Right LED Eye */}
				<div className="relative flex h-14 w-16 items-center justify-center rounded-lg border-2 border-slate-600 bg-slate-900 shadow-[inset_0_0_10px_rgba(34,211,238,0.15)]">
					<div className="grid grid-cols-3 gap-0.5">
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400/30" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400/30" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
						<div className="h-2 w-2 rounded-sm bg-cyan-400" />
					</div>
					<div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-400/10 to-transparent" />
					<div className="absolute top-0.5 left-1 h-2 w-6 rounded-full bg-white/10" />
				</div>
			</div>

			{/* Mechanical Mouth */}
			<div className="absolute top-16 left-1/2 -translate-x-1/2">
				<div className="flex h-6 w-20 items-center justify-center gap-1.5 rounded-md border-2 border-slate-600 bg-slate-900 shadow-[inset_0_0_6px_rgba(34,211,238,0.1)]">
					<div className="h-1 w-2.5 rounded-full bg-cyan-400" />
					<div className="h-1 w-2.5 rounded-full bg-cyan-400/50" />
					<div className="h-1 w-2.5 rounded-full bg-cyan-400" />
					<div className="h-1 w-2.5 rounded-full bg-cyan-400/50" />
					<div className="h-1 w-2.5 rounded-full bg-cyan-400" />
				</div>
			</div>

			{/* Side bolts */}
			<div className="absolute top-4 -left-4">
				<div className="h-4 w-4 rounded-full border-2 border-slate-500 bg-slate-400 shadow-sm">
					<div className="absolute top-0.5 left-0.5 h-1 w-1 rounded-full bg-white/40" />
				</div>
			</div>
			<div className="absolute top-4 -right-4">
				<div className="h-4 w-4 rounded-full border-2 border-slate-500 bg-slate-400 shadow-sm">
					<div className="absolute top-0.5 left-0.5 h-1 w-1 rounded-full bg-white/40" />
				</div>
			</div>
		</>
	);
}

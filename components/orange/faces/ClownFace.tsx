export default function ClownFace() {
	return (
		<>
			{/* Clown Hair (Sides) */}
			<div className="absolute top-0 -left-6 flex gap-1">
				<div className="h-10 w-10 rounded-full bg-red-500 shadow-sm" />
				<div className="relative -top-4 h-12 w-12 rounded-full bg-blue-500 shadow-sm" />
			</div>
			<div className="absolute top-0 -right-6 flex gap-1">
				<div className="relative -top-4 h-12 w-12 rounded-full bg-green-500 shadow-sm" />
				<div className="h-10 w-10 rounded-full bg-yellow-400 shadow-sm" />
			</div>

			{/* Colorful Eyes */}
			<div className="relative mt-2 flex items-center gap-12">
				{/* Left Eye Make-up */}
				<div className="relative">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						className="absolute -top-3 -left-2 text-blue-500"
					>
						<path
							d="M12,0 L14,8 L22,10 L14,12 L12,20 L10,12 L2,10 L10,8 Z"
							fill="currentColor"
						/>
					</svg>
					<div className="relative z-10 h-5 w-5 rounded-full bg-slate-900" />
				</div>
				{/* Right Eye Make-up */}
				<div className="relative">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						className="absolute -top-3 -left-2 text-pink-500"
					>
						<path
							d="M12,0 L14,8 L22,10 L14,12 L12,20 L10,12 L2,10 L10,8 Z"
							fill="currentColor"
						/>
					</svg>
					<div className="relative z-10 h-5 w-5 rounded-full bg-slate-900" />
				</div>
			</div>

			{/* Red Nose */}
			<div className="absolute top-8 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-red-600 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.3)]">
				<div className="absolute top-1.5 left-2 h-2.5 w-2.5 rounded-full bg-white/60 blur-[1px]" />
			</div>

			{/* Big Clown Smile */}
			<div className="absolute top-16 left-1/2 -translate-x-1/2">
				<svg width="80" height="40" viewBox="0 0 80 40">
					<path d="M5,5 Q40,40 75,5 L65,15 Q40,30 15,15 Z" fill="#ef4444" />
					<path
						d="M5,5 Q40,40 75,5"
						fill="none"
						stroke="#b91c1c"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<path
						d="M15,15 Q40,25 65,15"
						fill="none"
						stroke="#b91c1c"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<path d="M5,5 A8,8 0 1,1 15,15 Z" fill="#ef4444" />
					<path d="M65,15 A8,8 0 1,1 75,5 Z" fill="#ef4444" />
				</svg>
			</div>
		</>
	);
}

export default function PirateFace() {
	return (
		<>
			{/* Eye Patch and Scar */}
			<div className="relative mt-2 flex items-center gap-12">
				{/* Left Eye (Normal but angry) */}
				<div className="relative h-6 w-8 overflow-hidden">
					<div className="absolute top-0 h-4 w-8 origin-left rotate-12 bg-slate-900" />
					<div className="absolute bottom-0 h-2 w-8 bg-white" />
				</div>

				{/* Right Eye (Eye Patch) */}
				<div className="relative h-8 w-10">
					{/* Patch Strap */}
					<div className="absolute top-1/2 -left-12 h-1.5 w-32 -translate-y-1/2 rotate-12 bg-slate-900" />
					{/* Patch Itself */}
					<div className="absolute inset-0 rounded-full bg-slate-900" />
				</div>
			</div>

			{/* Scar */}
			<div className="absolute top-0 left-6">
				<svg width="20" height="30" viewBox="0 0 20 30">
					<path
						d="M5,5 L15,25"
						stroke="#991b1b"
						strokeWidth="2"
						strokeLinecap="round"
						opacity="0.7"
					/>
					<path
						d="M8,12 L12,10"
						stroke="#991b1b"
						strokeWidth="1.5"
						strokeLinecap="round"
						opacity="0.7"
					/>
					<path
						d="M10,18 L14,16"
						stroke="#991b1b"
						strokeWidth="1.5"
						strokeLinecap="round"
						opacity="0.7"
					/>
				</svg>
			</div>

			{/* Smirk */}
			<div className="absolute top-12 left-1/2 -translate-x-1/2">
				<svg width="40" height="20" viewBox="0 0 40 20">
					<path
						d="M5,15 Q20,15 35,5"
						fill="none"
						stroke="#1e293b"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<path d="M35,5 L35,10" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
				</svg>
			</div>
		</>
	);
}

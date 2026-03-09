import { motion } from "framer-motion";

export default function CoolFace() {
	return (
		<>
			{/* Sleek Wayfarer Sunglasses */}
			<div className="relative -top-2 z-10 flex w-full justify-center">
				<svg width="120" height="40" viewBox="0 0 120 40" className="drop-shadow-md">
					<defs>
						{/* Sleek Lens Gradient */}
						<linearGradient id="coolLens" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#0f172a" />
							<stop offset="50%" stopColor="#1e293b" />
							<stop offset="100%" stopColor="#020617" />
						</linearGradient>

						<clipPath id="lensClip">
							{/* Left Lens */}
							<path d="M 10,12 L 50,12 L 48,32 Q 45,38 30,38 Q 15,38 12,32 Z" />
							{/* Right Lens */}
							<path d="M 70,12 L 110,12 L 108,32 Q 105,38 90,38 Q 75,38 72,32 Z" />
						</clipPath>
					</defs>

					{/* Thick Top Frame connecting both lenses */}
					<path d="M 5,10 Q 60,5 115,10 L 115,15 Q 60,10 5,15 Z" fill="#020617" />

					{/* Lenses and Frames */}
					<path
						d="M 10,12 L 50,12 L 48,32 Q 45,38 30,38 Q 15,38 12,32 Z"
						fill="url(#coolLens)"
						stroke="#020617"
						strokeWidth="3"
						strokeLinejoin="round"
					/>
					<path
						d="M 70,12 L 110,12 L 108,32 Q 105,38 90,38 Q 75,38 72,32 Z"
						fill="url(#coolLens)"
						stroke="#020617"
						strokeWidth="3"
						strokeLinejoin="round"
					/>

					{/* Static Glares and Animated Shine */}
					<g clipPath="url(#lensClip)">
						{/* Left Static Glare */}
						<path d="M 15,0 L 25,0 L 15,40 L 5,40 Z" fill="white" opacity="0.15" />
						<path d="M 30,0 L 33,0 L 23,40 L 20,40 Z" fill="white" opacity="0.08" />

						{/* Right Static Glare */}
						<path d="M 75,0 L 85,0 L 75,40 L 65,40 Z" fill="white" opacity="0.15" />
						<path d="M 90,0 L 93,0 L 83,40 L 80,40 Z" fill="white" opacity="0.08" />

						{/* Animated Shine Reflection */}
						<motion.path
							d="M -20,0 L -5,0 L -25,40 L -40,40 Z"
							fill="white"
							opacity="0.4"
							animate={{ x: [0, 160, 160] }}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "linear",
								times: [0, 0.3, 1], // Moves fast across, then waits
							}}
						/>
					</g>
				</svg>
			</div>

			{/* Confident Smirk */}
			<div className="absolute top-12 left-1/2 -translate-x-1/2">
				<svg width="40" height="20" viewBox="0 0 40 20" className="drop-shadow-sm">
					{/* Minimalist clean smirk */}
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

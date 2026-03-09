export default function LoveFace() {
	return (
		<>
			{/* Floating hearts cloud */}
			<div className="absolute -top-14 left-1/2 -translate-x-1/2">
				<svg width="120" height="50" viewBox="0 0 120 50">
					<defs>
						<linearGradient id="floatHeart1" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#fb7185" />
							<stop offset="100%" stopColor="#f43f5e" />
						</linearGradient>
						<linearGradient id="floatHeart2" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#f9a8d4" />
							<stop offset="100%" stopColor="#ec4899" />
						</linearGradient>
					</defs>
					{/* Large floating heart */}
					<g transform="translate(50, 5) scale(0.55)" opacity="0.8">
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							fill="url(#floatHeart1)"
						/>
					</g>
					{/* Medium floating heart */}
					<g transform="translate(15, 18) scale(0.4)" opacity="0.6">
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							fill="url(#floatHeart2)"
						/>
					</g>
					{/* Small floating heart */}
					<g transform="translate(92, 12) scale(0.3)" opacity="0.5">
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							fill="#fda4af"
						/>
					</g>
					{/* Tiny sparkle */}
					<circle cx="85" cy="8" r="1.5" fill="#fda4af" opacity="0.4" />
					<circle cx="30" cy="10" r="1" fill="#fda4af" opacity="0.3" />
				</svg>
			</div>

			{/* Heart Eyes */}
			<div className="relative flex translate-y-1 items-center gap-6">
				{/* Left Heart Eye */}
				<svg
					width="44"
					height="44"
					viewBox="0 0 24 24"
					className="animate-pulse drop-shadow-[0_2px_6px_rgba(244,63,94,0.5)]"
				>
					<defs>
						<linearGradient id="heartEyeL" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#fda4af" />
							<stop offset="40%" stopColor="#fb7185" />
							<stop offset="100%" stopColor="#e11d48" />
						</linearGradient>
					</defs>
					<path
						d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
						fill="url(#heartEyeL)"
						stroke="#9f1239"
						strokeWidth="0.6"
					/>
					{/* Glass shine */}
					<ellipse
						cx="8"
						cy="7.5"
						rx="3"
						ry="2"
						fill="white"
						opacity="0.55"
						transform="rotate(-30 8 7.5)"
					/>
					<ellipse
						cx="16"
						cy="7"
						rx="1.5"
						ry="1"
						fill="white"
						opacity="0.3"
						transform="rotate(-30 16 7)"
					/>
				</svg>

				{/* Right Heart Eye */}
				<svg
					width="44"
					height="44"
					viewBox="0 0 24 24"
					className="animate-pulse drop-shadow-[0_2px_6px_rgba(244,63,94,0.5)]"
				>
					<defs>
						<linearGradient id="heartEyeR" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#fda4af" />
							<stop offset="40%" stopColor="#fb7185" />
							<stop offset="100%" stopColor="#e11d48" />
						</linearGradient>
					</defs>
					<path
						d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
						fill="url(#heartEyeR)"
						stroke="#9f1239"
						strokeWidth="0.6"
					/>
					<ellipse
						cx="8"
						cy="7.5"
						rx="3"
						ry="2"
						fill="white"
						opacity="0.55"
						transform="rotate(-30 8 7.5)"
					/>
					<ellipse
						cx="16"
						cy="7"
						rx="1.5"
						ry="1"
						fill="white"
						opacity="0.3"
						transform="rotate(-30 16 7)"
					/>
				</svg>
			</div>

			{/* Blushing Cheeks (positioned between eyes and mouth) */}
			<div className="absolute top-7 -left-4 h-8 w-12 rounded-full bg-pink-400/50 blur-lg" />
			<div className="absolute top-7 -right-4 h-8 w-12 rounded-full bg-pink-400/50 blur-lg" />

			{/* Cute Cat Mouth :3 */}
			<div className="absolute top-14 left-1/2 -translate-x-1/2">
				<svg width="50" height="22" viewBox="0 0 50 22">
					{/* Left curve */}
					<path
						d="M8,8 Q16,18 25,8"
						fill="none"
						stroke="#1e293b"
						strokeWidth="3.5"
						strokeLinecap="round"
					/>
					{/* Right curve */}
					<path
						d="M25,8 Q34,18 42,8"
						fill="none"
						stroke="#1e293b"
						strokeWidth="3.5"
						strokeLinecap="round"
					/>
					{/* Center dot nose */}
					<circle cx="25" cy="6" r="2" fill="#1e293b" />
				</svg>
			</div>
		</>
	);
}

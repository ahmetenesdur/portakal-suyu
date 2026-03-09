export default function DevilFace() {
	return (
		<>
			{/* Tiny Anime Chibi Horns */}
			<div className="absolute -top-6 left-1/2 flex w-24 -translate-x-1/2 justify-between">
				{/* Left Horn */}
				<svg
					width="20"
					height="24"
					viewBox="0 0 20 24"
					className="-rotate-12 drop-shadow-sm"
				>
					<path
						d="M16,24 Q10,12 4,4 Q16,8 20,24 Z"
						fill="#ef4444"
						stroke="#991b1b"
						strokeWidth="1.5"
						strokeLinejoin="round"
					/>
				</svg>

				{/* Right Horn */}
				<svg
					width="20"
					height="24"
					viewBox="0 0 20 24"
					className="scale-x-[-1] rotate-12 drop-shadow-sm"
				>
					<path
						d="M16,24 Q10,12 4,4 Q16,8 20,24 Z"
						fill="#ef4444"
						stroke="#991b1b"
						strokeWidth="1.5"
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			{/* Anime Mischievous (> <) Eyes and Blush */}
			<div className="relative mt-2 flex w-full justify-center">
				<svg width="100" height="30" viewBox="0 0 100 30" className="drop-shadow-sm">
					{/* Left Blush */}
					<ellipse cx="20" cy="20" rx="10" ry="5" fill="#fca5a5" opacity="0.5" />
					{/* Left Eye (>) */}
					<path
						d="M 12,8 L 28,15 L 12,22"
						fill="none"
						stroke="#1e293b"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Right Blush */}
					<ellipse cx="80" cy="20" rx="10" ry="5" fill="#fca5a5" opacity="0.5" />
					{/* Right Eye (<) */}
					<path
						d="M 88,8 L 72,15 L 88,22"
						fill="none"
						stroke="#1e293b"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			{/* Cheeky Cat Mouth (:3) with One Tiny Fang */}
			<div className="absolute top-13 left-1/2 -translate-x-1/2">
				<svg width="40" height="20" viewBox="0 0 40 20" className="drop-shadow-sm">
					{/* The ":3" mouth lines */}
					<path
						d="M 10,8 Q 15,16 20,8 Q 25,16 30,8"
						fill="none"
						stroke="#1e293b"
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					{/* Minik şeytan dişi */}
					<path
						d="M 24,10 L 26,16 L 28,10 Z"
						fill="white"
						stroke="#1e293b"
						strokeWidth="1.5"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		</>
	);
}

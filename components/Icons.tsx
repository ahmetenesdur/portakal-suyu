export default function OrangeIcon({ className = "w-8 h-8" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 32 32"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<linearGradient
					id="lux-orange"
					x1="4"
					y1="4"
					x2="28"
					y2="28"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#FDBA74" /> {/* Orange-300 */}
					<stop offset="50%" stopColor="#FB923C" /> {/* Orange-400 */}
					<stop offset="100%" stopColor="#EA580C" /> {/* Orange-600 */}
				</linearGradient>
				<linearGradient
					id="lux-glow"
					x1="16"
					y1="0"
					x2="16"
					y2="32"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#FEF08A" stopOpacity="0.6" />
					<stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
				</linearGradient>
				<filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="1.5" result="blur" />
					<feComposite in="SourceGraphic" in2="blur" operator="over" />
				</filter>
			</defs>

			{/* Outer Glow/Aura */}
			<circle
				cx="16"
				cy="16"
				r="14"
				fill="url(#lux-glow)"
				opacity="0.5"
				filter="url(#glow-filter)"
			/>

			{/* Main Body */}
			<circle
				cx="16"
				cy="16"
				r="11"
				fill="url(#lux-orange)"
				stroke="#FED7AA"
				strokeWidth="1"
			/>

			{/* Cute Face */}
			{/* Eyes */}
			<circle cx="12.5" cy="15" r="1.5" fill="#431407" />
			<circle cx="19.5" cy="15" r="1.5" fill="#431407" />
			{/* Eye Highlights */}
			<circle cx="13" cy="14.5" r="0.5" fill="white" />
			<circle cx="20" cy="14.5" r="0.5" fill="white" />

			{/* Blush */}
			<ellipse cx="11" cy="17" rx="1.5" ry="0.8" fill="#FDA4AF" opacity="0.6" />
			<ellipse cx="21" cy="17" rx="1.5" ry="0.8" fill="#FDA4AF" opacity="0.6" />

			{/* Mouth (Tiny Smile) */}
			<path
				d="M15 17.5 Q16 18.5 17 17.5"
				stroke="#431407"
				strokeWidth="0.8"
				strokeLinecap="round"
			/>

			{/* Magical Sparkles */}
			<path d="M16 1.5L16.5 3L18 3.5L16.5 4L16 5.5L15.5 4L14 3.5L15.5 3Z" fill="#FEF9C3" />
			<path
				d="M28 10L28.5 11.5L30 12L28.5 12.5L28 14L27.5 12.5L26 12L27.5 11.5Z"
				fill="#FEF9C3"
				opacity="0.8"
			/>
			<path
				d="M4 22L4.5 23.5L6 24L4.5 24.5L4 26L3.5 24.5L2 24L3.5 23.5Z"
				fill="#FEF9C3"
				opacity="0.6"
			/>

			{/* Stylized Leaf (Crystal-like) */}
			<path
				d="M16 5C16 5 13 10 10 11C10 11 12 8 14 6C15 5 16 5 16 5Z"
				fill="#86EFAC"
				stroke="#22C55E"
				strokeWidth="0.5"
			/>
			<path
				d="M16 5C16 5 19 10 22 11C22 11 20 8 18 6C17 5 16 5 16 5Z"
				fill="#4ADE80"
				stroke="#15803D"
				strokeWidth="0.5"
			/>
		</svg>
	);
}

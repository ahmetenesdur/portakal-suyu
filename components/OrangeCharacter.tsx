import { motion } from "framer-motion";

type OrangeCharacterProps = {
	currentFace: number;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function OrangeCharacter({
	currentFace,
	onClick,
}: OrangeCharacterProps) {
	return (
		<div className="relative group">
			{/* Glow behind the orange */}
			<div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />

			<motion.button
				whileHover={{ scale: 1.05, rotate: 5 }}
				whileTap={{ scale: 0.9, rotate: -5 }}
				onClick={onClick}
				className="relative z-10 cursor-pointer outline-none select-none"
				style={{ touchAction: "manipulation" }}
			>
				{/* 3D Orange Body */}
				<div className="w-72 h-72 rounded-full bg-linear-to-br from-orange-400 via-orange-500 to-orange-700 shadow-[inset_-20px_-20px_60px_rgba(0,0,0,0.3),0_20px_40px_rgba(234,88,12,0.4)] border-4 border-orange-300/50 flex items-center justify-center relative overflow-hidden">
					{/* Texture/Pores */}
					<div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

					{/* Shine Effect */}
					<div className="absolute top-8 left-12 w-24 h-12 bg-white/40 rounded-full -rotate-12 blur-md" />
					<div className="absolute bottom-12 right-12 w-16 h-8 bg-orange-900/20 rounded-full -rotate-12 blur-md" />

					{/* Dynamic Face */}
					<div className="relative z-20 mt-4 transition-all duration-200">
						{currentFace === 0 && (
							// Default: Cute Stare
							<>
								<div className="flex gap-10">
									<div className="w-6 h-10 bg-black/80 rounded-full shadow-sm" />
									<div className="w-6 h-10 bg-black/80 rounded-full shadow-sm" />
								</div>
								<div className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-5 bg-black/60 rounded-b-full" />
							</>
						)}
						{currentFace === 1 && (
							// Happy: Closed Eyes
							<>
								<div className="flex gap-10 items-center">
									<div className="w-8 h-4 border-t-4 border-black/80 rounded-full mt-4" />
									<div className="w-8 h-4 border-t-4 border-black/80 rounded-full mt-4" />
								</div>
								<div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-6 bg-black/60 rounded-b-full" />
							</>
						)}
						{currentFace === 2 && (
							// Surprised: O O
							<>
								<div className="flex gap-10">
									<div className="w-8 h-8 bg-black/80 rounded-full shadow-sm" />
									<div className="w-8 h-8 bg-black/80 rounded-full shadow-sm" />
								</div>
								<div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-6 bg-black/60 rounded-full" />
							</>
						)}
						{currentFace === 3 && (
							// Wink
							<>
								<div className="flex gap-10 items-center">
									<div className="w-8 h-2 bg-black/80 rounded-full mt-2" />
									<div className="w-6 h-10 bg-black/80 rounded-full shadow-sm" />
								</div>
								<div className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-4 bg-black/60 rounded-b-full rotate-6" />
							</>
						)}
						{currentFace === 4 && (
							// Excited: > <
							<>
								<div className="flex gap-10 items-center">
									<div className="text-4xl font-black text-black/80 select-none">
										&gt;
									</div>
									<div className="text-4xl font-black text-black/80 select-none">
										&lt;
									</div>
								</div>
								<div className="absolute top-12 left-1/2 -translate-x-1/2 w-12 h-8 bg-black/60 rounded-b-full" />
							</>
						)}
					</div>
				</div>

				{/* Leaf */}
				<div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-tr-[100%] rounded-bl-[100%] -rotate-45 border-2 border-green-700/30 z-0 origin-bottom-left shadow-lg" />
			</motion.button>
		</div>
	);
}

"use client";

import { motion } from "framer-motion";

import OrangeCharacter from "@/components/OrangeCharacter";

export default function Loading() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-orange-50/50 p-4">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="relative flex flex-col items-center gap-8"
			>
				{/* Rotating Halo Effect */}
				<div className="absolute top-1/2 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite] rounded-full bg-linear-to-tr from-orange-300/10 via-pink-300/10 to-transparent blur-3xl" />

				<motion.div
					animate={{
						y: [0, -20, 0],
						rotate: [0, 5, -5, 0],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<OrangeCharacter currentFace={1} onClick={() => {}} />
				</motion.div>

				<div className="flex flex-col items-center gap-3">
					<motion.h2
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ duration: 1.5, repeat: Infinity }}
						className="font-baloo text-3xl font-black text-orange-900"
					>
						Portakallar Sıkılıyor...
					</motion.h2>

					{/* Custom Loading Bar */}
					<div className="h-2 w-48 overflow-hidden rounded-full bg-orange-100 ring-2 ring-orange-200">
						<motion.div
							className="h-full bg-linear-to-r from-orange-400 to-orange-600"
							animate={{ x: ["-100%", "0%", "100%"] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: "linear",
							}}
						/>
					</div>
				</div>
			</motion.div>
		</main>
	);
}

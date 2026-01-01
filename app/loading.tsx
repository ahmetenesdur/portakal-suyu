"use client";

import { motion } from "framer-motion";

import OrangeCharacter from "@/components/OrangeCharacter";

export default function Loading() {
	return (
		<main className="from-orange-rift-100 to-orange-rift-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br via-white p-4">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="relative flex flex-col items-center gap-8"
			>
				{/* Rotating Halo Effect */}
				<div className="from-lol-gold-400/20 via-orange-rift-300/20 absolute top-1/2 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite] rounded-full bg-linear-to-tr to-transparent blur-3xl" />

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
						className="font-baloo text-orange-rift-900 text-3xl font-black"
					>
						Portakallar Sıkılıyor...
					</motion.h2>

					{/* Custom Loading Bar */}
					<div className="bg-orange-rift-100 ring-orange-rift-200 h-2 w-48 overflow-hidden rounded-full ring-2">
						<motion.div
							className="from-orange-rift-400 to-orange-rift-600 h-full bg-linear-to-r"
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

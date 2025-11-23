"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

type SoundToggleProps = {
	isMuted: boolean;
	toggleMute: () => void;
};

export default function SoundToggle({ isMuted, toggleMute }: SoundToggleProps) {
	return (
		<motion.button
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			onClick={toggleMute}
			className="fixed bottom-6 left-6 z-50 w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 text-orange-600 hover:bg-orange-50 transition-colors group cursor-pointer"
			title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
		>
			<div className="relative">
				<Icon
					icon={isMuted ? "lucide:volume-x" : "lucide:volume-2"}
					width="24"
					height="24"
					className="transition-transform group-hover:scale-110"
				/>
			</div>
		</motion.button>
	);
}

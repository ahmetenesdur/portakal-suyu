"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

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
			className="group fixed bottom-6 left-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/80 text-orange-600 shadow-lg backdrop-blur-md transition-colors hover:bg-orange-50"
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

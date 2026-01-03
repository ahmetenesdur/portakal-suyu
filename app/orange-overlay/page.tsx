"use client";

import { motion } from "framer-motion";

import OrangeCharacter from "@/components/OrangeCharacter";
import { useOrangeController } from "@/hooks/useOrangeController";
import { IDLE_ANIMATIONS } from "@/lib/constants";

export default function OrangeOverlayPage() {
	const { currentFace, isClient, containerControls, scaleControls, handleManualChange } =
		useOrangeController();

	if (!isClient) return null;

	// Merge the specific idle animation with the dynamic scale controls
	const currentAnimVariant = IDLE_ANIMATIONS[currentFace] || IDLE_ANIMATIONS[0];

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-transparent">
			{/* High-level container for Face Swapping "Pop" animations */}
			<motion.div
				animate={containerControls}
				initial={{ scale: 1 }}
				className="flex flex-col items-center justify-center"
			>
				{/* Inner container for Blinking "Squash" animations */}
				<motion.div animate={scaleControls} className="relative">
					{/* Innermost container for "Idle" bobbing/rotating animations */}
					<motion.div variants={currentAnimVariant} animate="animate">
						{/* Manual trigger enabled via click for testing/fun */}
						<OrangeCharacter currentFace={currentFace} onClick={handleManualChange} />
					</motion.div>
				</motion.div>
			</motion.div>
		</div>
	);
}

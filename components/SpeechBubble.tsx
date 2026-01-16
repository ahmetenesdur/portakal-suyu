"use client";

import { AnimatePresence, motion } from "framer-motion";

import { ChatReaction, ChatReactionType } from "@/lib/kick/types";

interface SpeechBubbleProps {
	reaction: ChatReaction | null;
}

const DECORATIONS: Record<ChatReactionType, { emoji: string; animation: object }> = {
	greeting: { emoji: "✨", animation: { scale: [0, 1.2, 1] } },
	farewell: { emoji: "👋", animation: { rotate: [0, 20, -20, 20, 0] } },
	cheer: { emoji: "⭐", animation: { y: [0, -8, 0], scale: [1, 1.2, 1] } },
	question: { emoji: "🍊", animation: { opacity: [0, 1], y: [5, 0] } },
};

/**
 * Speech bubble component for displaying chat reactions
 */
export default function SpeechBubble({ reaction }: SpeechBubbleProps) {
	const decoration = reaction ? DECORATIONS[reaction.type] : null;

	return (
		<AnimatePresence mode="wait">
			{reaction && (
				<motion.div
					key={reaction.id}
					initial={{ opacity: 0, scale: 0.8, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: -20 }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 25,
					}}
					className="absolute -top-4 right-[10%] z-50 -translate-y-full"
				>
					<div className="relative rounded-2xl border-2 border-orange-200 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-sm">
						<div className="absolute inset-0 rounded-2xl bg-linear-to-br from-orange-50 to-transparent opacity-50" />
						<div className="relative z-10">
							<p className="text-center text-lg font-bold whitespace-nowrap text-orange-900">
								{reaction.response}
							</p>
						</div>
					</div>

					{decoration && (
						<motion.div
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1, ...decoration.animation }}
							transition={{ delay: 0.2, duration: 0.4 }}
							className="absolute -top-3 -right-3 text-2xl"
						>
							{decoration.emoji}
						</motion.div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

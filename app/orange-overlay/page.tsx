"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import OrangeCharacter from "@/components/OrangeCharacter";
import SpeechBubble from "@/components/SpeechBubble";
import { IDLE_ANIMATIONS } from "@/constants/orange";
import { useKickChat } from "@/hooks/useKickChat";
import { useOrangeController } from "@/hooks/useOrangeController";
import { getRandomResponse } from "@/lib/services/kick";
import { ChatReaction, ChatReactionType } from "@/types/kick";

function OrangeOverlayContent() {
	const searchParams = useSearchParams();
	const chatroomId = searchParams.get("chatroomId");
	const isTestMode = searchParams.get("test") === "true";

	const {
		currentFace,
		isClient,
		containerControls,
		scaleControls,
		handleManualChange,
		triggerReactionFace,
	} = useOrangeController();

	const { connectionStatus, currentReaction, error } = useKickChat({
		chatroomId,
		enabled: !!chatroomId,
	});

	const [testReaction, setTestReaction] = useState<ChatReaction | null>(null);
	const activeReaction = isTestMode ? testReaction : currentReaction;

	const triggerTestReaction = useCallback(
		(type: ChatReactionType) => {
			const reaction: ChatReaction = {
				id: `test-${Date.now()}`,
				type,
				username: "TestUser",
				response: getRandomResponse(type, "TestUser"),
				timestamp: Date.now(),
			};
			setTestReaction(reaction);
			triggerReactionFace(type);
		},
		[triggerReactionFace]
	);

	useEffect(() => {
		if (!testReaction) return;
		const timer = setTimeout(() => setTestReaction(null), 4000);
		return () => clearTimeout(timer);
	}, [testReaction]);

	useEffect(() => {
		if (currentReaction && !isTestMode) {
			triggerReactionFace(currentReaction.type);
		}
	}, [currentReaction, triggerReactionFace, isTestMode]);

	useEffect(() => {
		if (chatroomId) {
			console.log("[OrangeOverlay] Kick connection status:", connectionStatus);
			if (error) console.error("[OrangeOverlay] Kick error:", error);
		}
	}, [chatroomId, connectionStatus, error]);

	if (!isClient) return null;

	const currentAnimVariant = IDLE_ANIMATIONS[currentFace] || IDLE_ANIMATIONS[0];

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-transparent">
			{isTestMode && (
				<div className="fixed top-4 right-4 z-100 flex w-48 flex-col gap-2 rounded-xl border border-white/10 bg-black/80 p-4 text-white shadow-2xl backdrop-blur-md">
					<h3 className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
						Test Controls
					</h3>

					<button
						onClick={() => triggerTestReaction("greeting")}
						className="rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/20"
					>
						Greeting
					</button>

					<button
						onClick={() => triggerTestReaction("farewell")}
						className="rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/20"
					>
						Farewell
					</button>

					<button
						onClick={() => triggerTestReaction("cheer")}
						className="rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/20"
					>
						Cheer
					</button>

					<button
						onClick={() => triggerTestReaction("question")}
						className="rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/20"
					>
						Question
					</button>

					<hr className="my-2 border-white/10" />

					<button
						onClick={() => setTestReaction(null)}
						className="rounded-lg bg-red-500/20 px-3 py-2 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30"
					>
						Clear Reaction
					</button>
				</div>
			)}

			<motion.div
				animate={containerControls}
				initial={{ scale: 1 }}
				className="relative flex flex-col items-center justify-center"
			>
				<SpeechBubble reaction={activeReaction} />

				<motion.div animate={scaleControls} className="relative">
					<motion.div variants={currentAnimVariant} animate="animate">
						<OrangeCharacter currentFace={currentFace} onClick={handleManualChange} />
					</motion.div>
				</motion.div>
			</motion.div>

			{chatroomId && (
				<div className="fixed bottom-4 left-4 z-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
					<div
						className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm ${
							connectionStatus === "connected"
								? "bg-green-500/20 text-green-400"
								: connectionStatus === "connecting"
									? "bg-yellow-500/20 text-yellow-400"
									: connectionStatus === "error"
										? "bg-red-500/20 text-red-400"
										: "bg-gray-500/20 text-gray-400"
						}`}
					>
						<div
							className={`h-2 w-2 rounded-full ${
								connectionStatus === "connected"
									? "bg-green-400"
									: connectionStatus === "connecting"
										? "animate-pulse bg-yellow-400"
										: connectionStatus === "error"
											? "bg-red-400"
											: "bg-gray-400"
							}`}
						/>
						{connectionStatus === "connected" && "Chat Bağlı"}
						{connectionStatus === "connecting" && "Bağlanıyor..."}
						{connectionStatus === "error" && "Bağlantı Hatası"}
						{connectionStatus === "disconnected" && "Bağlantı Kesildi"}
					</div>
				</div>
			)}

			{isTestMode && (
				<div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-sm">
					<span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
					Test Mode
				</div>
			)}
		</div>
	);
}

export default function OrangeOverlayPage() {
	return (
		<Suspense fallback={null}>
			<OrangeOverlayContent />
		</Suspense>
	);
}

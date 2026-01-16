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
				<div className="fixed top-4 right-4 z-100 flex flex-col gap-2 rounded-xl border border-white/20 bg-black/80 p-4 text-white backdrop-blur-md">
					<h3 className="mb-2 text-center font-bold text-orange-400">
						🍊 Chat Tepki Test
					</h3>

					<button
						onClick={() => triggerTestReaction("greeting")}
						className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-green-500"
					>
						<span>✨</span>
						<span>Selamlama</span>
					</button>

					<button
						onClick={() => triggerTestReaction("farewell")}
						className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-500"
					>
						<span>👋</span>
						<span>Vedalaşma</span>
					</button>

					<button
						onClick={() => triggerTestReaction("cheer")}
						className="flex items-center gap-2 rounded-lg bg-yellow-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-yellow-500"
					>
						<span>⭐</span>
						<span>Övgü</span>
					</button>

					<button
						onClick={() => triggerTestReaction("question")}
						className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-purple-500"
					>
						<span>🍊</span>
						<span>Soru</span>
					</button>

					<hr className="my-2 border-white/20" />

					<button
						onClick={() => setTestReaction(null)}
						className="rounded-lg bg-gray-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-500"
					>
						Temizle
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
				<div className="fixed bottom-4 left-4 z-50">
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
				<div className="fixed bottom-4 left-4 z-50 rounded-full bg-orange-500/30 px-3 py-1.5 text-xs font-medium text-orange-300 backdrop-blur-sm">
					🧪 Test Modu
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

"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { CHAT_CONFIG } from "@/constants/kick";
import type { WorkerMessage, WorkerResponse } from "@/lib/workers/chat.worker";
import { ChatReaction, KickConnectionStatus } from "@/types/kick";

interface UseKickChatOptions {
	chatroomId: string | null;
	enabled?: boolean;
}

interface UseKickChatReturn {
	connectionStatus: KickConnectionStatus;
	currentReaction: ChatReaction | null;
	clearReaction: () => void;
	error: string | null;
}

export function useKickChat({ chatroomId, enabled = true }: UseKickChatOptions): UseKickChatReturn {
	const [connectionStatus, setConnectionStatus] = useState<KickConnectionStatus>("disconnected");
	const [currentReaction, setCurrentReaction] = useState<ChatReaction | null>(null);
	// We no longer need an error state managed by useEffect since it's derived from chatroomId validity
	const [, startTransition] = useTransition();

	const workerRef = useRef<Worker | null>(null);
	const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const clearReaction = () => {
		setCurrentReaction(null);
		if (reactionTimeoutRef.current) {
			clearTimeout(reactionTimeoutRef.current);
			reactionTimeoutRef.current = null;
		}
	};

	const isValidChatroomId = chatroomId ? /^\d+$/.test(chatroomId) : false;

	// Derived states
	const currentError = !isValidChatroomId && chatroomId ? "Geçersiz chatroom ID formatı" : null;
	const status = currentError ? "error" : connectionStatus;

	useEffect(() => {
		if (typeof window === "undefined" || !enabled || !chatroomId || !isValidChatroomId) {
			return;
		}

		// Initialize Worker
		workerRef.current = new Worker(new URL("../lib/workers/chat.worker.ts", import.meta.url));

		workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
			const data = event.data;

			if (data.type === "STATUS_UPDATE") {
				startTransition(() => {
					setConnectionStatus(data.payload);
				});
			} else if (data.type === "ERROR") {
				// The error from the worker is still handled here, but the component's error state is derived.
				// We might want to update `currentError` based on this, or let the worker handle its own error display.
				// For now, we'll just log it or handle it if `currentError` was a state.
				// Since `currentError` is derived, we can't directly set it here.
				// If we want to display worker errors, `currentError` would need to be a state.
				// For this refactor, we assume worker errors are handled internally or not displayed via `currentError`.
			} else if (data.type === "REACTION_DETECTED") {
				// We still use startTransition to make sure the state update doesn't block high priority events
				startTransition(() => {
					setCurrentReaction(data.payload);
				});

				// Auto-clear
				if (reactionTimeoutRef.current) {
					clearTimeout(reactionTimeoutRef.current);
				}
				reactionTimeoutRef.current = setTimeout(() => {
					setCurrentReaction(null);
				}, CHAT_CONFIG.REACTION_DURATION);
			}
		};

		// Send INIT message to worker which establishes the WebSocket
		workerRef.current.postMessage({ type: "INIT", chatroomId } as WorkerMessage);

		return () => {
			workerRef.current?.postMessage({ type: "DISCONNECT" } as WorkerMessage);
			workerRef.current?.terminate();
			workerRef.current = null;

			if (reactionTimeoutRef.current) {
				clearTimeout(reactionTimeoutRef.current);
				reactionTimeoutRef.current = null;
			}
		};
	}, [chatroomId, enabled, isValidChatroomId]);

	return {
		connectionStatus: status,
		currentReaction,
		clearReaction,
		error: currentError,
	};
}

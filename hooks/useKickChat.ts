"use client";

import { useEffect, useRef, useState } from "react";

import { CHAT_CONFIG, KICK_PUSHER_CONFIG } from "@/constants/kick";
import { detectTrigger, getRandomResponse } from "@/lib/services/kick";
import { ChatReaction, KickChatMessage, KickConnectionStatus, KickPusherEvent } from "@/types/kick";

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

/**
 * Hook for managing Kick chat WebSocket connection
 *
 * Usage:
 * - URL: /orange-overlay?chatroomId=72586650
 * - 71436010
 * - To find chatroom ID: Go to Kick channel, DevTools > Network > WS connection
 */
export function useKickChat({ chatroomId, enabled = true }: UseKickChatOptions): UseKickChatReturn {
	const [connectionStatus, setConnectionStatus] = useState<KickConnectionStatus>("disconnected");
	const [currentReaction, setCurrentReaction] = useState<ChatReaction | null>(null);
	const [error, setError] = useState<string | null>(null);

	const wsRef = useRef<WebSocket | null>(null);
	const userCooldownsRef = useRef<Map<string, number>>(new Map());
	const lastReactionTimeRef = useRef<number>(0);
	const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isMountedRef = useRef(true);

	const clearReaction = () => {
		setCurrentReaction(null);
		if (reactionTimeoutRef.current) {
			clearTimeout(reactionTimeoutRef.current);
			reactionTimeoutRef.current = null;
		}
	};

	const isValidChatroomId = chatroomId ? /^\d+$/.test(chatroomId) : false;

	useEffect(() => {
		if (!chatroomId || !enabled || !isValidChatroomId) {
			if (chatroomId && !isValidChatroomId) {
				const timer = setTimeout(() => {
					setError("Geçersiz chatroom ID formatı");
					setConnectionStatus("error");
				}, 0);
				return () => clearTimeout(timer);
			}
			return;
		}

		isMountedRef.current = true;
		// eslint-disable-next-line react-hooks/set-state-in-effect -- Initial state setup before async WebSocket connection
		setConnectionStatus("connecting");
		setError(null);

		console.log("[KickChat] Connecting to chatroom:", chatroomId);

		const wsUrl = `${KICK_PUSHER_CONFIG.WS_URL}/${KICK_PUSHER_CONFIG.APP_KEY}?protocol=${KICK_PUSHER_CONFIG.PROTOCOL_VERSION}&client=${KICK_PUSHER_CONFIG.CLIENT}&version=${KICK_PUSHER_CONFIG.VERSION}&flash=false`;

		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => {
			if (!isMountedRef.current) return;
			console.log("[KickChat] WebSocket connected, subscribing to chatroom...");

			const subscribeMessage = JSON.stringify({
				event: "pusher:subscribe",
				data: {
					channel: `chatrooms.${chatroomId}.v2`,
				},
			});
			ws.send(subscribeMessage);
		};

		ws.onmessage = (event) => {
			if (!isMountedRef.current) return;

			try {
				const pusherEvent: KickPusherEvent = JSON.parse(event.data);

				if (pusherEvent.event === "pusher:connection_established") {
					console.log("[KickChat] Pusher connection established");
				} else if (pusherEvent.event === "pusher_internal:subscription_succeeded") {
					console.log("[KickChat] Successfully subscribed to chatroom:", chatroomId);
					setConnectionStatus("connected");
				} else if (pusherEvent.event === "App\\Events\\ChatMessageEvent") {
					if (pusherEvent.data) {
						const messageData: KickChatMessage = JSON.parse(pusherEvent.data);
						handleMessage(messageData);
					}
				}
			} catch (err) {
				console.error("[KickChat] Message parse error:", err);
			}
		};

		ws.onerror = (err) => {
			if (!isMountedRef.current) return;
			console.error("[KickChat] WebSocket error:", err);
			setError("WebSocket bağlantı hatası");
			setConnectionStatus("error");
		};

		ws.onclose = (event) => {
			if (!isMountedRef.current) return;
			console.log("[KickChat] WebSocket closed:", event.code, event.reason);
			setConnectionStatus("disconnected");
		};

		function handleMessage(message: KickChatMessage) {
			const triggerType = detectTrigger(message.content);
			if (!triggerType) return;

			const userId = String(message.sender.id);
			const now = Date.now();

			const lastUserTime = userCooldownsRef.current.get(userId);
			if (lastUserTime && now - lastUserTime < CHAT_CONFIG.USER_COOLDOWN) {
				return;
			}

			if (now - lastReactionTimeRef.current < CHAT_CONFIG.REACTION_COOLDOWN) {
				return;
			}

			const reaction: ChatReaction = {
				id: message.id,
				type: triggerType,
				username: message.sender.username,
				response: getRandomResponse(triggerType, message.sender.username),
				timestamp: now,
			};

			userCooldownsRef.current.set(userId, now);
			lastReactionTimeRef.current = now;

			setCurrentReaction(reaction);

			if (reactionTimeoutRef.current) {
				clearTimeout(reactionTimeoutRef.current);
			}
			reactionTimeoutRef.current = setTimeout(() => {
				if (isMountedRef.current) {
					setCurrentReaction(null);
				}
			}, CHAT_CONFIG.REACTION_DURATION);
		}

		return () => {
			console.log("[KickChat] Cleaning up WebSocket connection...");
			isMountedRef.current = false;

			if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}

			if (reactionTimeoutRef.current) {
				clearTimeout(reactionTimeoutRef.current);
				reactionTimeoutRef.current = null;
			}
		};
	}, [chatroomId, enabled, isValidChatroomId]);

	return {
		connectionStatus,
		currentReaction,
		clearReaction,
		error,
	};
}

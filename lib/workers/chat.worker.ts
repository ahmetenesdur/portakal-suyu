import { CHAT_CONFIG, KICK_PUSHER_CONFIG } from "@/constants/kick";
import { detectTrigger, getRandomResponse } from "@/lib/services/kick";
import type {
	ChatReaction,
	KickChatMessage,
	KickConnectionStatus,
	KickPusherEvent,
} from "@/types/kick";

export type WorkerMessage = { type: "INIT"; chatroomId: string } | { type: "DISCONNECT" };

export type WorkerResponse =
	| { type: "REACTION_DETECTED"; payload: ChatReaction }
	| { type: "STATUS_UPDATE"; payload: KickConnectionStatus }
	| { type: "ERROR"; payload: string };

// State maintained inside the worker
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
let currentChatroomId: string | null = null;

// Processing State
const userCooldowns = new Map<string, number>();
let lastReactionTime = 0;
// Lightweight queue for message batching
let msgQueue: KickChatMessage[] = [];
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
	const message = event.data;

	if (message.type === "INIT") {
		if (ws) {
			ws.close();
		}
		currentChatroomId = message.chatroomId;
		userCooldowns.clear();
		lastReactionTime = 0;
		reconnectAttempts = 0;
		connectWebSocket();
	}

	if (message.type === "DISCONNECT") {
		cleanup();
	}
};

function cleanup() {
	if (ws) {
		ws.close();
		ws = null;
	}
	if (batchTimeout) {
		clearTimeout(batchTimeout);
		batchTimeout = null;
	}
	currentChatroomId = null;
	userCooldowns.clear();
	msgQueue = [];
	sendStatus("disconnected");
}

function sendStatus(status: KickConnectionStatus) {
	self.postMessage({ type: "STATUS_UPDATE", payload: status } as WorkerResponse);
}

function sendError(errorMsg: string) {
	self.postMessage({ type: "ERROR", payload: errorMsg } as WorkerResponse);
}

function connectWebSocket() {
	if (!currentChatroomId) return;

	sendStatus("connecting");

	const wsUrl = `${KICK_PUSHER_CONFIG.WS_URL}/${KICK_PUSHER_CONFIG.APP_KEY}?protocol=${KICK_PUSHER_CONFIG.PROTOCOL_VERSION}&client=${KICK_PUSHER_CONFIG.CLIENT}&version=${KICK_PUSHER_CONFIG.VERSION}&flash=false`;

	ws = new WebSocket(wsUrl);

	ws.onopen = () => {
		reconnectAttempts = 0;

		const subscribeMessage = JSON.stringify({
			event: "pusher:subscribe",
			data: { channel: `chatrooms.${currentChatroomId}.v2` },
		});

		ws?.send(subscribeMessage);
	};

	ws.onmessage = (event) => {
		try {
			const pusherEvent: KickPusherEvent = JSON.parse(event.data);

			if (pusherEvent.event === "pusher_internal:subscription_succeeded") {
				self.postMessage({ type: "STATUS_UPDATE", payload: "connected" });
				sendStatus("connected");
			} else if (pusherEvent.event === "App\\Events\\ChatMessageEvent" && pusherEvent.data) {
				const messageData: KickChatMessage = JSON.parse(pusherEvent.data);
				msgQueue.push(messageData);

				// Batching mechanism (100ms)
				if (msgQueue.length === 1) {
					batchTimeout = setTimeout(processBatch, 100);
				}
			}
		} catch (err) {
			console.error("[KickChat Worker] Message parse error:", err);
		}
	};

	ws.onerror = (err) => {
		console.error("[KickChat Worker] WebSocket error:", err);
		sendError("WebSocket bağlantı hatası");
		sendStatus("error");
	};

	ws.onclose = () => {
		sendStatus("disconnected");
		if (batchTimeout) {
			clearTimeout(batchTimeout);
			batchTimeout = null;
		}

		if (currentChatroomId && reconnectAttempts < CHAT_CONFIG.MAX_RECONNECT_ATTEMPTS) {
			reconnectAttempts++;
			const delay = CHAT_CONFIG.RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1);
			setTimeout(connectWebSocket, delay);
		} else if (currentChatroomId) {
			sendError("Bağlantı koptu. Lütfen sayfayı yenileyin.");
		}
	};
}

function processBatch() {
	if (msgQueue.length === 0) return;

	const messages = msgQueue.splice(0, msgQueue.length);
	const now = Date.now();

	for (const msg of messages) {
		const triggerType = detectTrigger(msg.content);
		if (!triggerType) continue;

		const userId = String(msg.sender.id);
		const lastUserTime = userCooldowns.get(userId);

		if (lastUserTime && now - lastUserTime < CHAT_CONFIG.USER_COOLDOWN) {
			continue;
		}
		if (now - lastReactionTime < CHAT_CONFIG.REACTION_COOLDOWN) {
			continue;
		}

		const reaction: ChatReaction = {
			id: msg.id,
			type: triggerType,
			username: msg.sender.username,
			response: getRandomResponse(triggerType, msg.sender.username),
			timestamp: now,
		};

		userCooldowns.set(userId, now);
		lastReactionTime = now;

		self.postMessage({
			type: "REACTION_DETECTED",
			payload: reaction,
		} as WorkerResponse);

		break; // Global cooldown is now active, drop the rest of the valid triggers in this batch
	}

	batchTimeout = null;
}

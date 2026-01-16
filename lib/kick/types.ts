/**
 * Kick.com API and WebSocket TypeScript definitions
 */

// Pusher WebSocket - Incoming message structure
export interface KickChatMessage {
	id: string;
	content: string;
	type: string;
	created_at: string;
	sender: {
		id: number;
		username: string;
		slug: string;
		identity?: {
			color?: string;
			badges?: Array<{
				type: string;
				text: string;
			}>;
		};
	};
}

// Pusher WebSocket - Event structure
export interface KickPusherEvent {
	event: string;
	channel?: string;
	data?: string;
}

// Reaction types
export type ChatReactionType = "greeting" | "farewell" | "cheer" | "question";

// Detected reaction
export interface ChatReaction {
	id: string;
	type: ChatReactionType;
	username: string;
	response: string;
	timestamp: number;
}

// WebSocket connection status
export type KickConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

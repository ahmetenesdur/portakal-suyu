/**
 * Kick Chat Helper Functions
 */

import { CHAT_RESPONSES, CHAT_TRIGGERS, REACTION_FACES } from "@/constants/kick";
import { ChatReactionType } from "@/types/kick";

/**
 * Returns a random response template with username replaced
 */
export function getRandomResponse(type: ChatReactionType, username: string): string {
	const responseMap: Record<ChatReactionType, readonly string[]> = {
		greeting: CHAT_RESPONSES.GREETING,
		farewell: CHAT_RESPONSES.FAREWELL,
		cheer: CHAT_RESPONSES.CHEER,
		question: CHAT_RESPONSES.QUESTION,
	};

	const templates = responseMap[type];
	const template = templates[Math.floor(Math.random() * templates.length)];
	return template.replace("{username}", username);
}

/**
 * Returns a random face index for the given reaction type
 */
export function getReactionFaceIndex(type: ChatReactionType): number {
	const faceMap: Record<ChatReactionType, readonly number[]> = {
		greeting: REACTION_FACES.GREETING,
		farewell: REACTION_FACES.FAREWELL,
		cheer: REACTION_FACES.CHEER,
		question: REACTION_FACES.QUESTION,
	};

	const faces = faceMap[type];
	return faces[Math.floor(Math.random() * faces.length)];
}

/**
 * Detects reaction type from message content
 */
export function detectTrigger(content: string): ChatReactionType | null {
	const normalizedContent = content.toLowerCase().trim();

	// Only check short messages (spam prevention)
	if (normalizedContent.length > 50) return null;

	// Check in order (priority matters)
	const triggerChecks: Array<{ type: ChatReactionType; triggers: readonly string[] }> = [
		{ type: "cheer", triggers: CHAT_TRIGGERS.CHEER },
		{ type: "question", triggers: CHAT_TRIGGERS.QUESTION },
		{ type: "greeting", triggers: CHAT_TRIGGERS.GREETING },
		{ type: "farewell", triggers: CHAT_TRIGGERS.FAREWELL },
	];

	for (const { type, triggers } of triggerChecks) {
		for (const trigger of triggers) {
			if (normalizedContent === trigger || normalizedContent.startsWith(trigger + " ")) {
				return type;
			}
		}
	}

	return null;
}

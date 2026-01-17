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
 * Removes punctuation and normalizes text for trigger matching
 */
function normalizeForTrigger(text: string): string {
	return (
		text
			.toLowerCase()
			.trim()
			// Remove common punctuation including apostrophe but keep Turkish characters
			.replace(/[!?.,;:'''`"()[\]{}@#$%^&*+=<>~|\\/_-]+/g, " ")
			// Normalize multiple spaces
			.replace(/\s+/g, " ")
			.trim()
	);
}

/**
 * Checks if a trigger exists in the content with word boundary awareness
 * Prevents false matches like "selam" inside "selamlar"
 */
function matchesTrigger(normalizedContent: string, trigger: string): boolean {
	// Exact match
	if (normalizedContent === trigger) return true;

	// Word boundary check using regex
	// \b doesn't work well with Turkish characters, so we use a custom approach
	const words = normalizedContent.split(" ");
	const triggerWords = trigger.split(" ");

	// For multi-word triggers, check if they appear consecutively
	if (triggerWords.length > 1) {
		const triggerPhrase = triggerWords.join(" ");
		const index = normalizedContent.indexOf(triggerPhrase);
		if (index === -1) return false;

		// Check word boundaries
		const before = index === 0 || normalizedContent[index - 1] === " ";
		const after =
			index + triggerPhrase.length === normalizedContent.length ||
			normalizedContent[index + triggerPhrase.length] === " ";
		return before && after;
	}

	// For single-word triggers, check if it's a complete word
	return words.includes(trigger);
}

/**
 * Detects reaction type from message content
 * Uses smart matching with punctuation removal and word boundary awareness
 */
export function detectTrigger(content: string): ChatReactionType | null {
	const normalizedContent = normalizeForTrigger(content);

	// Skip very long messages (likely spam or detailed conversation)
	// But allow reasonable message lengths
	if (normalizedContent.length > 100) return null;

	// Skip messages that are mostly emojis or special characters
	const letterCount = (content.match(/[\p{L}]/gu) || []).length;
	if (letterCount < 2) return null;

	// Trigger configuration with priority order
	// More specific triggers (longer phrases) should match first within each category
	const triggerChecks: Array<{ type: ChatReactionType; triggers: readonly string[] }> = [
		{ type: "cheer", triggers: CHAT_TRIGGERS.CHEER },
		{ type: "question", triggers: CHAT_TRIGGERS.QUESTION },
		{ type: "greeting", triggers: CHAT_TRIGGERS.GREETING },
		{ type: "farewell", triggers: CHAT_TRIGGERS.FAREWELL },
	];

	// Find all matching triggers with their lengths (prefer longer/more specific matches)
	let bestMatch: { type: ChatReactionType; length: number } | null = null;

	for (const { type, triggers } of triggerChecks) {
		for (const trigger of triggers) {
			if (matchesTrigger(normalizedContent, trigger)) {
				// Prefer longer triggers (more specific matches)
				if (!bestMatch || trigger.length > bestMatch.length) {
					bestMatch = { type, length: trigger.length };
				}
			}
		}
	}

	return bestMatch?.type ?? null;
}

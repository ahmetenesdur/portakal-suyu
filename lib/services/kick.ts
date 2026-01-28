/**
 * Kick Chat Helper Functions
 */

import {
	CHAT_RESPONSES,
	CHAT_TRIGGERS,
	FUZZY_MATCH_CONFIG,
	REACTION_FACES,
} from "@/constants/kick";
import { ChatReactionType } from "@/types/kick";

import {
	findBestFuzzyMatch,
	FuzzyMatchConfig,
	normalizeTurkish,
	removeRepeatedEnding,
} from "../utils/fuzzy-match";

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
function matchesTrigger(
	normalizedContent: string,
	contentWords: string[],
	trigger: string
): boolean {
	// Exact match
	if (normalizedContent === trigger) return true;

	// Word boundary check
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
	return contentWords.includes(trigger);
}

/**
 * Converts FUZZY_MATCH_CONFIG to FuzzyMatchConfig interface
 */
function getFuzzyConfig(): FuzzyMatchConfig {
	return {
		shortWordMaxDistance: FUZZY_MATCH_CONFIG.SHORT_WORD_MAX_DISTANCE,
		shortWordLength: FUZZY_MATCH_CONFIG.SHORT_WORD_LENGTH,
		mediumWordMinSimilarity: FUZZY_MATCH_CONFIG.MEDIUM_WORD_MIN_SIMILARITY,
		mediumWordMaxLength: FUZZY_MATCH_CONFIG.MEDIUM_WORD_MAX_LENGTH,
		longWordMinSimilarity: FUZZY_MATCH_CONFIG.LONG_WORD_MIN_SIMILARITY,
		normalizeTurkish: FUZZY_MATCH_CONFIG.NORMALIZE_TURKISH,
		removeRepeatedChars: FUZZY_MATCH_CONFIG.REMOVE_REPEATED_CHARS,
	};
}

/**
 * Attempts fuzzy matching on individual words in the content
 * Returns the best match result with similarity score
 */
function fuzzyMatchesTrigger(
	normalizedContent: string,
	contentWords: string[],
	triggers: readonly string[],
	config: FuzzyMatchConfig
): { trigger: string; similarity: number } | null {
	// Try to match each word against triggers
	for (const word of contentWords) {
		if (word.length < 2) continue; // Skip very short words

		const result = findBestFuzzyMatch(word, triggers, config);
		if (result) {
			return result;
		}
	}

	// Try matching the entire content (for multi-word phrases)
	// First, normalize for fuzzy: remove Turkish chars and repeated endings
	let processedContent = normalizedContent;
	if (config.normalizeTurkish) {
		processedContent = normalizeTurkish(processedContent);
	}
	if (config.removeRepeatedChars) {
		processedContent = removeRepeatedEnding(processedContent);
	}

	// Check multi-word triggers
	const multiWordTriggers = triggers.filter((t) => t.includes(" "));
	if (multiWordTriggers.length > 0) {
		const result = findBestFuzzyMatch(processedContent, multiWordTriggers, config);
		if (result) {
			return result;
		}
	}

	return null;
}

/**
 * Detects reaction type from message content
 * Uses smart matching with punctuation removal, word boundary awareness,
 * and fuzzy matching for typo tolerance
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

	// Phase 1: Try exact matching first (fast path)
	let bestMatch: { type: ChatReactionType; length: number } | null = null;
	const contentWords = normalizedContent.split(" ");

	for (const { type, triggers } of triggerChecks) {
		for (const trigger of triggers) {
			if (matchesTrigger(normalizedContent, contentWords, trigger)) {
				// Prefer longer triggers (more specific matches)
				if (!bestMatch || trigger.length > bestMatch.length) {
					bestMatch = { type, length: trigger.length };
				}
			}
		}
	}

	// If we found an exact match, return it
	if (bestMatch) {
		return bestMatch.type;
	}

	// Phase 2: Try fuzzy matching if enabled (slower path)
	if (FUZZY_MATCH_CONFIG.ENABLED) {
		const fuzzyConfig = getFuzzyConfig();
		let bestFuzzyMatch: {
			type: ChatReactionType;
			similarity: number;
			triggerLength: number;
		} | null = null;

		for (const { type, triggers } of triggerChecks) {
			const result = fuzzyMatchesTrigger(
				normalizedContent,
				contentWords,
				triggers,
				fuzzyConfig
			);
			if (result) {
				// Prefer higher similarity, then longer triggers
				if (
					!bestFuzzyMatch ||
					result.similarity > bestFuzzyMatch.similarity ||
					(result.similarity === bestFuzzyMatch.similarity &&
						result.trigger.length > bestFuzzyMatch.triggerLength)
				) {
					bestFuzzyMatch = {
						type,
						similarity: result.similarity,
						triggerLength: result.trigger.length,
					};
				}
			}
		}

		if (bestFuzzyMatch) {
			return bestFuzzyMatch.type;
		}
	}

	return null;
}

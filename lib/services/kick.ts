/**
 * Kick Chat Services
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
 * Normalizes text for trigger matching
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
 * Attempts fuzzy matching on individual words
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
 */
export function detectTrigger(content: string): ChatReactionType | null {
	const normalizedContent = normalizeForTrigger(content);

	// Skip very long messages
	if (normalizedContent.length > 150) return null;

	// Skip messages with too few letters
	const letterCount = (content.match(/[\p{L}]/gu) || []).length;
	if (letterCount < 2) return null;

	// Trigger configuration
	const triggerChecks: Array<{ type: ChatReactionType; triggers: readonly string[] }> = [
		{ type: "cheer", triggers: CHAT_TRIGGERS.CHEER },
		{ type: "question", triggers: CHAT_TRIGGERS.QUESTION },
		{ type: "greeting", triggers: CHAT_TRIGGERS.GREETING },
		{ type: "farewell", triggers: CHAT_TRIGGERS.FAREWELL },
	];

	// Initialize scores
	// Initialize scores
	const scores: Record<ChatReactionType, number> = {
		greeting: 0,
		farewell: 0,
		cheer: 0,
		question: 0,
	};

	const contentWords = normalizedContent.split(" ");
	const fuzzyConfig = FUZZY_MATCH_CONFIG.ENABLED ? getFuzzyConfig() : null;

	// Helper to add score
	const addScore = (type: ChatReactionType, score: number) => {
		scores[type] += score;
	};

	// Iterate through all categories
	for (const { type, triggers } of triggerChecks) {
		for (const trigger of triggers) {
			let matchScore = 0;

			// Check for exact match first (strongest signal)
			if (matchesTrigger(normalizedContent, contentWords, trigger)) {
				// Base score for exact match is 1.0
				matchScore = 1.0;
			}
			// Fallback to fuzzy match
			else if (fuzzyConfig) {
				const fuzzyResult = fuzzyMatchesTrigger(
					normalizedContent,
					contentWords,
					[trigger], // Check one by one to accumulate correctly
					fuzzyConfig
				);

				if (fuzzyResult) {
					matchScore = fuzzyResult.similarity;
				}
			}

			// If we have a match, calculate final weight based on length and specificity
			if (matchScore > 0) {
				// Length Bonus: Longer phrases get higher weight
				const lengthBonus = trigger.length * 0.1;

				// Final score accumulation
				addScore(type, matchScore + lengthBonus);
			}
		}
	}

	// Find the winner
	let winner: { type: ChatReactionType; score: number } | null = null;
	const threshold = 0.5; // Minimum score required to trigger anything

	for (const type of Object.keys(scores) as ChatReactionType[]) {
		const score = scores[type];
		if (score < threshold) continue;

		if (!winner || score > winner.score) {
			winner = { type, score };
		} else if (score === winner.score) {
			// Tie-breaking: Question > Greeting
			if (type === "question" && winner.type === "greeting") {
				winner = { type, score };
			}
			// Tie-breaking: Farewell > Greeting
			else if (type === "farewell" && winner.type === "greeting") {
				winner = { type, score };
			}
		}
	}

	return winner ? winner.type : null;
}

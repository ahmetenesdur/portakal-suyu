/**
 * Kick Chat Integration Constants
 */

// Pusher WebSocket configuration
export const KICK_PUSHER_CONFIG = {
	APP_KEY: "32cbd69e4b950bf97679",
	WS_URL: "wss://ws-us2.pusher.com/app",
	PROTOCOL_VERSION: 7,
	CLIENT: "js",
	VERSION: "8.4.0-rc2",
} as const;

// Chat trigger words (compared in lowercase)
export const CHAT_TRIGGERS = {
	GREETING: [
		"merhaba",
		"selam",
		"selammm",
		"selamlar",
		"selam millet",
		"selam chat",
		"selam portakal",
		"mrb",
		"slm",
		"sa",
		"sea",
		"hey",
		"heyy",
		"hi",
		"hello",
		"günaydın",
		"gunaydin",
		"tünaydın",
		"tunaydin",
		"iyi akşamlar",
		"iyi aksamlar",
		"iyi yayınlar",
		"iyi yayinlar",
		"kolay gelsin",
		"selamün aleyküm",
		"selamun aleykum",
		"geldim",
		"ben geldim",
		"buradayım",
		"buradayim",
		"hoşbulduk",
		"hosbulduk",
	],
	FAREWELL: [
		"görüşürüz",
		"gorusuruz",
		"görüşürük",
		"gorusuruk",
		"bay bay",
		"bb",
		"bye",
		"bye bye",
		"by",
		"by by",
		"hoşçakal",
		"hoscakal",
		"hoşçakalın",
		"güle güle",
		"gule gule",
		"görüşmek üzere",
		"gorusmek uzere",
		"iyi geceler",
		"allah'a emanet",
		"allaha emanet",
		"gidiyorum",
		"ben kaçar",
		"ben kacar",
		"ben kaçtım",
		"ben kactim",
		"kaçar ben",
		"müsaadenizle",
		"musadenizle",
	],
	CHEER: [
		"aferin",
		"helal",
		"helal olsun",
		"bravo",
		"süper",
		"super",
		"harika",
		"muhteşem",
		"muhtesem",
		"efsane",
		"mükemmel",
		"mukemmel",
		"güzel",
		"guzel",
		"çok iyi",
		"cok iyi",
		"nice",
		"pog",
		"pogchamp",
		"gg",
		"wp",
		"gj",
		"nt",
		"good job",
		"yapıyorsun bu sporu",
		"yapiyorsun bu sporu",
		"kral",
		"kralsın",
		"büyüksün",
		"eline sağlık",
		"eline saglik",
		"yargı",
		"şov",
		"sov",
		"aktı",
		"temiz",
		"clean",
		"başarılar",
		"tebrikler",
	],
	QUESTION: [
		"nasılsın",
		"nasilsin",
		"naber",
		"n'aber",
		"ne haber",
		"ne var ne yok",
		"nasıl gidiyor",
		"nasil gidiyor",
		"nasıl gidiyo",
		"nasil gidiyo",
		"keyifler nasıl",
		"keyifler nasil",
		"durumlar nasıl",
		"iyi misin",
		"iyi misiniz",
	],
} as const;

// Response templates ({username} is replaced with actual username)
export const CHAT_RESPONSES = {
	GREETING: [
		"Merhaba {username}! 🍊",
		"Selam {username}! ✨",
		"Hoş geldin {username}! 🎉",
		"Hey {username}! 👋",
		"Naber {username}! 🍊✨",
		"Aa {username} gelmiş! Hoş geldin! 🍊",
	],
	FAREWELL: [
		"Görüşürüz {username}! 👋",
		"Bay bay {username}! 🍊",
		"Hoşça kal {username}! ✨",
		"Kendine iyi bak {username}! 🍊👋",
		"Sonra görüşürüz {username}! 👋",
		"Yine bekleriz {username}! 🍊",
	],
	CHEER: [
		"Teşekkürler {username}! 🍊✨",
		"Çok sağ ol {username}! ✨",
		"Teşekkürler desteğin için! {username} 🍊",
		"Portakal power! 🍊⚡",
	],
	QUESTION: [
		"İyiyim {username}, teşekkürler! Sen nasılsın? 🍊",
		"Süper gidiyor {username}! ✨",
		"Çok iyiyim {username}! 🍊✨",
		"Her şey yolunda {username}! 👍",
		"Harikayım {username}! Sen? 🍊",
	],
} as const;

// Reaction types
export type ReactionType = "greeting" | "farewell" | "cheer" | "question";

// Chat configuration
export const CHAT_CONFIG = {
	REACTION_DURATION: 4000, // Reaction display duration (ms)
	USER_COOLDOWN: 30000, // Min interval for same user (ms)
	REACTION_COOLDOWN: 2000, // Min interval between reactions (ms)
	RECONNECT_DELAY: 5000, // WebSocket reconnect delay (ms)
	MAX_RECONNECT_ATTEMPTS: 5, // Max reconnect attempts
} as const;

// Face indices by reaction type
// 0: Default, 1: Happy, 2: Surprised, 3: Wink, 4: Excited, 5: Dead, 6: Dizzy, 7: Cool, 8: King, 10: Rich, 11: Ninja
export const REACTION_FACES = {
	GREETING: [1, 3, 4], // HappyFace, WinkFace, ExcitedFace
	FAREWELL: [3, 7], // WinkFace, CoolFace
	CHEER: [4], // ExcitedFace
	QUESTION: [1, 2, 3], // HappyFace, SurprisedFace, WinkFace
} as const;

/**
 * Returns a random response template with username replaced
 */
export function getRandomResponse(type: ReactionType, username: string): string {
	const responseMap: Record<ReactionType, readonly string[]> = {
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
export function getReactionFaceIndex(type: ReactionType): number {
	const faceMap: Record<ReactionType, readonly number[]> = {
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
export function detectTrigger(content: string): ReactionType | null {
	const normalizedContent = content.toLowerCase().trim();

	// Only check short messages (spam prevention)
	if (normalizedContent.length > 50) return null;

	// Check in order (priority matters)
	const triggerChecks: Array<{ type: ReactionType; triggers: readonly string[] }> = [
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

export const GAME_CONFIG = {
	GOAL: 1000,
	ANIMATION: {
		SPILL_DURATION: 3000,
		WAVE_DURATION: 20,
		GOD_RAYS_DURATION: 3000,
		SPARKLE_DURATION: 3000,
	},
	PARTICLES: {
		FLOATING_COUNT: 30,
		SPLASH_COUNT: 24,
		SPARKLE_COUNT: 20,
	},
	REFRESH_INTERVALS: {
		LEADERBOARD: 10000,
	},
};

export const SOCIAL_LINKS = [
	{
		name: "Instagram",
		icon: "simple-icons:instagram",
		url: "https://www.instagram.com/portakallsuyuu0",
		color: "text-[#E1306C] hover:bg-[#E1306C]/10",
	},
	{
		name: "Kick",
		icon: "simple-icons:kick",
		url: "https://kick.com/portakalsuyu0",
		color: "text-[#53FC18] hover:bg-[#53FC18]/10",
	},
	{
		name: "TikTok",
		icon: "simple-icons:tiktok",
		url: "https://www.tiktok.com/@portakallsuyuu0",
		color: "text-black hover:bg-black/5",
	},
	{
		name: "Discord",
		icon: "simple-icons:discord",
		url: "https://discord.gg/NdEfduN4nU",
		color: "text-[#5865F2] hover:bg-[#5865F2]/10",
	},
];

export const BUFF_ICONS: Record<string, string> = {
	"5": "lucide:coffee",
	"6": "lucide:zap",
	"7": "lucide:pill",
};

export const BUFF_THEMES: Record<string, { text: string; bg: string; border: string }> = {
	"5": {
		text: "text-amber-300",
		bg: "bg-amber-500/20",
		border: "border-amber-500/20",
	},
	"6": {
		text: "text-cyan-400",
		bg: "bg-cyan-500/20",
		border: "border-cyan-500/20",
	},
	"7": {
		text: "text-orange-500",
		bg: "bg-orange-500/20",
		border: "border-orange-500/20",
	},
};

export const BUFF_DURATIONS: Record<string, number> = {
	"5": 2 * 60 * 1000,
	"6": 3 * 60 * 1000,
	"7": 1 * 60 * 1000,
};

// --- Orange Overlay Constants ---
import { Variants } from "framer-motion";

export type Mood = "CHILL" | "ENERGY" | "SILLY";

export const MOODS: Mood[] = ["CHILL", "ENERGY", "SILLY"];

export const MOOD_FACES: Record<Mood, number[]> = {
	CHILL: [0, 3, 7], // Default, Wink, Cool
	ENERGY: [1, 4, 8, 10], // Happy, Excited, King, Rich
	SILLY: [2, 6, 9, 11, 5], // Surprised, Dizzy, Love, Ninja, Dead
};

export const AVAILABLE_FACES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Base Idle Animations (Continuous Loop)
export const IDLE_ANIMATIONS: Record<number, Variants> = {
	0: {
		// Default: Gentle float
		animate: {
			y: [0, -8, 0],
			transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
		},
	},
	1: {
		// Happy: Bouncy
		animate: {
			y: [0, -12, 0],
			scale: [1, 1.02, 1],
			transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
		},
	},
	2: {
		// Surprised: Pulse
		animate: {
			scale: [1, 1.05, 1],
			transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
		},
	},
	3: {
		// Wink: Tilt
		animate: {
			rotate: [0, 5, 0],
			y: [0, -5, 0],
			transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
		},
	},
	4: {
		// Excited: Fast Jump
		animate: {
			y: [0, -20, 0],
			transition: { duration: 0.6, repeat: Infinity, ease: "easeOut" },
		},
	},
	5: {
		// Dead: Hang
		animate: {
			rotate: [5, 10, 5],
			y: [10, 15, 10],
			transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
		},
	},
	6: {
		// Dizzy: Wobble
		animate: {
			rotate: [-5, 5, -5],
			x: [-3, 3, -3],
			transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
		},
	},
	7: {
		// Cool: Sway
		animate: {
			rotate: [-3, 3, -3],
			y: [0, -5, 0],
			transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
		},
	},
	8: {
		// King: Majestic
		animate: {
			y: [0, -10, 0],
			transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
		},
	},
	9: {
		// Love: Heartbeat
		animate: {
			scale: [1, 1.1, 1],
			transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
		},
	},
	10: {
		// Rich: Float
		animate: {
			y: [0, -12, 0],
			transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
		},
	},
	11: {
		// Ninja: Sneak
		animate: {
			x: [-10, 10, -10],
			transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
		},
	},
};

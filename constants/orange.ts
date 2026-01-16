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

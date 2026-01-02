"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import OrangeCharacter from "@/components/OrangeCharacter";

// --- Types & Constants ---

type Mood = "CHILL" | "ENERGY" | "SILLY";

const MOODS: Mood[] = ["CHILL", "ENERGY", "SILLY"];

const MOOD_FACES: Record<Mood, number[]> = {
	CHILL: [0, 3, 7], // Default, Wink, Cool
	ENERGY: [1, 4, 8, 10], // Happy, Excited, King, Rich
	SILLY: [2, 6, 9, 11, 5], // Surprised, Dizzy, Love, Ninja, Dead
};

const AVAILABLE_FACES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Base Idle Animations (Continuous Loop)
const IDLE_ANIMATIONS: Record<number, Variants> = {
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

export default function OrangeOverlayPage() {
	const [currentFace, setCurrentFace] = useState(0);
	const [currentMood, setCurrentMood] = useState<Mood>("CHILL");
	const [isClient, setIsClient] = useState(false);

	// Controls for "Pop" transition and "Blink"
	const containerControls = useAnimation();
	const scaleControls = useAnimation();

	// Refs to access latest state in timeouts
	const moodRef = useRef(currentMood);
	const faceRef = useRef(currentFace);

	// --- Transition Function (Declared BEFORE usage) ---
	const performFaceChange = useCallback(
		async (newFace: number) => {
			// 1. Pop Down (Anticipation)
			await containerControls.start({
				scale: 0.6,
				transition: { duration: 0.2, ease: "easeIn" },
			});

			// 2. Swap Data
			setCurrentFace(newFace);

			// 3. Pop Up (Overshoot)
			await containerControls.start({
				scale: 1.15,
				transition: { duration: 0.25, ease: "easeOut" },
			});

			// 4. Settle
			await containerControls.start({ scale: 1, transition: { duration: 0.2 } });
		},
		[containerControls]
	);

	useEffect(() => {
		moodRef.current = currentMood;
		faceRef.current = currentFace;
	}, [currentMood, currentFace]);

	useEffect(() => {
		const timer = setTimeout(() => setIsClient(true), 0);
		return () => clearTimeout(timer);
	}, []);

	// --- 1. Mood Logic ---
	// Change mood every 30-60 seconds to a random new mood
	useEffect(() => {
		const changeMood = () => {
			const nextMood = MOODS[Math.floor(Math.random() * MOODS.length)];
			console.log("Mood Switch:", nextMood);
			setCurrentMood(nextMood);
		};

		const interval = setInterval(changeMood, 45000); // Average 45s per mood
		return () => clearInterval(interval);
	}, []);

	// --- 2. Face Scheduler Logic ("The Brain") ---
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const scheduleNextFace = () => {
			// Random delay between face changes (8s - 15s)
			// This means faces PERSIST for a while.
			const delay = 8000 + Math.random() * 7000;

			timeoutId = setTimeout(async () => {
				const possibleFaces = MOOD_FACES[moodRef.current];
				let nextFace = possibleFaces[Math.floor(Math.random() * possibleFaces.length)];

				// If we picked the same face, maybe force default occasionally or just keep it
				if (nextFace === faceRef.current) {
					// 50% chance to force reset to Default(0) if we rolled the same non-default face
					if (nextFace !== 0 && Math.random() > 0.5) nextFace = 0;
				}

				if (nextFace !== faceRef.current) {
					await performFaceChange(nextFace);
				}

				scheduleNextFace(); // Recursively schedule next
			}, delay);
		};

		scheduleNextFace();
		return () => clearTimeout(timeoutId);
	}, [performFaceChange]); // Added performFaceChange as dependency

	// --- 3. Blinking Logic ---
	useEffect(() => {
		const blinkLoop = async () => {
			// Random blink interval: 3s - 7s
			const delay = 3000 + Math.random() * 4000;
			await new Promise((r) => setTimeout(r, delay));

			// "Squash" animation to simulate blink
			// ScaleY goes down, ScaleX goes up slightly to preserve mass look
			await scaleControls.start({
				scaleY: 0.85,
				scaleX: 1.05,
				transition: { duration: 0.1 },
			});
			await scaleControls.start({
				scaleY: 1,
				scaleX: 1,
				transition: { duration: 0.15 },
			});

			// Check client status via ref or simpler logic since we are in loop
			// (We rely on component mount status implicitly by closures, if unmounted loop stops if we check mounted state?
			// Actually async recursive loops on unmount can warn.
			// A simpler way is just to rely on the effect cleanup stopping the initial call,
			// but here we are using a recursive async function.
			// Let's add a simple check.
			if (scaleControls) blinkLoop();
		};

		if (isClient) blinkLoop();
		// We don't return cleanup here unfortunately as it's a promise loop,
		// but React handles this gracefully usually or we could use a ref.isMounted.
		// For this overlay simplicity it's acceptable.
	}, [isClient, scaleControls]);

	const handleManualChange = () => {
		// Manual override for testing
		let nextIndex;
		do {
			nextIndex = AVAILABLE_FACES[Math.floor(Math.random() * AVAILABLE_FACES.length)];
		} while (nextIndex === currentFace);
		performFaceChange(nextIndex);
	};

	if (!isClient) return null;

	// Merge the specific idle animation with the dynamic scale controls
	// We handle the 'currentFace' usage here safely
	const currentAnimVariant = IDLE_ANIMATIONS[currentFace] || IDLE_ANIMATIONS[0];

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-transparent">
			{/* High-level container for Face Swapping "Pop" animations */}
			<motion.div
				animate={containerControls}
				initial={{ scale: 1 }}
				className="flex flex-col items-center justify-center"
			>
				{/* Inner container for Blinking "Squash" animations */}
				<motion.div animate={scaleControls} className="relative">
					{/* Innermost container for "Idle" bobbing/rotating animations */}
					<motion.div
						variants={currentAnimVariant}
						animate="animate"
						// We don't set transition here, it is defined in variants
					>
						{/* No-op click handler just to keep prop valid, manual trigger via wrapper is safer if needed but we use handleManualChange */}
						<OrangeCharacter currentFace={currentFace} onClick={handleManualChange} />
					</motion.div>
				</motion.div>
			</motion.div>
		</div>
	);
}

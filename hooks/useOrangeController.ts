import { useAnimation } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { AVAILABLE_FACES, Mood, MOOD_FACES, MOODS } from "@/lib/constants";

export function useOrangeController() {
	const [currentFace, setCurrentFace] = useState(0);
	const [currentMood, setCurrentMood] = useState<Mood>("CHILL");
	const [isClient, setIsClient] = useState(false);

	// Controls for "Pop" transition and "Blink"
	const containerControls = useAnimation();
	const scaleControls = useAnimation();

	// Refs to access latest state in timeouts and track mounted status
	const moodRef = useRef(currentMood);
	const faceRef = useRef(currentFace);
	const isMounted = useRef(false);

	// Sync refs
	useEffect(() => {
		moodRef.current = currentMood;
		faceRef.current = currentFace;
	}, [currentMood, currentFace]);

	// Mount check
	useEffect(() => {
		isMounted.current = true;
		// Delay state update to avoid synchronous cascading render warning
		const timer = setTimeout(() => setIsClient(true), 0);
		return () => {
			isMounted.current = false;
			clearTimeout(timer);
		};
	}, []);

	// --- Transition Function ---
	const performFaceChange = useCallback(
		async (newFace: number) => {
			if (!isMounted.current) return;

			// 1. Pop Down (Anticipation)
			await containerControls.start({
				scale: 0.6,
				transition: { duration: 0.2, ease: "easeIn" },
			});

			if (!isMounted.current) return;

			// 2. Swap Data
			setCurrentFace(newFace);

			// 3. Pop Up (Overshoot)
			await containerControls.start({
				scale: 1.15,
				transition: { duration: 0.25, ease: "easeOut" },
			});

			if (!isMounted.current) return;

			// 4. Settle
			await containerControls.start({ scale: 1, transition: { duration: 0.2 } });
		},
		[containerControls]
	);

	// --- 1. Mood Logic ---
	useEffect(() => {
		const changeMood = () => {
			if (!isMounted.current) return;
			const nextMood = MOODS[Math.floor(Math.random() * MOODS.length)];
			console.log("[OrangeOverlay] Mood Switch:", nextMood);
			setCurrentMood(nextMood);
		};

		// 45s average mood switch
		const interval = setInterval(changeMood, 45000);
		return () => clearInterval(interval);
	}, []);

	// --- 2. Face Scheduler Logic ---
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const scheduleNextFace = () => {
			// Random delay between face changes (8s - 15s)
			const delay = 8000 + Math.random() * 7000;

			timeoutId = setTimeout(async () => {
				if (!isMounted.current) return;

				const possibleFaces = MOOD_FACES[moodRef.current];
				let nextFace = possibleFaces[Math.floor(Math.random() * possibleFaces.length)];

				// Logic to occasionally reset to default if staying on same face
				if (nextFace === faceRef.current) {
					// 50% chance to force reset to Default(0)
					if (nextFace !== 0 && Math.random() > 0.5) nextFace = 0;
				}

				if (nextFace !== faceRef.current) {
					await performFaceChange(nextFace);
				}

				if (isMounted.current) {
					scheduleNextFace(); // Recursively schedule next
				}
			}, delay);
		};

		scheduleNextFace();
		return () => clearTimeout(timeoutId);
	}, [performFaceChange]);

	// --- 3. Blinking Logic ---
	useEffect(() => {
		let blinkTimeout: NodeJS.Timeout;

		const scheduleBlink = () => {
			// Random blink interval: 3s - 7s
			const delay = 3000 + Math.random() * 4000;

			blinkTimeout = setTimeout(async () => {
				if (!isMounted.current) return;

				// "Squash" animation
				await scaleControls.start({
					scaleY: 0.85,
					scaleX: 1.05,
					transition: { duration: 0.1 },
				});

				if (!isMounted.current) return;

				await scaleControls.start({
					scaleY: 1,
					scaleX: 1,
					transition: { duration: 0.15 },
				});

				if (isMounted.current) {
					scheduleBlink();
				}
			}, delay);
		};

		if (isClient) {
			scheduleBlink();
		}

		return () => clearTimeout(blinkTimeout);
	}, [isClient, scaleControls]);

	const handleManualChange = useCallback(() => {
		let nextIndex;
		do {
			nextIndex = AVAILABLE_FACES[Math.floor(Math.random() * AVAILABLE_FACES.length)];
		} while (nextIndex === currentFace);
		performFaceChange(nextIndex);
	}, [currentFace, performFaceChange]);

	return {
		currentFace,
		currentMood,
		isClient,
		containerControls,
		scaleControls,
		handleManualChange,
	};
}

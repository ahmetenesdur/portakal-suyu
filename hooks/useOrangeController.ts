import { useAnimation } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { CHAT_CONFIG } from "@/constants/kick";
import { AVAILABLE_FACES, Mood, MOOD_FACES, MOODS } from "@/constants/orange";
import { getReactionFaceIndex } from "@/lib/services/kick";
import { ChatReactionType } from "@/types/kick";

export function useOrangeController() {
	const [currentFace, setCurrentFace] = useState(0);
	const [currentMood, setCurrentMood] = useState<Mood>("CHILL");
	const [isClient, setIsClient] = useState(false);
	const [isReacting, setIsReacting] = useState(false);

	const containerControls = useAnimation();
	const scaleControls = useAnimation();

	const moodRef = useRef(currentMood);
	const faceRef = useRef(currentFace);
	const isMounted = useRef(false);
	const previousFaceRef = useRef(0);
	const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		moodRef.current = currentMood;
		faceRef.current = currentFace;
	}, [currentMood, currentFace]);

	useEffect(() => {
		isMounted.current = true;
		const timer = setTimeout(() => setIsClient(true), 0);
		return () => {
			isMounted.current = false;
			clearTimeout(timer);
			if (reactionTimeoutRef.current) {
				clearTimeout(reactionTimeoutRef.current);
			}
		};
	}, []);

	const performFaceChange = useCallback(
		async (newFace: number) => {
			if (!isMounted.current) return;

			await containerControls.start({
				scale: 0.6,
				transition: { duration: 0.2, ease: "easeIn" },
			});

			if (!isMounted.current) return;
			setCurrentFace(newFace);

			await containerControls.start({
				scale: 1.15,
				transition: { duration: 0.25, ease: "easeOut" },
			});

			if (!isMounted.current) return;
			await containerControls.start({ scale: 1, transition: { duration: 0.2 } });
		},
		[containerControls]
	);

	const triggerReactionFace = useCallback(
		async (type: ChatReactionType) => {
			if (!isMounted.current || isReacting) return;

			previousFaceRef.current = faceRef.current;
			setIsReacting(true);

			const reactionFace = getReactionFaceIndex(type);
			await performFaceChange(reactionFace);

			if (reactionTimeoutRef.current) {
				clearTimeout(reactionTimeoutRef.current);
			}

			reactionTimeoutRef.current = setTimeout(async () => {
				if (!isMounted.current) return;
				await performFaceChange(previousFaceRef.current);
				setIsReacting(false);
			}, CHAT_CONFIG.REACTION_DURATION);
		},
		[isReacting, performFaceChange]
	);

	useEffect(() => {
		const changeMood = () => {
			if (!isMounted.current) return;
			const nextMood = MOODS[Math.floor(Math.random() * MOODS.length)];
			setCurrentMood(nextMood);
		};

		const interval = setInterval(changeMood, 45000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const scheduleNextFace = () => {
			const delay = 8000 + Math.random() * 7000;

			timeoutId = setTimeout(async () => {
				if (!isMounted.current || isReacting) {
					if (isMounted.current) scheduleNextFace();
					return;
				}

				const possibleFaces = MOOD_FACES[moodRef.current];
				let nextFace = possibleFaces[Math.floor(Math.random() * possibleFaces.length)];

				if (nextFace === faceRef.current) {
					if (nextFace !== 0 && Math.random() > 0.5) nextFace = 0;
				}

				if (nextFace !== faceRef.current) {
					await performFaceChange(nextFace);
				}

				if (isMounted.current) {
					scheduleNextFace();
				}
			}, delay);
		};

		scheduleNextFace();
		return () => clearTimeout(timeoutId);
	}, [performFaceChange, isReacting]);

	useEffect(() => {
		let blinkTimeout: NodeJS.Timeout;

		const scheduleBlink = () => {
			const delay = 3000 + Math.random() * 4000;

			blinkTimeout = setTimeout(async () => {
				if (!isMounted.current) return;

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
		isReacting,
		containerControls,
		scaleControls,
		handleManualChange,
		triggerReactionFace,
	};
}

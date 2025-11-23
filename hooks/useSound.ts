"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSound() {
	const [isMuted, setIsMuted] = useState(false);
	const audioContextRef = useRef<AudioContext | null>(null);

	useEffect(() => {
		// Initialize AudioContext on user interaction if needed,
		// but usually best to do it lazily or on first click to comply with autoplay policies.
		const AudioContextClass =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext;
		if (AudioContextClass) {
			audioContextRef.current = new AudioContextClass();
		}
	}, []);

	const playPop = useCallback(() => {
		if (isMuted || !audioContextRef.current) return;

		const ctx = audioContextRef.current;

		// Resume context if suspended (browser autoplay policy)
		if (ctx.state === "suspended") {
			ctx.resume();
		}

		const oscillator = ctx.createOscillator();
		const gainNode = ctx.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(ctx.destination);

		// Randomize pitch slightly for organic feel
		// Base frequency around 600-800Hz for a cute pop
		const baseFreq = 600;
		const randomOffset = Math.random() * 200 - 100; // +/- 100Hz
		oscillator.type = "sine";
		oscillator.frequency.setValueAtTime(
			baseFreq + randomOffset,
			ctx.currentTime
		);

		// Pitch drop for "pop" effect
		oscillator.frequency.exponentialRampToValueAtTime(
			100,
			ctx.currentTime + 0.1
		);

		// Volume envelope
		gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

		oscillator.start(ctx.currentTime);
		oscillator.stop(ctx.currentTime + 0.1);
	}, [isMuted]);

	const toggleMute = () => setIsMuted((prev) => !prev);

	return { playPop, isMuted, toggleMute };
}

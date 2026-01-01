"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

// Helpers for useSyncExternalStore
const STORAGE_KEY = "portakal_is_muted";

function getSnapshot() {
	if (typeof window === "undefined") return "false";
	return localStorage.getItem(STORAGE_KEY) || "false";
}

function getServerSnapshot() {
	return "false";
}

function subscribe(callback: () => void) {
	window.addEventListener("storage", callback);
	// Listen to custom event for same-window updates
	window.addEventListener("portakal:storage", callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener("portakal:storage", callback);
	};
}

export function useSound() {
	const isMutedString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	const isMuted = isMutedString === "true";

	const audioContextRef = useRef<AudioContext | null>(null);

	useEffect(() => {
		// Initialize AudioContext on user interaction if needed,
		// but usually best to do it lazily or on first click to comply with autoplay policies.
		const AudioContextClass =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
		oscillator.frequency.setValueAtTime(baseFreq + randomOffset, ctx.currentTime);

		// Pitch drop for "pop" effect
		oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

		// Volume envelope
		gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

		oscillator.start(ctx.currentTime);
		oscillator.stop(ctx.currentTime + 0.1);
	}, [isMuted]);

	const toggleMute = () => {
		const newValue = !isMuted;
		try {
			// Update localStorage
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
			// Dispatch custom event to notify useSyncExternalStore in this window
			window.dispatchEvent(new Event("portakal:storage"));
		} catch (error) {
			console.error("Failed to save sound settings:", error);
		}
	};

	return { playPop, isMuted, toggleMute };
}

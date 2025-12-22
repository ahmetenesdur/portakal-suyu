import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { addClick } from "@/lib/batching";
import { User } from "@supabase/supabase-js";

type UseClickerGameProps = {
	user: User | null;
	role?: string;
	basePower: number;
	activeBuffs: { id: string; expires_at: number; multiplier?: number }[];
	unlockedFaces?: number[];
};

export function useClickerGame({
	user,
	role,
	basePower,
	activeBuffs,
	unlockedFaces = [0, 1, 2, 3, 4, 5, 6],
}: UseClickerGameProps) {
	const [count, setCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [clicks, setClicks] = useState<
		{ id: number; x: number; y: number }[]
	>([]);
	const [particles, setParticles] = useState<
		{ id: number; x: number; y: number; angle: number; velocity: number }[]
	>([]);
	const [currentFace, setCurrentFace] = useState(0);
	const [supabase] = useState(() => createClient());

	// Buff Logic (Lazy Evaluation)

	// Timer State (Single Source of Truth for Time)
	const [now, setNow] = useState(() => Date.now());
	const [currentBuffMultiplier, setCurrentBuffMultiplier] = useState(1);

	// Calculate multiplier based on active buffs
	// We memoize the calculation to run only when activeBuffs or time changes
	useEffect(() => {
		const interval = setInterval(() => {
			setNow(Date.now());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const currentBuffMultiplierCalc = activeBuffs
			.filter((b) => Number(b.expires_at) > now)
			.reduce((acc, b) => acc * (b.multiplier || 1), 1);

		setCurrentBuffMultiplier(currentBuffMultiplierCalc);
	}, [activeBuffs, now]);

	const roleMultiplier = role === "Abone" ? 2 : 1;
	const clickAmount = Math.floor(
		(basePower || 1) * roleMultiplier * currentBuffMultiplier
	);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const { data } = await supabase
					.from("global_stats")
					.select("total_clicks")
					.eq("id", 1)
					.single();
				if (data) setCount(data.total_clicks);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();

		const channel = supabase
			.channel("game_updates")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "global_stats",
					filter: "id=eq.1",
				},
				(payload) => {
					setCount(payload.new.total_clicks);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase]);

	const handleGameClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			// Optimistic update
			setCount((prev) => prev + clickAmount);

			// Change face randomly (but not same as current)
			let nextFace =
				unlockedFaces[Math.floor(Math.random() * unlockedFaces.length)];
			// Retries if it picks the same face, but with a failsafe count to avoid infinite loops if only 1 face exists
			let attempts = 0;
			while (
				nextFace === currentFace &&
				unlockedFaces.length > 1 &&
				attempts < 5
			) {
				nextFace =
					unlockedFaces[
						Math.floor(Math.random() * unlockedFaces.length)
					];
				attempts++;
			}
			setCurrentFace(nextFace);

			// Add to batch queue - ONLY if user exists AND is not a guest (Misafir)
			if (user && role !== "Misafir") {
				addClick(1); // Send RAW click count, server calculates value
			}

			const rect = e.currentTarget.getBoundingClientRect();
			let clickX, clickY;

			// Check if triggered by keyboard (detail === 0) or if coordinates are 0
			if (e.detail === 0) {
				// Center of the element
				clickX = rect.width / 2;
				clickY = rect.height / 2;
			} else {
				clickX = e.clientX - rect.left;
				clickY = e.clientY - rect.top;
			}

			const id = Date.now();
			setClicks((prev) => [...prev, { id, x: clickX, y: clickY }]);

			const newParticles = Array.from({ length: 6 }).map((_, i) => ({
				id: Date.now() + i,
				x: clickX,
				y: clickY,
				angle: (Math.random() * 360 * Math.PI) / 180,
				velocity: 5 + Math.random() * 10,
			}));
			setParticles((prev) => [...prev, ...newParticles]);

			setTimeout(() => {
				setClicks((prev) => prev.filter((c) => c.id !== id));
			}, 1000);

			setTimeout(() => {
				setParticles((prev) =>
					prev.filter(
						(p) => !newParticles.find((np) => np.id === p.id)
					)
				);
			}, 1000);
		},
		[clickAmount, currentFace, user, role, unlockedFaces]
	);

	return {
		count,
		isLoading,
		clicks,
		particles,
		currentFace,
		clickAmount,
		handleGameClick,
		currentBuffMultiplier,
		now,
	};
}

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { addClick } from "@/lib/batching";
import { GAME_CONFIG } from "@/lib/constants";
import { User } from "@supabase/supabase-js";

type UseClickerGameProps = {
	user: User | null;
	multiplier: number;
};

export function useClickerGame({ user, multiplier }: UseClickerGameProps) {
	const [count, setCount] = useState(0);
	const [clicks, setClicks] = useState<
		{ id: number; x: number; y: number }[]
	>([]);
	const [particles, setParticles] = useState<
		{ id: number; x: number; y: number; angle: number; velocity: number }[]
	>([]);
	const [currentFace, setCurrentFace] = useState(0);
	const supabase = createClient();

	const clickAmount = GAME_CONFIG.CLICK_AMOUNT * multiplier;

	// Fetch initial stats and subscribe to updates
	useEffect(() => {
		const fetchStats = async () => {
			const { data } = await supabase
				.from("global_stats")
				.select("total_clicks")
				.eq("id", 1)
				.single();
			if (data) setCount(data.total_clicks);
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
			let nextFace = Math.floor(Math.random() * 5);
			while (nextFace === currentFace) {
				nextFace = Math.floor(Math.random() * 5);
			}
			setCurrentFace(nextFace);

			// Add to batch queue
			if (user) {
				addClick(clickAmount);
			}

			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const clickY = e.clientY - rect.top;

			// Add click text effect
			const id = Date.now();
			setClicks((prev) => [...prev, { id, x: clickX, y: clickY }]);

			// Add juice particles
			const newParticles = Array.from({ length: 6 }).map((_, i) => ({
				id: Date.now() + i,
				x: clickX,
				y: clickY,
				angle: (Math.random() * 360 * Math.PI) / 180,
				velocity: 5 + Math.random() * 10,
			}));
			setParticles((prev) => [...prev, ...newParticles]);

			// Cleanup effects
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
		[clickAmount, currentFace, user]
	);

	return {
		count,
		clicks,
		particles,
		currentFace,
		clickAmount,
		handleGameClick,
	};
}

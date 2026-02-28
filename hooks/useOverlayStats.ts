import { useEffect, useState } from "react";

import { GAME_CONFIG } from "@/constants/game";
import { createClient } from "@/lib/services/supabase/client";

export interface MilestoneUser {
	username: string;
	global_name?: string | null;
	avatar_url: string;
	id: string;
}

export function useOverlayStats() {
	const [count, setCount] = useState(0);
	const [showSpill, setShowSpill] = useState(false);
	const [prevLevel, setPrevLevel] = useState(0);
	const [lastMilestoneUser, setLastMilestoneUser] = useState<MilestoneUser | null>(null);
	const [supabase] = useState(() => createClient());

	useEffect(() => {
		const fetchStats = async () => {
			const { data } = await supabase
				.from("global_stats")
				.select("total_clicks, last_milestone_user")
				.eq("id", 1)
				.single();
			if (data) {
				setCount(data.total_clicks);
				setPrevLevel(Math.floor(data.total_clicks / GAME_CONFIG.GOAL));
				if (data.last_milestone_user) {
					setLastMilestoneUser(data.last_milestone_user as unknown as MilestoneUser);
				}
			}
		};

		fetchStats();

		const channel = supabase
			.channel("overlay_updates")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "global_stats",
					filter: "id=eq.1",
				},
				(payload) => {
					const newCount = payload.new.total_clicks;
					const newLevel = Math.floor(newCount / GAME_CONFIG.GOAL);
					const newUser = payload.new.last_milestone_user;

					setCount(newCount);
					if (newUser) {
						setLastMilestoneUser(newUser as unknown as MilestoneUser);
					}

					if (newLevel > prevLevel) {
						setShowSpill(true);
						setTimeout(() => setShowSpill(false), GAME_CONFIG.ANIMATION.SPILL_DURATION);
						setPrevLevel(newLevel);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, prevLevel]);

	const testSpill = () => {
		setShowSpill(true);
		setTimeout(() => setShowSpill(false), GAME_CONFIG.ANIMATION.SPILL_DURATION);
	};

	const testAdd = () => {
		setCount((prev) => prev + 10);
	};

	const testReset = () => {
		setCount(0);
		setPrevLevel(0);
	};

	return {
		count,
		showSpill,
		lastMilestoneUser,
		testActions: { testSpill, testAdd, testReset },
	};
}

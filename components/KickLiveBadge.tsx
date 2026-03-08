"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { checkKickLiveStatus } from "@/app/actions/kick-status";

interface KickLiveBadgeProps {
	username: string;
}

const POLLING_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export default function KickLiveBadge({ username }: KickLiveBadgeProps) {
	const [isLive, setIsLive] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const checkStatus = async () => {
			try {
				const status = await checkKickLiveStatus(username);
				if (isMounted) setIsLive(status);
			} catch (error) {
				console.error("[KickLiveBadge] Failed to check status:", error);
			}
		};

		checkStatus();
		const intervalId = setInterval(checkStatus, POLLING_INTERVAL_MS);

		return () => {
			isMounted = false;
			clearInterval(intervalId);
		};
	}, [username]);

	if (!isLive) return null;

	return (
		<motion.div
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className="pointer-events-none absolute top-0.5 right-0.5 z-10 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#53FC18] shadow-[0_0_8px_rgba(83,252,24,0.8)] ring-2 ring-white/50 backdrop-blur-sm md:top-1 md:right-1 md:h-3 md:w-3"
		>
			<motion.div
				animate={{ opacity: [1, 0.2, 1], scale: [0.8, 1, 0.8] }}
				transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				className="h-full w-full rounded-full bg-white/60"
			/>
		</motion.div>
	);
}

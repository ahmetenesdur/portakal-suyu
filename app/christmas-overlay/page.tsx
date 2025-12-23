"use client";

import React from "react";

export default function ChristmasOverlayPage() {
	return (
		<div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-transparent">
			<video
				src="/christmas-tree.webm"
				autoPlay
				loop
				muted
				playsInline
				className="max-h-full max-w-full object-contain"
			/>
		</div>
	);
}

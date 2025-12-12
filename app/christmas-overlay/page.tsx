"use client";

import React from "react";

export default function ChristmasOverlayPage() {
	return (
		<div className="w-screen h-screen overflow-hidden bg-transparent flex items-center justify-center">
			<video
				src="/christmas-tree.webm"
				autoPlay
				loop
				muted
				playsInline
				className="max-w-full max-h-full object-contain"
			/>
		</div>
	);
}

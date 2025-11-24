"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import InfoModal from "@/components/InfoModal";
import { useSound } from "@/hooks/useSound";
import SoundToggle from "@/components/SoundToggle";
import HeroSection from "@/components/HeroSection";
import GameArea from "@/components/GameArea";
import SocialDock from "@/components/SocialDock";

export default function Home() {
	const { user, profile, loading } = useAuth();
	const { playPop, isMuted, toggleMute } = useSound();
	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [particles, setParticles] = useState<
		{ id: number; style: React.CSSProperties }[]
	>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setParticles(
				Array.from({ length: 20 }).map((_, i) => ({
					id: i,
					style: {
						width: Math.random() * 20 + 10 + "px",
						height: Math.random() * 20 + 10 + "px",
						left: Math.random() * 100 + "%",
						top: Math.random() * 100 + "%",
						animation: `float ${
							10 + Math.random() * 20
						}s infinite linear`,
						animationDelay: `-${Math.random() * 20}s`,
					},
				}))
			);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-start pt-32 xl:pt-0 pb-16 xl:pb-0 px-4 relative overflow-hidden bg-orange-50 md:justify-center">
			{/* Dynamic Background */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{/* Gradient Blobs */}
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-300/30 rounded-full blur-[100px] animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-300/30 rounded-full blur-[100px] animate-pulse delay-1000" />

				{/* Floating Particles */}
				{particles.map((p) => (
					<div
						key={p.id}
						className="absolute bg-orange-400/20 rounded-full backdrop-blur-sm"
						style={p.style}
					/>
				))}
			</div>

			{/* Sound Toggle */}
			<SoundToggle isMuted={isMuted} toggleMute={toggleMute} />

			<InfoModal
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
			/>

			{/* Header */}
			<Navbar onOpenInfo={() => setIsInfoModalOpen(true)} />

			{/* Main Game Area */}
			<div className="z-10 flex flex-col items-center gap-12 w-full max-w-4xl">
				<HeroSection loading={loading} user={user} />

				<GameArea profile={profile} playPop={playPop} />

				<SocialDock />
			</div>
		</main>
	);
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import GameArea from "@/components/GameArea";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import SocialDock from "@/components/SocialDock";
import SoundToggle from "@/components/SoundToggle";
import { useSound } from "@/hooks/useSound";

const LoginPromptModal = dynamic(() => import("@/components/LoginPromptModal"), { ssr: false });

export default function Home() {
	const { user, profile, loading, signInWithDiscord } = useAuth();
	const { playPop, isMuted, toggleMute } = useSound();

	const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
	const [particles, setParticles] = useState<{ id: number; style: React.CSSProperties }[]>([]);

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
						animation: `float ${10 + Math.random() * 20}s infinite linear`,
						animationDelay: `-${Math.random() * 20}s`,
					},
				}))
			);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	const handleLoginPrompt = () => {
		setIsLoginPromptOpen(true);
	};

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-orange-50 pb-16">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-orange-300/30 blur-[100px]" />
				<div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-pink-300/30 blur-[100px] delay-1000" />

				{particles.map((p) => (
					<div
						key={p.id}
						className="absolute rounded-full bg-orange-400/20 backdrop-blur-sm"
						style={p.style}
					/>
				))}
			</div>

			<SoundToggle isMuted={isMuted} toggleMute={toggleMute} />

			<LoginPromptModal
				isOpen={isLoginPromptOpen}
				onClose={() => setIsLoginPromptOpen(false)}
				onLogin={() => {
					if (profile?.role === "Misafir") {
						window.open("https://discord.gg/NdEfduN4nU", "_blank");
					} else {
						signInWithDiscord();
					}
				}}
				variant={profile?.role === "Misafir" ? "join" : "login"}
			/>

			<Navbar />

			<div className="z-10 flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-12 px-4 pt-8 md:pt-0">
				<HeroSection loading={loading} user={user} />

				<GameArea
					profile={profile}
					playPop={playPop}
					onShowLoginPrompt={handleLoginPrompt}
				/>

				<SocialDock />
			</div>
		</main>
	);
}

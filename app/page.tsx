"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import InfoModal from "@/components/InfoModal";
import ShopModal from "@/components/ShopModal";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useSound } from "@/hooks/useSound";
import SoundToggle from "@/components/SoundToggle";
import HeroSection from "@/components/HeroSection";
import GameArea from "@/components/GameArea";
import SocialDock from "@/components/SocialDock";

export default function Home() {
	const { user, profile, loading, signInWithDiscord } = useAuth();
	const { playPop, isMuted, toggleMute } = useSound();
	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [isShopModalOpen, setIsShopModalOpen] = useState(false);
	const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
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

	const handleLoginPrompt = () => {
		setIsLoginPromptOpen(true);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-start pb-16 relative overflow-hidden bg-orange-50">
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-300/30 rounded-full blur-[100px] animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-300/30 rounded-full blur-[100px] animate-pulse delay-1000" />

				{particles.map((p) => (
					<div
						key={p.id}
						className="absolute bg-orange-400/20 rounded-full backdrop-blur-sm"
						style={p.style}
					/>
				))}
			</div>

			<SoundToggle isMuted={isMuted} toggleMute={toggleMute} />

			<InfoModal
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
			/>

			<ShopModal
				isOpen={isShopModalOpen}
				onClose={() => setIsShopModalOpen(false)}
			/>

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

			<Navbar
				onOpenInfo={() => setIsInfoModalOpen(true)}
				onOpenShop={() => setIsShopModalOpen(true)}
			/>

			<div className="z-10 flex flex-col items-center justify-center flex-1 gap-12 w-full max-w-4xl px-4 pt-8 md:pt-0">
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

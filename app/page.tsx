"use client";

import { useState, useEffect } from "react";
import Clicker from "@/components/Clicker";
import { Icon } from "@iconify/react";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import InfoModal from "@/components/InfoModal";

import { useSound } from "@/hooks/useSound";
import { SOCIAL_LINKS } from "@/lib/constants";
import Loading from "@/components/Loading";
import SoundToggle from "@/components/SoundToggle";

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
				<div className="text-center space-y-4">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 text-orange-600 rounded-full text-sm font-bold mb-2 border border-white/50 shadow-sm backdrop-blur-sm animate-bounce">
						<Icon
							icon="lucide:sparkles"
							width="16"
							height="16"
							className="text-yellow-500"
						/>
						<span>
							{loading ? (
								<Loading size="sm" />
							) : (
								<>
									Hoş Geldin{" "}
									{user?.user_metadata?.custom_claims
										?.global_name || "Sihirdar"}
									!
								</>
							)}
						</span>
					</div>
					<h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-orange-500 to-yellow-500 drop-shadow-sm tracking-tighter">
						PORTAKAL
						<br />
						VADİSİ
					</h1>
					<p className="text-lg md:text-xl text-orange-900/60 max-w-lg mx-auto font-medium leading-relaxed px-4">
						Azra için portakalları sık, vadiyi enerjiyle doldur! Her
						tıklama bir damla mutluluk. 🧡
					</p>
				</div>

				{profile?.role === "Misafir" ? (
					<div className="flex flex-col items-center gap-6 p-8 bg-white/60 backdrop-blur-2xl rounded-4xl border border-orange-100/50 shadow-2xl shadow-orange-500/10 text-center max-w-md mx-4 relative overflow-hidden group">
						{/* Decorative Background Elements */}
						<div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-orange-50/50 to-transparent pointer-events-none" />
						<div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl group-hover:bg-orange-300/30 transition-colors duration-500" />
						<div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl group-hover:bg-yellow-300/30 transition-colors duration-500" />

						<div className="relative">
							<div className="w-24 h-24 bg-linear-to-br from-orange-100 to-yellow-50 rounded-full flex items-center justify-center shadow-inner ring-8 ring-white/50 mb-2 group-hover:scale-110 transition-transform duration-500">
								<Icon
									icon="lucide:lock"
									className="w-10 h-10 text-orange-500 drop-shadow-sm"
								/>
							</div>
							<div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-orange-100">
								<Icon
									icon="lucide:shield-alert"
									className="w-4 h-4 text-orange-400"
								/>
							</div>
						</div>

						<div className="space-y-3 relative z-10">
							<h2 className="text-3xl font-black text-orange-950 tracking-tight">
								Sadece Üyeler!
							</h2>
							<p className="text-orange-800/70 font-medium leading-relaxed">
								Portakal Vadisi&apos;nin kapıları sadece
								topluluğumuzun değerli üyelerine açık. İçeri
								girmek için Discord&apos;a gel!
							</p>
						</div>

						<a
							href="https://discord.gg/NdEfduN4nU"
							target="_blank"
							rel="noopener noreferrer"
							className="relative z-10 w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-2xl shadow-xl shadow-[#5865F2]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn overflow-hidden"
						>
							<div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
							<Icon
								icon="simple-icons:discord"
								width="24"
								height="24"
								className="group-hover/btn:rotate-12 transition-transform"
							/>
							<span className="text-lg">Sunucuya Katıl</span>
						</a>
					</div>
				) : (
					<Clicker onPop={playPop} />
				)}

				{/* Social Dock */}
				<div className="flex items-center gap-2 md:gap-4 p-2 md:p-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg mt-8 transition-transform hover:scale-105">
					{SOCIAL_LINKS.map((social) => (
						<a
							key={social.name}
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							className={`p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center ${social.color}`}
							title={social.name}
						>
							<Icon
								icon={social.icon}
								width="20"
								height="20"
								className="md:w-6 md:h-6"
							/>
						</a>
					))}
				</div>
			</div>
		</main>
	);
}

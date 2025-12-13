"use client";

import { useAuth } from "@/components/AuthProvider";
import Loading from "./Loading";
import { useState } from "react";
import OrangeIcon from "./icons/OrangeIcon";
import { Icon } from "@iconify/react";
import NextImage from "next/image";
import Link from "next/link";

interface NavbarProps {
	onOpenInfo?: () => void;
}

export default function Navbar({ onOpenInfo }: NavbarProps) {
	const { user, profile, signInWithDiscord, signOut, loading } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
			{/* Logo Area */}
			<Link
				href="/"
				className="pointer-events-auto flex items-center gap-2 md:gap-3 bg-white/20 px-3 py-2 md:px-4 md:py-2 rounded-2xl backdrop-blur-md border border-white/30 shadow-sm transition-all hover:bg-white/30 group cursor-pointer"
			>
				<div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
					<OrangeIcon className="w-6 h-6 md:w-8 md:h-8 drop-shadow-md" />
				</div>
				<div className="flex flex-col">
					<span className="font-black text-lg md:text-xl text-orange-900 tracking-tight leading-none group-hover:text-orange-700 transition-colors">
						Portakal
					</span>
					<span className="font-bold text-xs md:text-sm text-orange-800/60 tracking-widest leading-none">
						VADİSİ
					</span>
				</div>
			</Link>

			{/* User Area */}
			<div className="pointer-events-auto flex items-center gap-3 md:gap-4 relative">
				<Link
					href="/leaderboard"
					className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 text-orange-600 rounded-full transition-all hover:scale-110 border border-white/30 backdrop-blur-md shadow-sm cursor-pointer group"
					title="Liderlik Tablosu"
				>
					<Icon
						icon="ph:trophy-fill"
						width="18"
						height="18"
						className="group-hover:rotate-12 transition-transform md:w-5 md:h-5"
					/>
				</Link>

				<button
					onClick={onOpenInfo}
					className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 text-orange-600 rounded-full transition-all hover:scale-110 border border-white/30 backdrop-blur-md shadow-sm cursor-pointer group"
					title="Bilgi"
				>
					<Icon
						icon="lucide:info"
						width="18"
						height="18"
						className="group-hover:rotate-12 transition-transform md:w-5 md:h-5"
					/>
				</button>

				{loading ? (
					<Loading size="sm" />
				) : user ? (
					<>
						{/* Desktop View */}
						<div className="hidden md:flex items-center gap-4">
							<div className="flex items-center gap-3 bg-white/20 pl-2 pr-6 py-2 rounded-full border border-white/30 backdrop-blur-md shadow-sm transition-all hover:bg-white/30">
								<div className="relative">
									<NextImage
										src={user.user_metadata.avatar_url}
										alt={user.user_metadata.full_name}
										width={40}
										height={40}
										className="rounded-full border-2 border-white/50 shadow-sm"
									/>
								</div>

								<div className="flex flex-col leading-tight">
									<span className="font-bold text-orange-900 text-sm">
										{user.user_metadata.full_name}
									</span>
									<div className="flex items-center gap-1.5">
										{profile?.role === "Abone" && (
											<div className="flex items-center gap-1">
												<Icon
													icon="lucide:crown"
													width="12"
													height="12"
													className="text-yellow-600"
												/>
												<span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide">
													Abone
												</span>
											</div>
										)}
										{profile?.role === "Misafir" ? (
											<a
												href="https://discord.gg/NdEfduN4nU"
												target="_blank"
												rel="noopener noreferrer"
												className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
											>
												<Icon
													icon="simple-icons:discord"
													width="10"
													height="10"
												/>
												Sunucuya Katıl
											</a>
										) : !profile?.role ||
										  profile.role === "Üye" ? (
											<span className="text-[10px] font-bold text-orange-700/60 uppercase tracking-wide">
												{profile?.role || "Sihirdar"}
											</span>
										) : null}
									</div>
								</div>
							</div>

							<button
								onClick={() => signOut()}
								className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-red-50 hover:text-red-600 rounded-full text-orange-900/40 transition-colors border border-white/30 backdrop-blur-md shadow-sm cursor-pointer"
								title="Çıkış Yap"
							>
								<Icon
									icon="lucide:log-out"
									width="18"
									height="18"
								/>
							</button>
						</div>

						{/* Mobile View */}
						<div className="md:hidden relative flex items-center justify-center ">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="relative w-9 h-9 rounded-full border-2 border-white/50 shadow-sm overflow-hidden transition-transform active:scale-95"
							>
								<NextImage
									src={user.user_metadata.avatar_url}
									alt={user.user_metadata.full_name}
									fill
									className="object-cover"
								/>
							</button>

							{/* Mobile Dropdown */}
							{isMenuOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setIsMenuOpen(false)}
									/>
									<div className="absolute right-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-3 z-50 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
										<div className="flex items-center gap-3 pb-3 border-b border-orange-100">
											<div className="relative w-10 h-10 shrink-0">
												<NextImage
													src={
														user.user_metadata
															.avatar_url
													}
													alt={
														user.user_metadata
															.full_name
													}
													fill
													className="rounded-full object-cover border border-white shadow-sm"
												/>
											</div>
											<div className="flex flex-col min-w-0">
												<span className="font-bold text-orange-900 text-sm truncate">
													{
														user.user_metadata
															.full_name
													}
												</span>
												<span className="text-xs text-orange-600/70 font-medium">
													{profile?.role ||
														"Sihirdar"}
												</span>
											</div>
										</div>

										{profile?.role === "Misafir" && (
											<a
												href="https://discord.gg/NdEfduN4nU"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors text-xs font-bold"
											>
												<Icon
													icon="simple-icons:discord"
													width="14"
													height="14"
												/>
												Sunucuya Katıl
											</a>
										)}

										<button
											onClick={() => signOut()}
											className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-bold"
										>
											<Icon
												icon="lucide:log-out"
												width="16"
												height="16"
											/>
											Çıkış Yap
										</button>
									</div>
								</>
							)}
						</div>
					</>
				) : (
					<button
						onClick={() => signInWithDiscord()}
						className="px-4 py-2 md:px-6 md:py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl md:rounded-2xl shadow-lg shadow-[#5865F2]/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm md:text-base"
					>
						<Icon
							icon="simple-icons:discord"
							width="16"
							height="16"
							className="md:w-5 md:h-5"
						/>
						<span className="hidden md:inline">
							Discord ile Giriş
						</span>
						<span className="md:hidden">Giriş</span>
					</button>
				)}
			</div>
		</header>
	);
}

"use client";

import { Icon } from "@iconify/react";
import NextImage from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/AuthProvider";

import OrangeIcon from "./Icons";
import Loading from "./Loading";

interface NavbarProps {
	onOpenInfo?: () => void;
	onOpenShop?: () => void;
}

export default function Navbar({ onOpenInfo, onOpenShop }: NavbarProps) {
	const { user, profile, signInWithDiscord, signOut, loading } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="pointer-events-none sticky top-0 left-0 z-50 flex w-full items-center justify-between p-4 md:p-6">
			<Link
				href="/"
				className="group pointer-events-auto flex cursor-pointer items-center gap-2 rounded-2xl border border-white/30 bg-white/20 px-3 py-2 shadow-sm backdrop-blur-md transition-all hover:bg-white/30 md:gap-3 md:px-4 md:py-2"
			>
				<div className="flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:rotate-12 md:h-10 md:w-10">
					<OrangeIcon className="h-6 w-6 drop-shadow-md md:h-8 md:w-8" />
				</div>
				<div className="flex flex-col">
					<span className="text-lg leading-none font-black tracking-tight text-orange-900 transition-colors group-hover:text-orange-700 md:text-xl">
						Portakal
					</span>
					<span className="text-xs leading-none font-bold tracking-widest text-orange-800/60 md:text-sm">
						VADİSİ
					</span>
				</div>
			</Link>

			<div className="pointer-events-auto relative flex items-center gap-3 md:gap-4">
				<button
					onClick={onOpenShop}
					className="group hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/40 active:scale-95 md:flex md:h-10 md:w-10"
					title="Portakal Pazarı"
				>
					<Icon
						icon="lucide:store"
						width="18"
						height="18"
						className="transition-transform group-hover:rotate-12 md:h-5 md:w-5"
					/>
				</button>

				<Link
					href="/leaderboard"
					className="group hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/40 active:scale-95 md:flex md:h-10 md:w-10"
					title="Liderlik Tablosu"
				>
					<Icon
						icon="lucide:medal"
						width="18"
						height="18"
						className="transition-transform group-hover:rotate-12 md:h-5 md:w-5"
					/>
				</Link>

				<button
					onClick={onOpenInfo}
					className="group hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/40 active:scale-95 md:flex md:h-10 md:w-10"
					title="Bilgi"
				>
					<Icon
						icon="lucide:info"
						width="18"
						height="18"
						className="transition-transform group-hover:rotate-12 md:h-5 md:w-5"
					/>
				</button>

				{loading ? (
					<Loading size="sm" />
				) : user ? (
					<>
						<div className="hidden items-center gap-4 md:flex">
							<div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/20 py-2 pr-6 pl-2 shadow-sm backdrop-blur-md transition-all hover:bg-white/30">
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
									<span className="text-sm font-bold text-orange-900">
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
												<span className="text-[10px] font-bold tracking-wide text-yellow-700 uppercase">
													Abone
												</span>
											</div>
										)}
										{profile?.role === "Misafir" ? (
											<a
												href="https://discord.gg/NdEfduN4nU"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
											>
												<Icon
													icon="simple-icons:discord"
													width="10"
													height="10"
												/>
												Sunucuya Katıl
											</a>
										) : !profile?.role || profile.role === "Üye" ? (
											<span className="text-[10px] font-bold tracking-wide text-orange-700/60 uppercase">
												{profile?.role || "Sihirdar"}
											</span>
										) : null}
									</div>
								</div>
							</div>

							<button
								onClick={() => signOut()}
								className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-900/40 shadow-sm backdrop-blur-md transition-colors hover:scale-105 hover:bg-red-50 hover:text-red-600 active:scale-95"
								title="Çıkış Yap"
							>
								<Icon icon="lucide:log-out" width="18" height="18" />
							</button>
						</div>

						<div className="relative flex items-center justify-center md:hidden">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="group flex items-center gap-1.5 rounded-full border border-white/40 bg-white/20 py-1 pr-2.5 pl-1 shadow-sm backdrop-blur-md transition-all active:scale-95"
							>
								<div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/50">
									<NextImage
										src={user.user_metadata.avatar_url}
										alt={user.user_metadata.full_name}
										fill
										className="object-cover"
									/>
								</div>
								<Icon
									icon="lucide:chevron-down"
									width="14"
									height="14"
									className={`text-orange-600/70 transition-transform duration-300 ${
										isMenuOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{isMenuOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setIsMenuOpen(false)}
									/>
									<div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 flex w-56 origin-top-right flex-col gap-3 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-xl backdrop-blur-xl duration-200">
										<div className="flex items-center gap-3 border-b border-orange-100 pb-3">
											<div className="relative h-10 w-10 shrink-0">
												<NextImage
													src={user.user_metadata.avatar_url}
													alt={user.user_metadata.full_name}
													fill
													className="rounded-full border border-white object-cover shadow-sm"
												/>
											</div>
											<div className="flex min-w-0 flex-col">
												<span className="truncate text-sm font-bold text-orange-900">
													{user.user_metadata.full_name}
												</span>
												<span className="text-xs font-medium text-orange-600/70">
													{profile?.role || "Sihirdar"}
												</span>
											</div>
										</div>

										<div className="flex flex-col gap-1 border-b border-orange-100/50 py-1 md:hidden">
											<button
												onClick={() => {
													if (onOpenShop) onOpenShop();
													setIsMenuOpen(false);
												}}
												className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-50"
											>
												<Icon icon="lucide:store" width="16" height="16" />
												Portakal Pazarı
											</button>
											<Link
												href="/leaderboard"
												onClick={() => setIsMenuOpen(false)}
												className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-50"
											>
												<Icon icon="lucide:medal" width="16" height="16" />
												Liderlik Tablosu
											</Link>
											<button
												onClick={() => {
													if (onOpenInfo) onOpenInfo();
													setIsMenuOpen(false);
												}}
												className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-50"
											>
												<Icon icon="lucide:info" width="16" height="16" />
												Bilgi
											</button>
										</div>

										{profile?.role === "Misafir" && (
											<a
												href="https://discord.gg/NdEfduN4nU"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 rounded-xl bg-[#5865F2]/10 px-3 py-2 text-xs font-bold text-[#5865F2] transition-colors hover:bg-[#5865F2]/20"
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
											className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
										>
											<Icon icon="lucide:log-out" width="16" height="16" />
											Çıkış Yap
										</button>
									</div>
								</>
							)}
						</div>
					</>
				) : (
					<>
						<button
							onClick={() => signInWithDiscord()}
							className="hidden cursor-pointer items-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#5865F2]/30 transition-all hover:scale-105 hover:bg-[#4752C4] active:scale-95 md:flex md:rounded-2xl md:px-6 md:py-3 md:text-base"
						>
							<Icon
								icon="simple-icons:discord"
								width="16"
								height="16"
								className="md:h-5 md:w-5"
							/>
							<span className="hidden md:inline">Discord ile Giriş</span>
							<span className="md:hidden">Giriş</span>
						</button>

						<div className="relative flex items-center justify-center md:hidden">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/40 active:scale-95"
							>
								<Icon icon="lucide:menu" width="20" height="20" />
							</button>

							{isMenuOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setIsMenuOpen(false)}
									/>
									<div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 flex w-56 origin-top-right flex-col gap-3 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-xl backdrop-blur-xl duration-200">
										<div className="flex flex-col gap-1 border-b border-orange-100/50 py-1">
											<button
												onClick={() => signInWithDiscord()}
												className="mb-2 flex items-center gap-2 rounded-xl bg-[#5865F2]/10 px-3 py-2 text-sm font-bold text-[#5865F2] transition-colors hover:bg-[#5865F2]/20"
											>
												<Icon
													icon="simple-icons:discord"
													width="16"
													height="16"
												/>
												Giriş Yap
											</button>
											<button
												onClick={() => {
													if (onOpenShop) onOpenShop();
													setIsMenuOpen(false);
												}}
												className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-50"
											>
												<Icon icon="lucide:store" width="16" height="16" />
												Portakal Pazarı
											</button>
											<Link
												href="/leaderboard"
												onClick={() => setIsMenuOpen(false)}
												className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-50"
											>
												<Icon icon="lucide:medal" width="16" height="16" />
												Liderlik Tablosu
											</Link>
											<button
												onClick={() => {
													if (onOpenInfo) onOpenInfo();
													setIsMenuOpen(false);
												}}
												className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-50"
											>
												<Icon icon="lucide:info" width="16" height="16" />
												Bilgi
											</button>
										</div>
									</div>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</header>
	);
}

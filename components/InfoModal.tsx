"use client";

import { Icon } from "@iconify/react";

import BaseModal from "./ui/BaseModal";

interface InfoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			className="mx-auto max-h-[85dvh] max-w-lg overflow-hidden md:max-h-[90vh]"
		>
			<div className="custom-scrollbar h-full overflow-y-auto">
				<div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-linear-to-b from-orange-100 to-transparent" />

				<div className="relative space-y-6 p-6 md:p-8">
					<div className="space-y-2 text-center">
						<div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-inner ring-4 ring-white/50 md:h-16 md:w-16">
							<Icon icon="lucide:info" className="h-6 w-6 md:h-8 md:w-8" />
						</div>
						<h2 className="text-xl font-black tracking-tight text-orange-900 md:text-2xl">
							Sihirli Portakal Vadisi Rehberi
						</h2>
						<p className="text-sm font-medium text-orange-800/60">
							Maceraya başlamadan önce bilmen gerekenler!
						</p>
					</div>

					<div className="space-y-4">
						<div className="group flex gap-3 rounded-2xl border border-[#5865F2]/20 bg-[#5865F2]/5 p-3 transition-colors hover:bg-[#5865F2]/10 md:gap-4 md:p-4">
							<div className="mt-1 shrink-0">
								<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5865F2]/20 text-[#5865F2] transition-transform group-hover:scale-110 md:h-10 md:w-10">
									<Icon
										icon="simple-icons:discord"
										className="h-4 w-4 md:h-5 md:w-5"
									/>
								</div>
							</div>
							<div>
								<h3 className="mb-1 text-base font-bold text-[#5865F2] md:text-lg">
									Discord Zorunluluğu
								</h3>
								<p className="text-xs leading-relaxed font-medium text-[#5865F2]/80 md:text-sm">
									Oyuna giriş yapabilmek ve oynayabilmek için Discord sunucumuzda
									bulunman gerekiyor. Sunucudan çıkarsan oyuna erişimin kesilir.
								</p>
							</div>
						</div>

						<div className="group flex gap-3 rounded-2xl border border-pink-100/50 bg-pink-50/50 p-3 transition-colors hover:bg-pink-50 md:gap-4 md:p-4">
							<div className="mt-1 shrink-0">
								<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition-transform group-hover:scale-110 md:h-10 md:w-10">
									<Icon
										icon="lucide:party-popper"
										className="h-4 w-4 md:h-5 md:w-5"
									/>
								</div>
							</div>
							<div>
								<h3 className="mb-1 text-base font-bold text-pink-900 md:text-lg">
									Yayını Coştur
								</h3>
								<p className="text-xs leading-relaxed font-medium text-pink-800/70 md:text-sm">
									Tıklamalarınla canlı yayındaki hedefi tamamla ve görsel şöleni
									başlat!
								</p>
							</div>
						</div>

						<div className="group flex gap-3 rounded-2xl border border-violet-100/50 bg-violet-50/50 p-3 transition-colors hover:bg-violet-50 md:gap-4 md:p-4">
							<div className="mt-1 shrink-0">
								<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition-transform group-hover:scale-110 md:h-10 md:w-10">
									<Icon icon="lucide:store" className="h-4 w-4 md:h-5 md:w-5" />
								</div>
							</div>
							<div>
								<h3 className="mb-1 text-base font-bold text-violet-900 md:text-lg">
									Portakal Pazarı
								</h3>
								<p className="text-xs leading-relaxed font-medium text-violet-800/70 md:text-sm">
									Geliştirmeler, buff&apos;lar ve kozmetiklerle öne geç.
									Harcadığın litreler sıralama puanını etkilemez!
								</p>
							</div>
						</div>

						<div className="group flex gap-3 rounded-2xl border border-orange-100/50 bg-orange-50/50 p-3 transition-colors hover:bg-orange-50 md:gap-4 md:p-4">
							<div className="mt-1 shrink-0">
								<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-200 text-orange-700 transition-transform group-hover:scale-110 md:h-10 md:w-10">
									<Icon icon="lucide:zap" className="h-4 w-4 md:h-5 md:w-5" />
								</div>
							</div>
							<div className="w-full">
								<h3 className="mb-3 text-base font-bold text-orange-900 md:text-lg">
									Rol Çarpanları
								</h3>
								<div className="space-y-2.5">
									<div className="flex items-center justify-between rounded-xl border border-orange-100/60 bg-white/60 p-2 shadow-sm transition-shadow hover:shadow-md md:p-3">
										<div className="flex items-center gap-2 md:gap-3">
											<div className="rounded-lg bg-yellow-100 p-1.5 text-yellow-600">
												<Icon
													icon="lucide:crown"
													className="h-3.5 w-3.5 md:h-4 md:w-4"
												/>
											</div>
											<span className="text-sm font-bold text-orange-900 md:text-base">
												Abone
											</span>
										</div>
										<div className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-black text-orange-700 md:px-3 md:text-sm">
											2x Boost
										</div>
									</div>
									<div className="flex items-center justify-between rounded-xl border border-orange-100/60 bg-white/60 p-2 shadow-sm transition-shadow hover:shadow-md md:p-3">
										<div className="flex items-center gap-2 md:gap-3">
											<div className="rounded-lg bg-orange-100 p-1.5 text-orange-500">
												<Icon
													icon="lucide:user"
													className="h-3.5 w-3.5 md:h-4 md:w-4"
												/>
											</div>
											<span className="text-sm font-bold text-orange-800 md:text-base">
												Üye
											</span>
										</div>
										<div className="rounded-lg bg-orange-50 px-2 py-1 text-xs font-bold text-orange-600 md:px-3 md:text-sm">
											Standart
										</div>
									</div>
								</div>
								<p className="mt-3 text-[10px] leading-relaxed font-medium text-orange-800/50 md:text-xs">
									* Bu çarpanlar, <b>Temel Gücün (Base)</b> ve aktif{" "}
									<b>buff&apos;larınla</b> çarpılarak toplam <b>Litre</b>{" "}
									kazancını belirler. (Örn: 2x Base * 2x Abone * 2x Buff = 8x
									Boost)
								</p>
							</div>
						</div>
					</div>

					<button
						onClick={onClose}
						className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] md:py-4 md:text-base"
					>
						Anlaşıldı
						<Icon
							icon="lucide:check"
							className="h-4 w-4 transition-transform group-hover:scale-125 md:h-5 md:w-5"
						/>
					</button>
				</div>
			</div>
		</BaseModal>
	);
}

"use client";

import { Icon } from "@iconify/react";
import BaseModal from "./BaseModal";

interface InfoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			className="max-w-lg mx-auto max-h-[85dvh] md:max-h-[90vh] overflow-y-auto custom-scrollbar"
		>
			<div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-orange-100 to-transparent pointer-events-none" />

			<div className="relative p-6 md:p-8 space-y-6">
				<div className="text-center space-y-2">
					<div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-100 text-orange-600 mb-2 shadow-inner ring-4 ring-white/50">
						<Icon
							icon="lucide:info"
							className="w-6 h-6 md:w-8 md:h-8"
						/>
					</div>
					<h2 className="text-xl md:text-2xl font-black text-orange-900 tracking-tight">
						Sihirli Portakal Vadisi Rehberi
					</h2>
					<p className="text-orange-800/60 font-medium text-sm">
						Maceraya başlamadan önce bilmen gerekenler!
					</p>
				</div>

				<div className="space-y-4">
					<div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-[#5865F2]/5 border border-[#5865F2]/20 hover:bg-[#5865F2]/10 transition-colors group">
						<div className="shrink-0 mt-1">
							<div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2] group-hover:scale-110 transition-transform">
								<Icon
									icon="simple-icons:discord"
									className="w-4 h-4 md:w-5 md:h-5"
								/>
							</div>
						</div>
						<div>
							<h3 className="font-bold text-[#5865F2] mb-1 text-base md:text-lg">
								Discord Zorunluluğu
							</h3>
							<p className="text-xs md:text-sm text-[#5865F2]/80 leading-relaxed font-medium">
								Oyuna giriş yapabilmek ve oynayabilmek için
								Discord sunucumuzda bulunman gerekiyor.
								Sunucudan çıkarsan oyuna erişimin kesilir.
							</p>
						</div>
					</div>

					<div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-pink-50/50 border border-pink-100/50 hover:bg-pink-50 transition-colors group">
						<div className="shrink-0 mt-1">
							<div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
								<Icon
									icon="lucide:party-popper"
									className="w-4 h-4 md:w-5 md:h-5"
								/>
							</div>
						</div>
						<div>
							<h3 className="font-bold text-pink-900 mb-1 text-base md:text-lg">
								Yayını Coştur
							</h3>
							<p className="text-xs md:text-sm text-pink-800/70 leading-relaxed font-medium">
								Tıklamalarınla canlı yayındaki hedefi tamamla ve
								görsel şöleni başlat!
							</p>
						</div>
					</div>

					<div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-violet-50/50 border border-violet-100/50 hover:bg-violet-50 transition-colors group">
						<div className="shrink-0 mt-1">
							<div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
								<Icon
									icon="lucide:store"
									className="w-4 h-4 md:w-5 md:h-5"
								/>
							</div>
						</div>
						<div>
							<h3 className="font-bold text-violet-900 mb-1 text-base md:text-lg">
								Portakal Pazarı
							</h3>
							<p className="text-xs md:text-sm text-violet-800/70 leading-relaxed font-medium">
								Güçlendiriciler ve kozmetiklerle öne geç.
								Harcadığın litreler sıralama puanını etkilemez!
							</p>
						</div>
					</div>

					<div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50 hover:bg-orange-50 transition-colors group">
						<div className="shrink-0 mt-1">
							<div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-200 flex items-center justify-center text-orange-700 group-hover:scale-110 transition-transform">
								<Icon
									icon="lucide:zap"
									className="w-4 h-4 md:w-5 md:h-5"
								/>
							</div>
						</div>
						<div className="w-full">
							<h3 className="font-bold text-orange-900 mb-3 text-base md:text-lg">
								Rol Çarpanları
							</h3>
							<div className="space-y-2.5">
								<div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-white/60 border border-orange-100/60 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex items-center gap-2 md:gap-3">
										<div className="p-1.5 bg-yellow-100 rounded-lg text-yellow-600">
											<Icon
												icon="lucide:crown"
												className="w-3.5 h-3.5 md:w-4 md:h-4"
											/>
										</div>
										<span className="font-bold text-orange-900 text-sm md:text-base">
											Abone
										</span>
									</div>
									<div className="px-2 md:px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-black text-xs md:text-sm">
										2x Hız
									</div>
								</div>
								<div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-white/60 border border-orange-100/60 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex items-center gap-2 md:gap-3">
										<div className="p-1.5 bg-orange-100 rounded-lg text-orange-500">
											<Icon
												icon="lucide:user"
												className="w-3.5 h-3.5 md:w-4 md:h-4"
											/>
										</div>
										<span className="font-bold text-orange-800 text-sm md:text-base">
											Üye
										</span>
									</div>
									<div className="px-2 md:px-3 py-1 bg-orange-50 text-orange-600 rounded-lg font-bold text-xs md:text-sm">
										Standart Hız
									</div>
								</div>
							</div>
							<p className="text-[10px] md:text-xs text-orange-800/50 mt-3 font-medium leading-relaxed">
								* Bu çarpanlar, <b>Temel Gücün (Base)</b> ve
								aktif Güçlendirmelerinle (Buff) çarpılarak
								toplam <b>Litre</b> kazancını belirler. (Örn: 2
								Base * 2x Abone * 2x Buff = 8x Hız)
							</p>
						</div>
					</div>
				</div>

				<button
					onClick={onClose}
					className="w-full py-3 md:py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group text-sm md:text-base cursor-pointer"
				>
					<span>Anlaşıldı</span>
					<Icon
						icon="lucide:check"
						className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-125 transition-transform"
					/>
				</button>
			</div>
		</BaseModal>
	);
}

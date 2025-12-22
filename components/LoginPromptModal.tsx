"use client";

import { Icon } from "@iconify/react";
import BaseModal from "./BaseModal";

interface LoginPromptModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLogin: () => void;
	variant?: "login" | "join";
}

export default function LoginPromptModal({
	isOpen,
	onClose,
	onLogin,
	variant = "login",
}: LoginPromptModalProps) {
	const isJoin = variant === "join";

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			className="max-w-md mx-auto max-h-[85dvh] md:max-h-[90vh] overflow-y-auto custom-scrollbar"
		>
			<div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-orange-100 to-transparent pointer-events-none" />

			<div className="relative p-6 md:p-8 space-y-6">
				<div className="text-center space-y-2">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-2 shadow-inner ring-4 ring-white/50">
						<Icon
							icon={isJoin ? "lucide:users" : "lucide:save-off"}
							className="w-8 h-8"
						/>
					</div>
					<h2 className="text-2xl font-black text-orange-900 tracking-tight">
						{isJoin ? "Sunucuya Katıl!" : "Skorun Kaydedilmiyor!"}
					</h2>
					<p className="text-orange-800/70 font-medium">
						{isJoin
							? "Skorunun kaydedilmesi için Portakal Suyu Discord sunucumuza katılman gerekiyor."
							: "Misafir olarak oynuyorsun. Giriş yaparak daha fazlasına erişebilirsin:"}
					</p>

					<div className="bg-orange-50/50 rounded-2xl p-4 text-left space-y-3 border border-orange-100/50">
						<div className="flex gap-3 items-start">
							<div className="p-2 bg-white rounded-lg shadow-sm text-orange-500 shrink-0">
								<Icon
									icon="lucide:party-popper"
									className="w-5 h-5"
								/>
							</div>
							<div>
								<h3 className="font-bold text-orange-900 text-sm">
									Yayını Coştur
								</h3>
								<p className="text-xs text-orange-800/60 leading-relaxed">
									Tıklamalarınla canlı yayındaki hedefi
									tamamla ve görsel şöleni başlat!
								</p>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="p-2 bg-white rounded-lg shadow-sm text-orange-500 shrink-0">
								<Icon icon="lucide:zap" className="w-5 h-5" />
							</div>
							<div>
								<h3 className="font-bold text-orange-900 text-sm">
									Daha Çok Litre
								</h3>
								<p className="text-xs text-orange-800/60 leading-relaxed">
									Discord rollerinle (Abone/Üye) yaptığın her
									tıklamada 2 kata kadar daha fazla{" "}
									<b>Litre</b> kazan!
								</p>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="p-2 bg-white rounded-lg shadow-sm text-orange-500 shrink-0">
								<Icon icon="lucide:store" className="w-5 h-5" />
							</div>
							<div>
								<h3 className="font-bold text-orange-900 text-sm">
									Pazar&apos;a Erişim
								</h3>
								<p className="text-xs text-orange-800/60 leading-relaxed">
									Sadece Discord üyeleri Pazar&apos;dan özel
									eşyalar satın alabilir ve avantaj
									sağlayabilir.
								</p>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="p-2 bg-white rounded-lg shadow-sm text-orange-500 shrink-0">
								<Icon icon="lucide:medal" className="w-5 h-5" />
							</div>
							<div>
								<h3 className="font-bold text-orange-900 text-sm">
									Sıralamaya Gir
								</h3>
								<p className="text-xs text-orange-800/60 leading-relaxed">
									Günlük ve haftalık sıralamalarda yerini al.
									Pazar&apos;da harcadığın litreler sıralamanı
									düşürmez!
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<button
						onClick={onLogin}
						className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl shadow-lg shadow-[#5865F2]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
					>
						<Icon
							icon="simple-icons:discord"
							className="w-5 h-5 group-hover:rotate-12 transition-transform"
						/>
						<span>
							{isJoin ? "Sunucuya Katıl" : "Giriş Yap ve Kaydet"}
						</span>
					</button>

					<button
						onClick={onClose}
						className="w-full py-4 bg-white hover:bg-orange-50 text-orange-700 font-bold rounded-xl border-2 border-orange-100 hover:border-orange-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
					>
						Şimdilik Devam Et
					</button>
				</div>
			</div>
		</BaseModal>
	);
}

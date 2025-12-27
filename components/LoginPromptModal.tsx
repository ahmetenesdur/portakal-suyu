"use client";

import { Icon } from "@iconify/react";

import BaseModal from "./ui/BaseModal";

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
			className="mx-auto max-h-[85dvh] max-w-md overflow-hidden md:max-h-[90vh]"
		>
			<div className="custom-scrollbar h-full overflow-y-auto">
				<div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-linear-to-b from-orange-100 to-transparent" />

				<div className="relative space-y-6 p-6 md:p-8">
					<div className="space-y-2 text-center">
						<div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-inner ring-4 ring-white/50">
							<Icon
								icon={isJoin ? "lucide:users" : "lucide:save-off"}
								className="h-8 w-8"
							/>
						</div>
						<h2 className="text-2xl font-black tracking-tight text-orange-900">
							{isJoin ? "Sunucuya Katıl!" : "Skorun Kaydedilmiyor!"}
						</h2>
						<p className="font-medium text-orange-800/70">
							{isJoin
								? "Skorunun kaydedilmesi için Portakal Suyu Discord sunucumuza katılman gerekiyor."
								: "Misafir olarak oynuyorsun. Giriş yaparak daha fazlasına erişebilirsin:"}
						</p>

						<div className="space-y-3 rounded-2xl border border-orange-100/50 bg-orange-50/50 p-4 text-left">
							<div className="flex items-start gap-3">
								<div className="shrink-0 rounded-lg bg-white p-2 text-orange-500 shadow-sm">
									<Icon icon="lucide:party-popper" className="h-5 w-5" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-orange-900">
										Yayını Coştur
									</h3>
									<p className="text-xs leading-relaxed text-orange-800/60">
										Tıklamalarınla canlı yayındaki hedefi tamamla ve görsel
										şöleni başlat!
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="shrink-0 rounded-lg bg-white p-2 text-orange-500 shadow-sm">
									<Icon icon="lucide:zap" className="h-5 w-5" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-orange-900">
										Daha Çok Litre
									</h3>
									<p className="text-xs leading-relaxed text-orange-800/60">
										Discord rollerinle (Abone/Üye) yaptığın her tıklamada 2 kata
										kadar daha fazla <b>Litre</b> kazan!
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="shrink-0 rounded-lg bg-white p-2 text-orange-500 shadow-sm">
									<Icon icon="lucide:store" className="h-5 w-5" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-orange-900">
										Pazar&apos;a Erişim
									</h3>
									<p className="text-xs leading-relaxed text-orange-800/60">
										Sadece Discord üyeleri Pazar&apos;dan özel eşyalar satın
										alabilir ve avantaj sağlayabilir.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="shrink-0 rounded-lg bg-white p-2 text-orange-500 shadow-sm">
									<Icon icon="lucide:medal" className="h-5 w-5" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-orange-900">
										Sıralamaya Gir
									</h3>
									<p className="text-xs leading-relaxed text-orange-800/60">
										Günlük ve haftalık sıralamalarda yerini al. Pazar&apos;da
										harcadığın litreler sıralamanı düşürmez!
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<button
							onClick={onLogin}
							className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5865F2] py-4 text-base font-bold text-white shadow-lg shadow-[#5865F2]/20 transition-all hover:scale-[1.02] hover:bg-[#4752C4] active:scale-[0.98]"
						>
							<Icon
								icon="simple-icons:discord"
								className="h-5 w-5 transition-transform group-hover:rotate-12"
							/>
							{isJoin ? "Sunucuya Katıl" : "Giriş Yap ve Kaydet"}
						</button>

						<button
							onClick={onClose}
							className="flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-orange-100 bg-white py-4 text-base font-bold text-orange-700 transition-all hover:scale-[1.02] hover:border-orange-200 hover:bg-orange-50 active:scale-[0.98]"
						>
							Şimdilik Devam Et
						</button>
					</div>
				</div>
			</div>
		</BaseModal>
	);
}

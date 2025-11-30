"use client";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

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
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const isJoin = variant === "join";

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
						onClick={onClose}
					>
						{/* Modal Container */}
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="relative w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Decorative Header Background */}
							<div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-orange-100 to-transparent pointer-events-none" />

							<div className="relative p-6 md:p-8 space-y-6">
								{/* Header */}
								<div className="text-center space-y-2">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-2 shadow-inner ring-4 ring-white/50">
										<Icon
											icon={
												isJoin
													? "lucide:users"
													: "lucide:save-off"
											}
											className="w-8 h-8"
										/>
									</div>
									<h2 className="text-2xl font-black text-orange-900 tracking-tight">
										{isJoin
											? "Sunucuya Katıl!"
											: "Skorun Kaydedilmiyor!"}
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
													Tıklamalarınla canlı
													yayındaki hedefi tamamla ve
													görsel şöleni başlat!
												</p>
											</div>
										</div>

										<div className="flex gap-3 items-start">
											<div className="p-2 bg-white rounded-lg shadow-sm text-orange-500 shrink-0">
												<Icon
													icon="lucide:zap"
													className="w-5 h-5"
												/>
											</div>
											<div>
												<h3 className="font-bold text-orange-900 text-sm">
													Daha Hızlı Topla
												</h3>
												<p className="text-xs text-orange-800/60 leading-relaxed">
													Discord rollerinle
													(Abone/Üye) 2 kata kadar
													daha hızlı portakal suyu
													sık!
												</p>
											</div>
										</div>

										<div className="flex gap-3 items-start">
											<div className="p-2 bg-white rounded-lg shadow-sm text-orange-500 shrink-0">
												<Icon
													icon="lucide:trophy"
													className="w-5 h-5"
												/>
											</div>
											<div>
												<h3 className="font-bold text-orange-900 text-sm">
													Sıralamaya Gir
												</h3>
												<p className="text-xs text-orange-800/60 leading-relaxed">
													Günlük ve haftalık
													sıralamalarda yerini al,
													rekabete katıl.
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="space-y-3">
									<button
										onClick={onLogin}
										className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl shadow-lg shadow-[#5865F2]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
									>
										<Icon
											icon="simple-icons:discord"
											className="w-5 h-5 group-hover:rotate-12 transition-transform"
										/>
										<span>
											{isJoin
												? "Sunucuya Katıl"
												: "Giriş Yap ve Kaydet"}
										</span>
									</button>

									<button
										onClick={onClose}
										className="w-full py-4 bg-white hover:bg-orange-50 text-orange-700 font-bold rounded-xl border-2 border-orange-100 hover:border-orange-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
									>
										Şimdilik Devam Et
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

"use client";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface InfoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
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
							className="relative w-full max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Decorative Header Background */}
							<div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-orange-100 to-transparent pointer-events-none" />

							<div className="relative p-6 md:p-8 space-y-6">
								{/* Header */}
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
										Maceraya başlamadan önce bilmen
										gerekenler!
									</p>
								</div>

								{/* Content Sections */}
								<div className="space-y-4">
									{/* Discord Requirement */}
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
												Oyuna giriş yapabilmek ve
												oynayabilmek için Discord
												sunucumuzda bulunman gerekiyor.
												Sunucudan çıkarsan oyuna
												erişimin kesilir.
											</p>
										</div>
									</div>

									{/* Role Multipliers */}
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
														2x Litre
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
														1x Litre
													</div>
												</div>
											</div>
											<p className="text-[10px] md:text-xs text-orange-800/50 mt-3 font-medium">
												* Discord rolüne göre elde
												edeceğin Litre otomatik olarak
												belirlenir.
											</p>
										</div>
									</div>
								</div>

								{/* Action Button */}
								<button
									onClick={onClose}
									className="w-full py-3 md:py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group text-sm md:text-base"
								>
									<span>Anlaşıldı</span>
									<Icon
										icon="lucide:check"
										className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-125 transition-transform"
									/>
								</button>
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

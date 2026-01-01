"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import OrangeCharacter from "@/components/OrangeCharacter";

export default function AuthErrorPage() {
	const [face, setFace] = useState(6); // 6: DizzyFace

	return (
		<main className="from-orange-rift-100 to-orange-rift-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br via-white p-4 text-center">
			{/* Background Effects */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="from-orange-rift-300/20 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-linear-to-br to-transparent blur-[100px]" />
				<div className="from-mlp-pink-300/20 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-linear-to-tl to-transparent blur-[100px] delay-1000" />
			</div>

			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: "spring", bounce: 0.5 }}
				className="relative z-10 flex flex-col items-center gap-8"
			>
				<div className="transition-transform duration-300 hover:scale-105">
					<OrangeCharacter
						currentFace={face}
						onClick={() => setFace((prev) => (prev === 6 ? 5 : 6))}
					/>
				</div>

				<div className="space-y-4">
					<motion.h1
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="font-baloo text-orange-rift-900 text-4xl font-black drop-shadow-sm md:text-5xl"
					>
						Büyülü Kapı Açılmadı!
					</motion.h1>

					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="space-y-2"
					>
						<h2 className="font-baloo text-orange-rift-900 text-xl font-black">
							Giriş İşlemi Başarısız
						</h2>
						<p className="text-orange-rift-800 mx-auto max-w-md text-lg font-bold">
							Kimlik doğrulama büyüsünde ufak bir aksaklık oldu. Belki de iksirin
							kıvamı tutmamıştır? Lütfen tekrar dene. 🍊
						</p>
					</motion.div>

					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="pt-4"
					>
						<Link
							href="/"
							className="group font-baloo border-orange-rift-100 text-orange-rift-700 hover:border-orange-rift-200 hover:bg-orange-rift-50 relative inline-flex items-center gap-2 rounded-xl border-2 bg-white px-8 py-4 text-lg font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
						>
							<span className="relative flex items-center gap-2">
								<svg
									className="h-5 w-5 transition-transform group-hover:-translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								Vadiye Geri Dön
							</span>
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</main>
	);
}

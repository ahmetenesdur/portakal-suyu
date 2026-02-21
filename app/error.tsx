"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import OrangeCharacter from "@/components/OrangeCharacter";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [face, setFace] = useState(5); // 5: DeadFace

	useEffect(() => {
		console.error("Uygulama Hatası:", error);
	}, [error]);

	const getErrorDetails = (msg: string) => {
		const lowerMsg = msg.toLowerCase();
		if (
			lowerMsg.includes("fetch") ||
			lowerMsg.includes("network") ||
			lowerMsg.includes("failed to fetch")
		) {
			return {
				title: "Bağlantı Koptu!",
				message:
					"Sunucuyla olan sihirli bağımız koptu. Lütfen internetini kontrol et. Birazdan tekrar deneyeceğiz...",
				icon: "lucide:wifi-off",
				retryDelay: 5000,
			};
		}
		if (lowerMsg.includes("auth") || lowerMsg.includes("session") || lowerMsg.includes("jwt")) {
			return {
				title: "Kimlik Doğrulama Hatası",
				message: "Oturumun kapanmış veya geçersiz olabilir. Lütfen tekrar giriş yap.",
				icon: "lucide:user-x",
			};
		}
		if (lowerMsg.includes("rate limit") || lowerMsg.includes("too many requests")) {
			return {
				title: "Sakin Ol Şampiyon!",
				message: "Çok hızlı gidiyorsun. Biraz bekle ve tekrar dene.",
				icon: "lucide:timer",
			};
		}
		return {
			title: "Eyvah! Sıkacak Tıkandı!",
			message:
				"Görünüşe göre sisteme inatçı bir çekirdek kaçtı. Merak etme, büyücülerimiz bu minik krizi çözmek için iş başında. 🍊✨",
			icon: "lucide:alert-triangle",
		};
	};

	const errorDetails = getErrorDetails(error.message);

	// Auto-retry specifically for connection errors
	useEffect(() => {
		if (errorDetails.retryDelay) {
			const timer = setTimeout(() => {
				reset();
			}, errorDetails.retryDelay);
			return () => clearTimeout(timer);
		}
	}, [errorDetails.retryDelay, reset]);

	return (
		<main className="from-orange-rift-100 to-orange-rift-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br via-white p-4 text-center">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: "spring", bounce: 0.5 }}
				className="relative z-10 flex flex-col items-center gap-8"
			>
				<div
					className="cursor-pointer transition-transform active:scale-95"
					onClick={() => setFace(5)}
				>
					<OrangeCharacter currentFace={face} onClick={() => setFace(6)} />
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-center gap-3">
						<Icon icon={errorDetails.icon} className="h-8 w-8 text-orange-600" />
						<h2 className="font-baloo text-orange-rift-900 text-3xl font-black drop-shadow-sm sm:text-4xl">
							{errorDetails.title}
						</h2>
					</div>

					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="text-orange-rift-800 mx-auto max-w-md text-lg font-bold"
					>
						{errorDetails.message}
					</motion.p>
				</div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="flex flex-col gap-3 sm:flex-row"
				>
					<button
						onClick={() => reset()}
						className="group font-baloo bg-orange-rift-600 shadow-orange-rift-600/20 hover:bg-orange-rift-700 relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
					>
						<Icon
							icon="lucide:refresh-ccw"
							className="h-5 w-5 transition-transform group-hover:rotate-180"
						/>
						Büyüyü Yenile
					</button>

					<button
						onClick={() => (window.location.href = "/")}
						className="font-baloo border-orange-rift-100 text-orange-rift-900 hover:border-orange-rift-200 hover:bg-orange-rift-50 inline-flex items-center justify-center gap-2 rounded-xl border-2 bg-white px-6 py-4 text-lg font-bold transition-all hover:scale-105 active:scale-95"
					>
						<Icon icon="lucide:home" className="h-5 w-5" />
						Ana Ekrana Dön
					</button>
				</motion.div>
			</motion.div>

			{/* Background Splat Effect */}
			<div className="from-orange-rift-200/20 via-orange-rift-100/20 absolute top-1/2 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr to-transparent blur-3xl" />
		</main>
	);
}

"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";

export default function AuthErrorPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-start pb-16 relative overflow-hidden bg-orange-50">
			<Navbar />
			<div className="z-10 flex flex-col items-center justify-center flex-1 w-full max-w-4xl px-4 pt-8 md:pt-0">
				<div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl max-w-md w-full space-y-6">
					<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
						<Icon
							icon="lucide:alert-circle"
							width="40"
							height="40"
						/>
					</div>

					<div className="space-y-2">
						<h1 className="text-2xl font-black text-orange-900">
							Giriş Hatası
						</h1>
						<p className="text-orange-800/70">
							Giriş yaparken bir sorun oluştu. Lütfen tekrar
							deneyin.
						</p>
					</div>

					<Link
						href="/"
						className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
					>
						Ana Sayfaya Dön
					</Link>
				</div>
			</div>
		</main>
	);
}

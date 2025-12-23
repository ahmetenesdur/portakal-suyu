"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

import Navbar from "@/components/Navbar";

export default function AuthErrorPage() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-orange-50 pb-16">
			<Navbar />
			<div className="z-10 flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pt-8 md:pt-0">
				<div className="w-full max-w-md space-y-6 rounded-3xl border border-white/50 bg-white/60 p-8 shadow-xl backdrop-blur-xl">
					<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
						<Icon icon="lucide:alert-circle" width="40" height="40" />
					</div>

					<div className="space-y-2">
						<h1 className="text-2xl font-black text-orange-900">Giriş Hatası</h1>
						<p className="text-orange-800/70">
							Giriş yaparken bir sorun oluştu. Lütfen tekrar deneyin.
						</p>
					</div>

					<Link
						href="/"
						className="block w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition-all hover:scale-105 hover:bg-orange-600 active:scale-95"
					>
						Ana Sayfaya Dön
					</Link>
				</div>
			</div>
		</main>
	);
}

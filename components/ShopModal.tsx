"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { ShopItem } from "@/types";
import { useAuth } from "@/components/AuthProvider";
import ShopItemCard from "./ShopItemCard";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";
import LoginPromptModal from "./LoginPromptModal";
import BaseModal from "./BaseModal";

interface ShopModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ShopModal({ isOpen, onClose }: ShopModalProps) {
	const { profile, signInWithDiscord } = useAuth();
	const [activeTab, setActiveTab] = useState<
		"upgrade" | "consumable" | "face"
	>("upgrade");
	const [items, setItems] = useState<ShopItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [purchasing, setPurchasing] = useState<number | null>(null);
	const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			fetchItems();
		}
	}, [isOpen]);

	const fetchItems = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/shop/items");
			if (!res.ok) throw new Error("Failed to fetch");
			const data = await res.json();
			if (Array.isArray(data)) {
				setItems(data);
			}
		} catch (error) {
			console.error("Failed to fetch shop items", error);
			toast.error("Mağaza verileri yüklenemedi.");
		} finally {
			setLoading(false);
		}
	};

	const handleBuy = async (item: ShopItem) => {
		if (!profile || profile.role === "Misafir") {
			setIsLoginPromptOpen(true);
			return;
		}

		const balance = profile?.score ?? 0;
		if (balance < item.price) return;

		setPurchasing(item.id);
		try {
			const res = await fetch("/api/shop/buy", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ itemId: item.id }),
			});

			const data = await res.json();

			if (res.ok) {
				// Refresh items to update "owned" status
				await fetchItems();

				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 },
					colors: ["#fb923c", "#fca5a5", "#fbbf24"],
				});
				toast.success(data.message || "Satın alma başarılı!");
			} else {
				toast.error(data.error || "Satın alma işlemi başarısız oldu.");
			}
		} catch (error) {
			console.error("Purchase failed", error);
			toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
		} finally {
			setPurchasing(null);
		}
	};

	const filteredItems = items.filter((item) => item.type === activeTab);

	return (
		<>
			<BaseModal
				isOpen={isOpen}
				onClose={onClose}
				className="max-w-2xl flex flex-col max-h-[85vh] overflow-hidden"
			>
				<div className="p-6 pb-2 relative z-10 bg-white/50">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-orange-100 rounded-xl text-orange-600">
								<Icon
									icon="lucide:store"
									className="w-5 h-5 sm:w-6 sm:h-6"
								/>
							</div>
							<div>
								<h2 className="text-xl sm:text-2xl font-black text-orange-900 tracking-tight">
									Portakal Pazarı
								</h2>
								<p className="text-xs font-bold text-orange-800/50 uppercase tracking-widest">
									Paranın Geçmediği Tek Yer
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer"
						>
							<Icon icon="lucide:x" className="w-5 h-5" />
						</button>
					</div>

					<div className="bg-orange-500 text-white p-3 sm:p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-orange-500/20 mb-4">
						<div className="flex flex-col">
							<span className="text-orange-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
								Mevcut Bakiye
							</span>
							<span className="text-xl sm:text-2xl font-black font-mono">
								{(profile?.score ?? 0).toLocaleString()}
							</span>
						</div>
						<Icon
							icon="lucide:citrus"
							className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200"
						/>
					</div>

					<div className="grid grid-cols-3 gap-2 p-1 bg-gray-100/80 rounded-xl">
						<button
							onClick={() => setActiveTab("upgrade")}
							className={`py-2 rounded-lg text-[10px] sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer
                                            ${
												activeTab === "upgrade"
													? "bg-white text-orange-600 shadow-sm"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
											}`}
						>
							<Icon
								icon="lucide:hammer"
								className="w-4 h-4 sm:w-4 sm:h-4"
							/>
							<span>Geliştirmeler</span>
						</button>
						<button
							onClick={() => setActiveTab("consumable")}
							className={`py-2 rounded-lg text-[10px] sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer
                                            ${
												activeTab === "consumable"
													? "bg-white text-blue-600 shadow-sm"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
											}`}
						>
							<Icon
								icon="lucide:zap"
								className="w-4 h-4 sm:w-4 sm:h-4"
							/>
							<span>Buff&apos;lar</span>
						</button>
						<button
							onClick={() => setActiveTab("face")}
							className={`py-2 rounded-lg text-[10px] sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer
                                            ${
												activeTab === "face"
													? "bg-white text-pink-600 shadow-sm"
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
											}`}
						>
							<Icon
								icon="lucide:smile"
								className="w-4 h-4 sm:w-4 sm:h-4"
							/>
							<span>Kozmetik</span>
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50/50">
					{loading ? (
						<div className="flex items-center justify-center h-40">
							<div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
						</div>
					) : filteredItems.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
							{filteredItems.map((item) => (
								<ShopItemCard
									key={item.id}
									item={item}
									onBuy={handleBuy}
									canAfford={
										(profile?.score ?? 0) >= item.price
									}
									loading={
										purchasing === item.id ||
										purchasing !== null
									}
									userStatus={
										!profile
											? "visitor"
											: profile.role === "Misafir"
											? "guest"
											: "member"
									}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-40 text-gray-400">
							<Icon
								icon="lucide:package-open"
								className="w-12 h-12 mb-2 opacity-50"
							/>
							<p className="text-sm font-medium">
								Bu kategoride ürün yok.
							</p>
						</div>
					)}
				</div>
			</BaseModal>

			<LoginPromptModal
				isOpen={isLoginPromptOpen}
				onClose={() => setIsLoginPromptOpen(false)}
				onLogin={() => {
					if (profile?.role === "Misafir") {
						window.open("https://discord.gg/NdEfduN4nU", "_blank");
					} else {
						signInWithDiscord();
					}
				}}
				variant={profile?.role === "Misafir" ? "join" : "login"}
			/>
		</>
	);
}

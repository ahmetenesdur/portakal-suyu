"use client";

import { Icon } from "@iconify/react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { getShopItems, getUserInventory, purchaseItem } from "@/app/actions/shop";
import { useAuth } from "@/components/AuthProvider";
import { ShopItem } from "@/types/game";

import LoginPromptModal from "./LoginPromptModal";
import ShopItemCard from "./ShopItemCard";
import BaseModal from "./ui/BaseModal";

interface ShopModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ShopModal({ isOpen, onClose }: ShopModalProps) {
	const { profile, signInWithDiscord } = useAuth();
	const [activeTab, setActiveTab] = useState<"upgrade" | "consumable" | "face">("upgrade");
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
			// Parallel fetch for speed
			const [fetchedItems, inventoryIds] = await Promise.all([
				getShopItems(),
				getUserInventory(),
			]);

			const itemsWithOwnership = fetchedItems.map((item) => ({
				...item,
				is_owned: inventoryIds.includes(item.id),
				is_locked:
					item.required_item_id && !inventoryIds.includes(item.required_item_id)
						? true
						: false,
			}));

			setItems(itemsWithOwnership);
		} catch (error) {
			console.error("Failed to fetch shop items", error);
			toast.error("Pazar verileri yüklenemedi.");
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
			const result = await purchaseItem(item.id);

			if (result.success) {
				// Refresh items to update "owned" status
				await fetchItems();

				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 },
					colors: ["#fb923c", "#fca5a5", "#fbbf24"],
				});
				toast.success(result.message || "Satın alma başarılı!");
			} else {
				toast.error(result.error || "Satın alma işlemi başarısız oldu.");
			}
		} catch {
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
				className="flex max-h-[80dvh] max-w-2xl flex-col overflow-hidden md:max-h-[85vh]"
			>
				<div className="relative z-10 bg-white/50 p-6 pb-2">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="rounded-xl bg-orange-100 p-3 text-orange-600">
								<Icon icon="lucide:store" className="h-5 w-5 sm:h-6 sm:w-6" />
							</div>
							<div>
								<h2 className="text-xl font-black tracking-tight text-orange-900 sm:text-2xl">
									Portakal Pazarı
								</h2>
								<p className="text-xs font-bold tracking-widest text-orange-800/50 uppercase">
									Paranın Geçmediği Tek Yer
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
						>
							<Icon icon="lucide:x" className="h-5 w-5" />
						</button>
					</div>

					<div className="mb-4 flex items-center justify-between rounded-2xl bg-orange-500 p-3 text-white shadow-lg shadow-orange-500/20 sm:p-4">
						<div className="flex flex-col">
							<span className="text-[10px] font-bold tracking-wider text-orange-200 uppercase sm:text-xs">
								Mevcut Bakiye
							</span>
							<span className="font-mono text-xl font-black sm:text-2xl">
								{(profile?.score ?? 0).toLocaleString()}
							</span>
						</div>
						<Icon
							icon="lucide:citrus"
							className="h-6 w-6 text-orange-200 sm:h-8 sm:w-8"
						/>
					</div>

					<div
						className="grid grid-cols-3 gap-1 rounded-2xl border border-white/50 bg-white/30 p-1.5 shadow-sm backdrop-blur-md"
						role="tablist"
						aria-label="Shop Categories"
					>
						<button
							role="tab"
							aria-selected={activeTab === "upgrade"}
							aria-controls="panel-upgrade"
							id="tab-upgrade"
							onClick={() => setActiveTab("upgrade")}
							className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-all sm:flex-row sm:gap-2 sm:text-sm ${
								activeTab === "upgrade"
									? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
									: "text-gray-600 hover:scale-105 hover:bg-white/50 active:scale-95"
							}`}
						>
							<Icon icon="lucide:hammer" className="h-4 w-4 sm:h-4 sm:w-4" />
							<span>Geliştirmeler</span>
						</button>
						<button
							role="tab"
							aria-selected={activeTab === "consumable"}
							aria-controls="panel-consumable"
							id="tab-consumable"
							onClick={() => setActiveTab("consumable")}
							className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-all sm:flex-row sm:gap-2 sm:text-sm ${
								activeTab === "consumable"
									? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
									: "text-gray-600 hover:scale-105 hover:bg-white/50 active:scale-95"
							}`}
						>
							<Icon icon="lucide:zap" className="h-4 w-4 sm:h-4 sm:w-4" />
							<span>Buff&apos;lar</span>
						</button>
						<button
							role="tab"
							aria-selected={activeTab === "face"}
							aria-controls="panel-face"
							id="tab-face"
							onClick={() => setActiveTab("face")}
							className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-all sm:flex-row sm:gap-2 sm:text-sm ${
								activeTab === "face"
									? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
									: "text-gray-600 hover:scale-105 hover:bg-white/50 active:scale-95"
							}`}
						>
							<Icon icon="lucide:smile" className="h-4 w-4 sm:h-4 sm:w-4" />
							<span>Kozmetik</span>
						</button>
					</div>
				</div>

				<div
					className="custom-scrollbar flex-1 overflow-y-auto bg-gray-50/50 p-3 sm:p-6"
					role="tabpanel"
					id={`panel-${activeTab}`}
					aria-labelledby={`tab-${activeTab}`}
				>
					{loading ? (
						<div className="flex h-40 items-center justify-center">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
						</div>
					) : filteredItems.length > 0 ? (
						<div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
							{filteredItems.map((item) => (
								<ShopItemCard
									key={item.id}
									item={item}
									onBuy={handleBuy}
									canAfford={(profile?.score ?? 0) >= item.price}
									loading={purchasing === item.id || purchasing !== null}
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
						<div className="flex h-40 flex-col items-center justify-center text-gray-400">
							<Icon
								icon="lucide:package-open"
								className="mb-2 h-12 w-12 opacity-50"
							/>
							<p className="text-sm font-medium">Bu kategoride ürün yok.</p>
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

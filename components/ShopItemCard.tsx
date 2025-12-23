import { ShopItem } from "@/types";
import { Icon } from "@iconify/react";

interface ShopItemCardProps {
	item: ShopItem;
	onBuy: (item: ShopItem) => void;
	canAfford: boolean;
	loading: boolean;
	userStatus: "member" | "guest" | "visitor";
}

export default function ShopItemCard({
	item,
	onBuy,
	canAfford,
	loading,
	userStatus = "member",
}: ShopItemCardProps) {
	const isLocked = item.is_locked;
	const isOwnedPermanent =
		item.is_owned && (item.type === "face" || item.type === "upgrade");
	const isDisabled =
		isLocked ||
		(isOwnedPermanent && userStatus === "member") ||
		(userStatus === "member" && (!canAfford || loading));

	return (
		<div
			className={`relative group p-3 sm:p-4 rounded-2xl border transition-all hover:-translate-y-1
            ${
				isLocked
					? "bg-gray-100 border-gray-200 opacity-70 grayscale"
					: "bg-white/60 border-orange-100 shadow-sm hover:shadow-md"
			}
        `}
		>
			{item.type === "upgrade" && item.tier && item.tier > 0 && (
				<div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full uppercase tracking-wider">
					Seviye {item.tier}
				</div>
			)}

			{item.duration_minutes && (
				<div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
					<Icon icon="lucide:clock" className="w-3 h-3" />
					{item.duration_minutes}dk
				</div>
			)}

			<div
				className={`relative h-20 sm:h-24 mb-3 flex items-center justify-center rounded-xl overflow-hidden transition-colors
                ${
					isLocked
						? "bg-gray-200"
						: item.type === "upgrade"
						? "bg-orange-50 group-hover:bg-orange-100"
						: item.type === "consumable"
						? "bg-blue-50 group-hover:bg-blue-100"
						: "bg-pink-50 group-hover:bg-pink-100"
				}
            `}
			>
				{isLocked && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
						<Icon
							icon="lucide:lock"
							className="w-8 h-8 text-gray-500"
						/>
					</div>
				)}

				<Icon
					icon={
						item.image_url === "mechanical-squeezer"
							? "lucide:cog"
							: item.image_url === "hydraulic-press"
							? "lucide:weight"
							: item.image_url === "laser-cutter"
							? "lucide:flame"
							: item.image_url === "coffee"
							? "lucide:coffee"
							: item.image_url === "energy-drink"
							? "lucide:zap"
							: item.image_url === "vitamin-c"
							? "lucide:pill"
							: item.type === "face"
							? "lucide:smile" // Default icon for faces
							: item.type === "upgrade"
							? "lucide:zap"
							: item.type === "consumable"
							? "lucide:zap" // Fallback for buff
							: "lucide:star"
					}
					className={`w-12 h-12 transition-transform duration-300 group-hover:scale-110
                        ${
							isLocked
								? "text-gray-400"
								: item.type === "upgrade"
								? "text-orange-500"
								: item.type === "consumable"
								? "text-blue-500"
								: "text-pink-500"
						}
                    `}
				/>
			</div>

			<div className="space-y-1 mb-3">
				<h3 className="font-bold text-orange-900 leading-tight text-sm sm:text-base">
					{item.name}
				</h3>
				<p className="text-[10px] sm:text-xs text-orange-700/60 line-clamp-2 h-7 sm:h-8">
					{item.description}
				</p>
			</div>

			<button
				onClick={() => !isLocked && onBuy(item)}
				disabled={isDisabled}
				className={`w-full py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all
                    ${
						userStatus !== "member"
							? "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/20 active:scale-[0.98] cursor-pointer"
							: isLocked
							? "bg-gray-200 text-gray-400 cursor-not-allowed"
							: item.is_owned &&
							  (item.type === "face" || item.type === "upgrade")
							? "bg-green-100 text-green-700 cursor-default"
							: !canAfford
							? "bg-gray-100 text-gray-400 cursor-not-allowed"
							: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
					}
                `}
			>
				{userStatus === "visitor" ? (
					<>
						<Icon
							icon="simple-icons:discord"
							className="w-3.5 h-3.5"
						/>
						Giriş Yap
					</>
				) : userStatus === "guest" ? (
					<>
						<Icon
							icon="simple-icons:discord"
							className="w-3.5 h-3.5"
						/>
						Sunucuya Katıl
					</>
				) : isLocked ? (
					<>
						<Icon icon="lucide:lock" className="w-3 h-3" />
						Kilitli
					</>
				) : item.is_owned &&
				  (item.type === "face" || item.type === "upgrade") ? (
					<>
						<Icon icon="lucide:check" className="w-3.5 h-3.5" />
						Satın Alındı
					</>
				) : (
					<>
						<span className={canAfford ? "" : "opacity-80"}>
							{item.price.toLocaleString()} Lt
						</span>
					</>
				)}
			</button>
		</div>
	);
}

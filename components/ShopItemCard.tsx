import { Icon } from "@iconify/react";

import CoolFace from "@/components/orange/faces/CoolFace";
import DeadFace from "@/components/orange/faces/DeadFace";
import DefaultFace from "@/components/orange/faces/DefaultFace";
import DizzyFace from "@/components/orange/faces/DizzyFace";
import ExcitedFace from "@/components/orange/faces/ExcitedFace";
import HappyFace from "@/components/orange/faces/HappyFace";
import KingFace from "@/components/orange/faces/KingFace";
import LoveFace from "@/components/orange/faces/LoveFace";
import NinjaFace from "@/components/orange/faces/NinjaFace";
import RichFace from "@/components/orange/faces/RichFace";
import SurprisedFace from "@/components/orange/faces/SurprisedFace";
import WinkFace from "@/components/orange/faces/WinkFace";
import { ShopItem } from "@/types";

interface ShopItemCardProps {
	item: ShopItem;
	onBuy: (item: ShopItem) => void;
	canAfford: boolean;
	loading: boolean;
	userStatus: "member" | "guest" | "visitor";
}

const FACE_COMPONENTS: Record<number, React.ComponentType> = {
	0: DefaultFace,
	1: HappyFace,
	2: SurprisedFace,
	3: WinkFace,
	4: ExcitedFace,
	5: DeadFace,
	6: DizzyFace,
	7: CoolFace,
	8: KingFace,
	9: LoveFace,
	10: RichFace,
	11: NinjaFace,
};

export default function ShopItemCard({
	item,
	onBuy,
	canAfford,
	loading,
	userStatus = "member",
}: ShopItemCardProps) {
	const isLocked = item.is_locked;
	const isOwnedPermanent = item.is_owned && (item.type === "face" || item.type === "upgrade");
	const isDisabled =
		isLocked ||
		(isOwnedPermanent && userStatus === "member") ||
		(userStatus === "member" && (!canAfford || loading));

	const FaceComponent =
		item.type === "face" ? FACE_COMPONENTS[item.effect_value] || DefaultFace : null;

	return (
		<div
			className={`group relative rounded-2xl border p-3 transition-all hover:-translate-y-1 sm:p-4 ${
				isLocked
					? "border-gray-200 bg-gray-100 opacity-70 grayscale"
					: "border-orange-100 bg-white/60 shadow-sm hover:shadow-md"
			} `}
		>
			{item.type === "upgrade" && item.tier && item.tier > 0 && (
				<div className="absolute top-3 right-3 z-20 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black tracking-wider text-orange-700 uppercase">
					Seviye {item.tier}
				</div>
			)}

			{item.duration_minutes && (
				<div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black tracking-wider text-blue-700 uppercase">
					<Icon icon="lucide:clock" className="h-3 w-3" />
					{item.duration_minutes}dk
				</div>
			)}

			<div
				className={`relative mb-3 flex h-20 items-center justify-center overflow-hidden rounded-xl transition-colors sm:h-24 ${
					isLocked
						? "bg-gray-200"
						: item.type === "upgrade"
							? "bg-orange-50 group-hover:bg-orange-100"
							: item.type === "consumable"
								? "bg-blue-50 group-hover:bg-blue-100"
								: "bg-pink-50 group-hover:bg-pink-100"
				} `}
			>
				{isLocked && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
						<Icon icon="lucide:lock" className="h-8 w-8 text-gray-500" />
					</div>
				)}

				{item.type === "face" && FaceComponent ? (
					<div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full sm:h-20 sm:w-20">
						{/* Mini Orange Background Detail */}
						<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
						<div className="absolute top-2 left-3 h-3 w-6 -rotate-12 rounded-full bg-white/40 blur-sm" />

						{/* Face Preview (Scaled down) */}
						<div className="scale-[0.25] sm:scale-[0.3]">
							<FaceComponent />
						</div>
					</div>
				) : (
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
													: item.type === "upgrade"
														? "lucide:zap"
														: item.type === "consumable"
															? "lucide:zap"
															: "lucide:star"
						}
						className={`h-12 w-12 transition-transform duration-300 group-hover:scale-110 ${
							isLocked
								? "text-gray-400"
								: item.type === "upgrade"
									? "text-orange-500"
									: item.type === "consumable"
										? "text-blue-500"
										: "text-pink-500"
						} `}
					/>
				)}
			</div>

			<div className="mb-3 space-y-1">
				<h3 className="text-sm leading-tight font-bold text-orange-900 sm:text-base">
					{item.name}
				</h3>
				<p className="line-clamp-2 h-7 text-[10px] text-orange-700/60 sm:h-8 sm:text-xs">
					{item.description}
				</p>
			</div>

			<button
				onClick={() => !isLocked && onBuy(item)}
				disabled={isDisabled}
				className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-[10px] font-bold transition-all sm:py-2 sm:text-xs ${
					userStatus !== "member"
						? "cursor-pointer bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/20 hover:bg-[#4752C4] active:scale-[0.98]"
						: isLocked
							? "cursor-not-allowed bg-gray-200 text-gray-400"
							: item.is_owned && (item.type === "face" || item.type === "upgrade")
								? "cursor-default bg-green-100 text-green-700"
								: !canAfford
									? "cursor-not-allowed bg-gray-100 text-gray-400"
									: "cursor-pointer bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98]"
				} `}
			>
				{userStatus === "visitor" ? (
					<>
						<Icon icon="simple-icons:discord" className="h-3.5 w-3.5" />
						Giriş Yap
					</>
				) : userStatus === "guest" ? (
					<>
						<Icon icon="simple-icons:discord" className="h-3.5 w-3.5" />
						Sunucuya Katıl
					</>
				) : isLocked ? (
					<>
						<Icon icon="lucide:lock" className="h-3 w-3" />
						Kilitli
					</>
				) : item.is_owned && (item.type === "face" || item.type === "upgrade") ? (
					<>
						<Icon icon="lucide:check" className="h-3.5 w-3.5" />
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

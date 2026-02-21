import { Icon } from "@iconify/react";
import Link from "next/link";

interface NavbarActionsProps {
	onOpenShopModal: () => void;
	onOpenInfoModal: () => void;
}

export function NavbarActions({ onOpenShopModal, onOpenInfoModal }: NavbarActionsProps) {
	return (
		<>
			<button
				onClick={onOpenShopModal}
				className="group hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/40 active:scale-95 md:flex md:h-10 md:w-10"
				title="Portakal Pazarı"
			>
				<Icon
					icon="lucide:store"
					width="18"
					height="18"
					className="transition-transform group-hover:rotate-12 md:h-5 md:w-5"
				/>
			</button>

			<Link
				href="/leaderboard"
				className="group hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/40 active:scale-95 md:flex md:h-10 md:w-10"
				title="Liderlik Tablosu"
			>
				<Icon
					icon="lucide:medal"
					width="18"
					height="18"
					className="transition-transform group-hover:rotate-12 md:h-5 md:w-5"
				/>
			</Link>

			<button
				onClick={onOpenInfoModal}
				className="group hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-orange-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/40 active:scale-95 md:flex md:h-10 md:w-10"
				title="Bilgi"
			>
				<Icon
					icon="lucide:info"
					width="18"
					height="18"
					className="transition-transform group-hover:rotate-12 md:h-5 md:w-5"
				/>
			</button>
		</>
	);
}

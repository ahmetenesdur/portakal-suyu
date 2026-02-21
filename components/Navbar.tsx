"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { NavbarActions } from "./navbar/NavbarActions";
import { NavbarBrand } from "./navbar/NavbarBrand";
import { NavbarUserMenu } from "./navbar/NavbarUserMenu";

const InfoModal = dynamic(() => import("@/components/InfoModal"), {
	ssr: false,
});
const ShopModal = dynamic(() => import("@/components/ShopModal"), {
	ssr: false,
});

export default function Navbar() {
	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [isShopModalOpen, setIsShopModalOpen] = useState(false);

	return (
		<>
			<InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
			<ShopModal isOpen={isShopModalOpen} onClose={() => setIsShopModalOpen(false)} />

			<header className="pointer-events-none sticky top-0 left-0 z-50 flex w-full items-center justify-between p-4 md:p-6">
				<NavbarBrand />

				<div className="pointer-events-auto relative flex items-center gap-3 md:gap-4">
					<NavbarActions
						onOpenShopModal={() => setIsShopModalOpen(true)}
						onOpenInfoModal={() => setIsInfoModalOpen(true)}
					/>
					<NavbarUserMenu
						onOpenShopModal={() => setIsShopModalOpen(true)}
						onOpenInfoModal={() => setIsInfoModalOpen(true)}
					/>
				</div>
			</header>
		</>
	);
}

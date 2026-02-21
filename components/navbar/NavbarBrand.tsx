import Link from "next/link";

import OrangeIcon from "@/components/Icons";

export function NavbarBrand() {
	return (
		<Link
			href="/"
			className="group pointer-events-auto flex cursor-pointer items-center gap-2 rounded-2xl border border-white/30 bg-white/20 px-3 py-2 shadow-sm backdrop-blur-md transition-all hover:bg-white/30 md:gap-3 md:px-4 md:py-2"
		>
			<div className="flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:rotate-12 md:h-10 md:w-10">
				<OrangeIcon className="h-6 w-6 drop-shadow-md md:h-8 md:w-8" />
			</div>
			<div className="flex flex-col">
				<span className="text-lg leading-none font-black tracking-tight text-orange-900 transition-colors group-hover:text-orange-700 md:text-xl">
					Portakal
				</span>
				<span className="text-xs leading-none font-bold tracking-widest text-orange-800/60 md:text-sm">
					VADİSİ
				</span>
			</div>
		</Link>
	);
}

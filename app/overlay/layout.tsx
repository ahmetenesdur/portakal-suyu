import { Baloo_2 } from "next/font/google";

import { cn } from "@/lib/utils/styles";

const baloo2 = Baloo_2({
	subsets: ["latin", "latin-ext"],
	weight: ["400", "500", "600", "700", "800"],
});

export default function OverlayLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={cn("min-h-screen w-full overflow-hidden bg-transparent", baloo2.className)}>
			{children}
		</div>
	);
}

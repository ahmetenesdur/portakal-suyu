import { Fredoka } from "next/font/google";

import { cn } from "@/lib/utils";

const fredoka = Fredoka({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export default function OrangeOverlayLayout({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={cn("min-h-screen w-full overflow-hidden bg-transparent", fredoka.className)}
		>
			{children}
		</div>
	);
}

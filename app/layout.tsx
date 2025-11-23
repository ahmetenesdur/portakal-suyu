import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const baloo2 = Baloo_2({
	subsets: ["latin", "latin-ext"],
	weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: {
		default: "Sihirli Portakal Vadisi | Azra",
		template: "%s | Sihirli Portakal Vadisi",
	},
	description:
		"Azra (Portakal Suyu) için hazırlanmış interaktif topluluk oyunu. Portakalları sık, vadiyi enerjiyle doldur ve sürprizleri keşfet!",
	metadataBase: new URL("https://portakal-suyu.vercel.app"),
	keywords: [
		"Portakal Suyu",
		"Azra",
		"Twitch",
		"Yayıncı",
		"Clicker Game",
		"Topluluk Oyunu",
		"Sihirli Vadi",
	],
	authors: [
		{ name: "Ahmet Enes Dur", url: "https://github.com/ahmetenesdur" },
	],
	creator: "Ahmet Enes Dur",
	openGraph: {
		type: "website",
		locale: "tr_TR",
		url: "https://portakal-suyu.vercel.app",
		title: "Sihirli Portakal Vadisi | Azra",
		description:
			"Azra (Portakal Suyu) için hazırlanmış interaktif topluluk oyunu. Portakalları sık, vadiyi enerjiyle doldur!",
		siteName: "Sihirli Portakal Vadisi",
		images: [
			{
				url: "/og-image.png", // We should probably create this or use a placeholder
				width: 1200,
				height: 630,
				alt: "Sihirli Portakal Vadisi",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Sihirli Portakal Vadisi | Azra",
		description:
			"Azra (Portakal Suyu) için hazırlanmış interaktif topluluk oyunu. Portakalları sık, vadiyi enerjiyle doldur!",
		images: ["/og-image.png"],
		creator: "@portakalsuyu", // Placeholder
	},
};

import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="tr" suppressHydrationWarning>
			<body
				className={cn(
					baloo2.className,
					"antialiased min-h-screen bg-linear-to-b from-orange-rift-50 to-white text-foreground overflow-x-hidden selection:bg-orange-rift-200 selection:text-orange-rift-900"
				)}
			>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}

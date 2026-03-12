import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";

import { cn } from "@/lib/utils/styles";

const baloo2 = Baloo_2({
	subsets: ["latin", "latin-ext"],
	weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: {
		default: "Sihirli Portakal Vadisi",
		template: "%s | Sihirli Portakal Vadisi",
	},
	description:
		"Portakal Suyu için hazırlanmış interaktif topluluk oyunu. Portakalları sık, vadiyi enerjiyle doldur ve sürprizleri keşfet!",
	metadataBase: new URL("https://portakal-suyu.vercel.app"),
	keywords: [
		"Portakal Suyu",
		"Twitch",
		"Kick",
		"Yayıncı",
		"Clicker Game",
		"Topluluk Oyunu",
		"Sihirli Vadi",
	],
	authors: [{ name: "Ahmet Enes Dur", url: "https://github.com/ahmetenesdur" }],
	creator: "Ahmet Enes Dur",
	openGraph: {
		type: "website",
		locale: "tr_TR",
		url: "https://portakal-suyu.vercel.app",
		title: "Sihirli Portakal Vadisi",
		description:
			"Portakal Suyu için hazırlanmış interaktif topluluk oyunu. Portakalları sık, vadiyi enerjiyle doldur!",
		siteName: "Sihirli Portakal Vadisi",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Sihirli Portakal Vadisi",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Sihirli Portakal Vadisi",
		description:
			"Portakal Suyu için hazırlanmış interaktif topluluk oyunu. Portakalları sık, vadiyi enerjiyle doldur!",
		images: ["/og-image.png"],
		creator: "@portakalsuyu",
	},
};

import { Toaster } from "react-hot-toast";

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
					"from-orange-rift-50 text-foreground selection:bg-orange-rift-200 selection:text-orange-rift-900 min-h-screen overflow-x-hidden bg-linear-to-b to-white antialiased"
				)}
			>
				<AuthProvider>
					{children}
					<Toaster
						position="bottom-right"
						toastOptions={{
							className:
								"bg-white/90 backdrop-blur-md text-orange-900 border-2 border-orange-100 shadow-xl !rounded-2xl font-bold font-baloo",
							success: {
								iconTheme: {
									primary: "#f97316",
									secondary: "#fff",
								},
							},
							error: {
								iconTheme: {
									primary: "#ef4444",
									secondary: "#fff",
								},
							},
						}}
					/>
					<Analytics />
					<SpeedInsights />
				</AuthProvider>
			</body>
		</html>
	);
}

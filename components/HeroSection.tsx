import { Icon } from "@iconify/react";
import { User } from "@supabase/supabase-js";

import Loading from "@/components/Loading";

interface HeroSectionProps {
	loading: boolean;
	user: User | null;
}

export default function HeroSection({ loading, user }: HeroSectionProps) {
	return (
		<div className="space-y-4 text-center">
			<div className="mb-2 inline-flex animate-bounce items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-1.5 text-sm font-bold text-orange-600 shadow-sm backdrop-blur-sm">
				<Icon icon="lucide:sparkles" width="16" height="16" className="text-yellow-500" />
				<span>
					{loading ? (
						<Loading size="sm" />
					) : (
						<>
							Hoş Geldin{" "}
							{user?.user_metadata?.custom_claims?.global_name || "Sihirdar"}!
						</>
					)}
				</span>
			</div>
			<h1 className="bg-linear-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-4xl font-black tracking-tighter text-transparent drop-shadow-sm sm:text-6xl md:text-8xl">
				PORTAKAL
				<br />
				VADİSİ
			</h1>
			<p className="mx-auto max-w-lg px-4 text-lg leading-relaxed font-medium text-orange-900/60 md:text-xl">
				Azra için portakalları sık, vadiyi enerjiyle doldur! Her tıklama bir damla mutluluk.
				🧡
			</p>
		</div>
	);
}

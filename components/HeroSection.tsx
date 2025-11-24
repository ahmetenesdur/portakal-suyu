import { Icon } from "@iconify/react";
import Loading from "@/components/Loading";
import { User } from "@supabase/supabase-js";

interface HeroSectionProps {
	loading: boolean;
	user: User | null;
}

export default function HeroSection({ loading, user }: HeroSectionProps) {
	return (
		<div className="text-center space-y-4">
			<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 text-orange-600 rounded-full text-sm font-bold mb-2 border border-white/50 shadow-sm backdrop-blur-sm animate-bounce">
				<Icon
					icon="lucide:sparkles"
					width="16"
					height="16"
					className="text-yellow-500"
				/>
				<span>
					{loading ? (
						<Loading size="sm" />
					) : (
						<>
							Hoş Geldin{" "}
							{user?.user_metadata?.custom_claims?.global_name ||
								"Sihirdar"}
							!
						</>
					)}
				</span>
			</div>
			<h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-orange-500 to-yellow-500 drop-shadow-sm tracking-tighter">
				PORTAKAL
				<br />
				VADİSİ
			</h1>
			<p className="text-lg md:text-xl text-orange-900/60 max-w-lg mx-auto font-medium leading-relaxed px-4">
				Azra için portakalları sık, vadiyi enerjiyle doldur! Her tıklama
				bir damla mutluluk. 🧡
			</p>
		</div>
	);
}

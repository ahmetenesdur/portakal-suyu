import { Icon } from "@iconify/react";
import Clicker from "@/components/Clicker";
import { Profile } from "@/types";

interface GameAreaProps {
	profile: Profile | null;
	playPop: () => void;
}

export default function GameArea({ profile, playPop }: GameAreaProps) {
	if (profile?.role === "Misafir") {
		return (
			<div className="flex flex-col items-center gap-6 p-8 bg-white/60 backdrop-blur-2xl rounded-4xl border border-orange-100/50 shadow-2xl shadow-orange-500/10 text-center max-w-md mx-4 relative overflow-hidden group">
				{/* Decorative Background Elements */}
				<div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-orange-50/50 to-transparent pointer-events-none" />
				<div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl group-hover:bg-orange-300/30 transition-colors duration-500" />
				<div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl group-hover:bg-yellow-300/30 transition-colors duration-500" />

				<div className="relative">
					<div className="w-24 h-24 bg-linear-to-br from-orange-100 to-yellow-50 rounded-full flex items-center justify-center shadow-inner ring-8 ring-white/50 mb-2 group-hover:scale-110 transition-transform duration-500">
						<Icon
							icon="lucide:lock"
							className="w-10 h-10 text-orange-500 drop-shadow-sm"
						/>
					</div>
					<div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-orange-100">
						<Icon
							icon="lucide:shield-alert"
							className="w-4 h-4 text-orange-400"
						/>
					</div>
				</div>

				<div className="space-y-3 relative z-10">
					<h2 className="text-3xl font-black text-orange-950 tracking-tight">
						Sadece Üyeler!
					</h2>
					<p className="text-orange-800/70 font-medium leading-relaxed">
						Portakal Vadisi&apos;nin kapıları sadece topluluğumuzun
						değerli üyelerine açık. İçeri girmek için Discord&apos;a
						gel!
					</p>
				</div>

				<a
					href="https://discord.gg/NdEfduN4nU"
					target="_blank"
					rel="noopener noreferrer"
					className="relative z-10 w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-2xl shadow-xl shadow-[#5865F2]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn overflow-hidden"
				>
					<div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
					<Icon
						icon="simple-icons:discord"
						width="24"
						height="24"
						className="group-hover/btn:rotate-12 transition-transform"
					/>
					<span className="text-lg">Sunucuya Katıl</span>
				</a>
			</div>
		);
	}

	return <Clicker onPop={playPop} />;
}

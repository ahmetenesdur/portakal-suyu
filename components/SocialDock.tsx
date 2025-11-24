import { Icon } from "@iconify/react";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function SocialDock() {
	return (
		<div className="flex items-center gap-2 md:gap-4 p-2 md:p-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg mt-8 transition-transform hover:scale-105">
			{SOCIAL_LINKS.map((social) => (
				<a
					key={social.name}
					href={social.url}
					target="_blank"
					rel="noopener noreferrer"
					className={`p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center ${social.color}`}
					title={social.name}
				>
					<Icon
						icon={social.icon}
						width="20"
						height="20"
						className="md:w-6 md:h-6"
					/>
				</a>
			))}
		</div>
	);
}

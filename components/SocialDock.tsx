import { Icon } from "@iconify/react";

import { SOCIAL_LINKS } from "@/constants/socials";

export default function SocialDock() {
	return (
		<div className="mt-8 flex items-center gap-2 rounded-full border border-white/30 bg-white/20 p-2 shadow-lg backdrop-blur-xl transition-transform hover:scale-105 md:gap-4 md:p-3">
			{SOCIAL_LINKS.map((social) => (
				<a
					key={social.name}
					href={social.url}
					target="_blank"
					rel="noopener noreferrer"
					className={`flex items-center justify-center rounded-full p-2 transition-all duration-300 hover:scale-110 md:p-3 ${social.color}`}
					title={social.name}
				>
					<Icon icon={social.icon} width="20" height="20" className="md:h-6 md:w-6" />
				</a>
			))}
		</div>
	);
}

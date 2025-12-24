export const GAME_CONFIG = {
	GOAL: 1000,
	ANIMATION: {
		SPILL_DURATION: 2500,
	},
};

export const SOCIAL_LINKS = [
	{
		name: "Instagram",
		icon: "simple-icons:instagram",
		url: "https://www.instagram.com/portakallsuyuu0",
		color: "text-[#E1306C] hover:bg-[#E1306C]/10",
	},
	{
		name: "Kick",
		icon: "simple-icons:kick",
		url: "https://kick.com/portakalsuyu0",
		color: "text-[#53FC18] hover:bg-[#53FC18]/10",
	},
	{
		name: "TikTok",
		icon: "simple-icons:tiktok",
		url: "https://www.tiktok.com/@portakallsuyuu0",
		color: "text-black hover:bg-black/5",
	},
	{
		name: "Discord",
		icon: "simple-icons:discord",
		url: "https://discord.gg/NdEfduN4nU",
		color: "text-[#5865F2] hover:bg-[#5865F2]/10",
	},
];

export const BUFF_ICONS: Record<string, string> = {
	"5": "lucide:coffee",
	"6": "lucide:zap",
	"7": "lucide:pill",
};

export const BUFF_THEMES: Record<string, { text: string; bg: string; border: string }> = {
	"5": {
		text: "text-amber-300",
		bg: "bg-amber-500/20",
		border: "border-amber-500/20",
	},
	"6": {
		text: "text-cyan-400",
		bg: "bg-cyan-500/20",
		border: "border-cyan-500/20",
	},
	"7": {
		text: "text-orange-500",
		bg: "bg-orange-500/20",
		border: "border-orange-500/20",
	},
};

export const BUFF_DURATIONS: Record<string, number> = {
	"5": 2 * 60 * 1000,
	"6": 3 * 60 * 1000,
	"7": 1 * 60 * 1000,
};

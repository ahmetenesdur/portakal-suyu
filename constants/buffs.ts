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

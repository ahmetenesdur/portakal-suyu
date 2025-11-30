import Clicker from "@/components/Clicker";
import { Profile } from "@/types";

interface GameAreaProps {
	profile: Profile | null;
	playPop: () => void;
	onShowLoginPrompt?: () => void;
}

export default function GameArea({
	playPop,
	onShowLoginPrompt,
}: GameAreaProps) {
	return <Clicker onPop={playPop} onShowLoginPrompt={onShowLoginPrompt} />;
}

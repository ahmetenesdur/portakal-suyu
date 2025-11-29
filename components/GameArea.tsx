import Clicker from "@/components/Clicker";
import { Profile } from "@/types";

interface GameAreaProps {
	profile: Profile | null;
	playPop: () => void;
}

export default function GameArea({ playPop }: GameAreaProps) {
	return <Clicker onPop={playPop} />;
}

import { motion } from "framer-motion";

import CoolFace from "./orange/faces/CoolFace";
import DeadFace from "./orange/faces/DeadFace";
import DefaultFace from "./orange/faces/DefaultFace";
import DizzyFace from "./orange/faces/DizzyFace";
import ExcitedFace from "./orange/faces/ExcitedFace";
import HappyFace from "./orange/faces/HappyFace";
import SurprisedFace from "./orange/faces/SurprisedFace";
import WinkFace from "./orange/faces/WinkFace";

interface OrangeCharacterProps {
	currentFace: number;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FACE_COMPONENTS: Record<number, React.ComponentType> = {
	0: DefaultFace,
	1: HappyFace,
	2: SurprisedFace,
	3: WinkFace,
	4: ExcitedFace,
	5: DeadFace,
	6: DizzyFace,
	7: CoolFace,
};

export default function OrangeCharacter({ currentFace, onClick }: OrangeCharacterProps) {
	const FaceComponent = FACE_COMPONENTS[currentFace] || DefaultFace;

	return (
		<div className="group relative">
			<div className="absolute inset-0 scale-110 rounded-full bg-orange-500/30 blur-3xl transition-transform duration-500 group-hover:scale-125" />

			<motion.button
				whileHover={{ scale: 1.05, rotate: 5 }}
				whileTap={{ scale: 0.9, rotate: -5 }}
				onClick={onClick}
				className="relative z-10 cursor-pointer outline-none select-none"
				style={{ touchAction: "manipulation" }}
			>
				<div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-full border-4 border-orange-300/50 bg-linear-to-br from-orange-400 via-orange-500 to-orange-700 shadow-[inset_-20px_-20px_60px_rgba(0,0,0,0.3),0_20px_40px_rgba(234,88,12,0.4)]">
					<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

					<div className="absolute top-8 left-12 h-12 w-24 -rotate-12 rounded-full bg-white/40 blur-md" />
					<div className="absolute right-12 bottom-12 h-8 w-16 -rotate-12 rounded-full bg-orange-900/20 blur-md" />

					<div className="relative z-20 mt-4 transition-all duration-200">
						<FaceComponent />
					</div>
				</div>

				<div className="absolute -top-8 left-1/2 z-0 h-16 w-16 origin-bottom-left -translate-x-1/2 -rotate-45 rounded-tr-[100%] rounded-bl-[100%] border-2 border-green-700/30 bg-linear-to-br from-green-400 to-green-600 shadow-lg" />
			</motion.button>
		</div>
	);
}

import { motion } from "framer-motion";
import DefaultFace from "./orange/faces/DefaultFace";
import HappyFace from "./orange/faces/HappyFace";
import SurprisedFace from "./orange/faces/SurprisedFace";
import WinkFace from "./orange/faces/WinkFace";
import ExcitedFace from "./orange/faces/ExcitedFace";
import DeadFace from "./orange/faces/DeadFace";
import DizzyFace from "./orange/faces/DizzyFace";
import CoolFace from "./orange/faces/CoolFace";

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

export default function OrangeCharacter({
	currentFace,
	onClick,
}: OrangeCharacterProps) {
	const FaceComponent = FACE_COMPONENTS[currentFace] || DefaultFace;

	return (
		<div className="relative group">
			<div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />

			<motion.button
				whileHover={{ scale: 1.05, rotate: 5 }}
				whileTap={{ scale: 0.9, rotate: -5 }}
				onClick={onClick}
				className="relative z-10 cursor-pointer outline-none select-none"
				style={{ touchAction: "manipulation" }}
			>
				<div className="w-72 h-72 rounded-full bg-linear-to-br from-orange-400 via-orange-500 to-orange-700 shadow-[inset_-20px_-20px_60px_rgba(0,0,0,0.3),0_20px_40px_rgba(234,88,12,0.4)] border-4 border-orange-300/50 flex items-center justify-center relative overflow-hidden">
					<div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

					<div className="absolute top-8 left-12 w-24 h-12 bg-white/40 rounded-full -rotate-12 blur-md" />
					<div className="absolute bottom-12 right-12 w-16 h-8 bg-orange-900/20 rounded-full -rotate-12 blur-md" />

					<div className="relative z-20 mt-4 transition-all duration-200">
						<FaceComponent />
					</div>
				</div>

				<div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-tr-[100%] rounded-bl-[100%] -rotate-45 border-2 border-green-700/30 z-0 origin-bottom-left shadow-lg" />
			</motion.button>
		</div>
	);
}

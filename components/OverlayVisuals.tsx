"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { GAME_CONFIG } from "@/lib/constants";

export const OrangeSliceSVG = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" r="48" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />
		<circle cx="50" cy="50" r="44" fill="#FFF7ED" />
		{[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
			<g key={angle} transform={`rotate(${angle} 50 50)`}>
				<path
					d="M50 44 L36 16 Q50 8 64 16 L50 44 Z"
					fill="#F97316"
					stroke="#FB923C"
					strokeWidth="0.5"
				/>
				<circle cx="50" cy="18" r="2" fill="#FDBA74" fillOpacity="0.8" />
				<circle cx="45" cy="22" r="1.5" fill="#FDBA74" fillOpacity="0.6" />
				<circle cx="55" cy="22" r="1.5" fill="#FDBA74" fillOpacity="0.6" />
				<circle cx="50" cy="26" r="1.5" fill="#FDBA74" fillOpacity="0.4" />
			</g>
		))}
		<circle cx="50" cy="50" r="3" fill="#FFF7ED" />
	</svg>
);

export const DropletSVG = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 2C12 2 18 8 18 14C18 17.3137 15.3137 20 12 20C8.68629 20 6 17.3137 6 14C6 8 12 2 12 2Z"
			fill="#F97316"
		/>
		<path
			d="M12 18C15 18 17 16 17 14C17 11 14 6 14 6"
			stroke="#C2410C"
			strokeWidth="0"
			fill="#C2410C"
			fillOpacity="0.2"
		/>
		<path
			d="M10 8C10 8 8.5 10 8.5 12.5"
			stroke="white"
			strokeWidth="1.5"
			strokeLinecap="round"
			opacity="0.9"
		/>
	</svg>
);

export const WaveSVG = () => (
	<svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
		<path
			fill="#F97316"
			fillOpacity="1"
			d="M0,160 C320,280 480,100 720,160 C960,220 1120,100 1440,160 V320 H0 Z"
		/>
	</svg>
);

export const SparkleSVG = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
			fill="currentColor"
		/>
	</svg>
);

export const FloatingParticles = ({
	count = GAME_CONFIG.PARTICLES.FLOATING_COUNT,
}: {
	count?: number;
}) => {
	const [particles, setParticles] = useState<
		{
			id: number;
			left: number;
			delay: number;
			duration: number;
			scale: number;
			rotation: number;
			isSlice: boolean;
		}[]
	>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setParticles(
				Array.from({ length: count }).map((_, i) => ({
					id: i,
					left: Math.random() * 100,
					delay: Math.random() * 2,
					duration: 2 + Math.random() * 3,
					scale: 0.5 + Math.random() * 1,
					rotation: Math.random() * 360,
					isSlice: Math.random() > 0.5,
				}))
			);
		}, 0);
		return () => clearTimeout(timer);
	}, [count]);

	return (
		<>
			{particles.map((p) => (
				<motion.div
					key={p.id}
					className="absolute bottom-0"
					style={{ left: `${p.left}%` }}
					initial={{ y: 100, opacity: 0, rotate: 0 }}
					animate={{
						y: -1000,
						opacity: [0, 1, 1, 0],
						rotate: p.rotation + 360,
					}}
					transition={{
						duration: p.duration,
						delay: p.delay,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					{p.isSlice ? (
						<OrangeSliceSVG className="h-12 w-12 opacity-80" />
					) : (
						<DropletSVG className="h-6 w-6 opacity-60" />
					)}
				</motion.div>
			))}
		</>
	);
};

export const SplashBurst = () => {
	const [particles, setParticles] = useState<
		{
			id: number;
			angle: number;
			distance: number;
			scale: number;
			rotation: number;
		}[]
	>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setParticles(
				Array.from({ length: GAME_CONFIG.PARTICLES.SPLASH_COUNT }).map((_, i) => ({
					id: i,
					angle: (i / GAME_CONFIG.PARTICLES.SPLASH_COUNT) * 360,
					distance: 150 + Math.random() * 250,
					scale: 0.5 + Math.random() * 1.5,
					rotation: Math.random() * 360,
				}))
			);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
			{particles.map((p) => (
				<motion.div
					key={p.id}
					className="absolute"
					initial={{
						x: 0,
						y: 0,
						scale: 0,
						opacity: 1,
						rotate: p.rotation,
					}}
					animate={{
						x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
						y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
						scale: p.scale,
						opacity: 0,
						rotate: p.rotation + 180,
					}}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<DropletSVG className="h-8 w-8 fill-current text-orange-500" />
				</motion.div>
			))}
		</div>
	);
};

export const GodRays = () => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(
			() => setIsVisible(false),
			GAME_CONFIG.ANIMATION.GOD_RAYS_DURATION
		);
		return () => clearTimeout(timer);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, rotate: 0 }}
			animate={{
				opacity: isVisible ? 0.4 : 0,
				rotate: 360,
			}}
			transition={{
				opacity: { duration: 2 },
				rotate: { duration: 20, ease: "linear", repeat: Infinity },
			}}
			className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
		>
			<div className="h-[200vw] w-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,white_15deg,transparent_30deg,white_45deg,transparent_60deg,white_75deg,transparent_90deg,white_105deg,transparent_120deg,white_135deg,transparent_150deg,white_165deg,transparent_180deg,white_195deg,transparent_210deg,white_225deg,transparent_240deg,white_255deg,transparent_270deg,white_285deg,transparent_300deg,white_315deg,transparent_330deg,white_345deg,transparent_360deg)] opacity-20 mix-blend-overlay" />
		</motion.div>
	);
};

export const Sparkles = () => {
	const [sparkles, setSparkles] = useState<
		{
			id: number;
			x: number;
			y: number;
			scale: number;
			delay: number;
			repeatDelay: number;
		}[]
	>([]);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSparkles(
				Array.from({ length: GAME_CONFIG.PARTICLES.SPARKLE_COUNT }).map((_, i) => ({
					id: i,
					x: Math.random() * 100,
					y: Math.random() * 100,
					scale: 0.5 + Math.random() * 0.5,
					delay: Math.random() * 1,
					repeatDelay: Math.random() * 2,
				}))
			);
		}, 0);

		const fadeTimer = setTimeout(
			() => setIsVisible(false),
			GAME_CONFIG.ANIMATION.SPARKLE_DURATION
		);

		return () => {
			clearTimeout(timer);
			clearTimeout(fadeTimer);
		};
	}, []);

	return (
		<motion.div
			className="pointer-events-none absolute inset-0 z-50"
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 2 }}
		>
			{sparkles.map((s) => (
				<motion.div
					key={s.id}
					className="absolute text-yellow-200"
					style={{ left: `${s.x}%`, top: `${s.y}%` }}
					initial={{ scale: 0, opacity: 0 }}
					animate={{
						scale: [0, s.scale, 0],
						opacity: [0, 1, 0],
						rotate: [0, 180],
					}}
					transition={{
						duration: 1.5,
						delay: s.delay,
						repeat: Infinity,
						repeatDelay: s.repeatDelay,
					}}
				>
					<SparkleSVG className="h-6 w-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
				</motion.div>
			))}
		</motion.div>
	);
};

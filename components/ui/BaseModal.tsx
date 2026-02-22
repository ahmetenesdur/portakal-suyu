"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { cn } from "@/lib/utils/styles";

interface BaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string; // For overriding max-w, etc.
}

export default function BaseModal({ isOpen, onClose, children, className }: BaseModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm md:p-6 md:pb-6"
						onClick={onClose}
					>
						{/* Modal Content */}
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className={cn(
								"relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/90 shadow-2xl backdrop-blur-xl",
								className
							)}
							onClick={(e) => e.stopPropagation()}
						>
							{children}
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

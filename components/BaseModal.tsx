"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface BaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string; // For overriding max-w, etc.
}

export default function BaseModal({
	isOpen,
	onClose,
	children,
	className,
}: BaseModalProps) {
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
						className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6"
						onClick={onClose}
					>
						{/* Modal Content */}
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className={cn(
								"relative w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col",
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

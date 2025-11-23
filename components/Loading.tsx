import { Icon } from "@iconify/react";

export default function Loading({
	size = "md",
	className = "",
}: {
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<Icon
				icon="lucide:loader-2"
				className={`animate-spin text-orange-500 ${sizeClasses[size]}`}
			/>
		</div>
	);
}

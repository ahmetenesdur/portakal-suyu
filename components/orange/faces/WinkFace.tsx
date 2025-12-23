export default function WinkFace() {
	return (
		<>
			<div className="flex items-center gap-10">
				<div className="mt-2 h-2 w-8 rounded-full bg-black/80" />
				<div className="h-10 w-6 rounded-full bg-black/80 shadow-sm" />
			</div>
			<div className="absolute top-12 left-1/2 h-4 w-10 -translate-x-1/2 rotate-6 rounded-b-full bg-black/60" />
		</>
	);
}

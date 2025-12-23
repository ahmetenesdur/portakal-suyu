export default function ExcitedFace() {
	return (
		<>
			<div className="flex items-center gap-10">
				<div className="text-4xl font-black text-black/80 select-none">&gt;</div>
				<div className="text-4xl font-black text-black/80 select-none">&lt;</div>
			</div>
			<div className="absolute top-12 left-1/2 h-8 w-12 -translate-x-1/2 rounded-b-full bg-black/60" />
		</>
	);
}

export default function DeadFace() {
	return (
		<>
			<div className="flex items-center gap-10">
				<div className="text-4xl font-black text-black/80 select-none">X</div>
				<div className="text-4xl font-black text-black/80 select-none">X</div>
			</div>
			<div className="absolute top-12 left-1/2 mt-2 h-2 w-10 -translate-x-1/2 rounded-full bg-black/80" />
		</>
	);
}

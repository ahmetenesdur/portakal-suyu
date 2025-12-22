export default function DeadFace() {
	return (
		<>
			<div className="flex gap-10 items-center">
				<div className="text-4xl font-black text-black/80 select-none">
					X
				</div>
				<div className="text-4xl font-black text-black/80 select-none">
					X
				</div>
			</div>
			<div className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/80 rounded-full mt-2" />
		</>
	);
}

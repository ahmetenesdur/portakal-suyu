export default function ExcitedFace() {
	return (
		<>
			<div className="flex gap-10 items-center">
				<div className="text-4xl font-black text-black/80 select-none">
					&gt;
				</div>
				<div className="text-4xl font-black text-black/80 select-none">
					&lt;
				</div>
			</div>
			<div className="absolute top-12 left-1/2 -translate-x-1/2 w-12 h-8 bg-black/60 rounded-b-full" />
		</>
	);
}

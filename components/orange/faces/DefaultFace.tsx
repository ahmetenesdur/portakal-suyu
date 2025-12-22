export default function DefaultFace() {
	return (
		<>
			<div className="flex gap-10">
				<div className="w-6 h-10 bg-black/80 rounded-full shadow-sm" />
				<div className="w-6 h-10 bg-black/80 rounded-full shadow-sm" />
			</div>
			<div className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-5 bg-black/60 rounded-b-full" />
		</>
	);
}

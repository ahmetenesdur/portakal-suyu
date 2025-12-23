export default function DefaultFace() {
	return (
		<>
			<div className="flex gap-10">
				<div className="h-10 w-6 rounded-full bg-black/80 shadow-sm" />
				<div className="h-10 w-6 rounded-full bg-black/80 shadow-sm" />
			</div>
			<div className="absolute top-12 left-1/2 h-5 w-10 -translate-x-1/2 rounded-b-full bg-black/60" />
		</>
	);
}

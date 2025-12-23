export default function SurprisedFace() {
	return (
		<>
			<div className="flex gap-10">
				<div className="h-8 w-8 rounded-full bg-black/80 shadow-sm" />
				<div className="h-8 w-8 rounded-full bg-black/80 shadow-sm" />
			</div>
			<div className="absolute top-12 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-black/60" />
		</>
	);
}

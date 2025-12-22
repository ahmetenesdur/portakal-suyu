export default function SurprisedFace() {
	return (
		<>
			<div className="flex gap-10">
				<div className="w-8 h-8 bg-black/80 rounded-full shadow-sm" />
				<div className="w-8 h-8 bg-black/80 rounded-full shadow-sm" />
			</div>
			<div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-6 bg-black/60 rounded-full" />
		</>
	);
}

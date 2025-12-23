export default function HappyFace() {
	return (
		<>
			<div className="flex items-center gap-10">
				<div className="mt-4 h-4 w-8 rounded-full border-t-4 border-black/80" />
				<div className="mt-4 h-4 w-8 rounded-full border-t-4 border-black/80" />
			</div>
			<div className="absolute top-10 left-1/2 h-6 w-12 -translate-x-1/2 rounded-b-full bg-black/60" />
		</>
	);
}

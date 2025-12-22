export default function HappyFace() {
	return (
		<>
			<div className="flex gap-10 items-center">
				<div className="w-8 h-4 border-t-4 border-black/80 rounded-full mt-4" />
				<div className="w-8 h-4 border-t-4 border-black/80 rounded-full mt-4" />
			</div>
			<div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-6 bg-black/60 rounded-b-full" />
		</>
	);
}

export default function WinkFace() {
	return (
		<>
			<div className="flex gap-10 items-center">
				<div className="w-8 h-2 bg-black/80 rounded-full mt-2" />
				<div className="w-6 h-10 bg-black/80 rounded-full shadow-sm" />
			</div>
			<div className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-4 bg-black/60 rounded-b-full rotate-6" />
		</>
	);
}

export default function DizzyFace() {
	return (
		<>
			<div className="flex gap-10 items-center">
				<div className="text-4xl font-black text-black/80 select-none">
					@
				</div>
				<div className="text-4xl font-black text-black/80 select-none">
					@
				</div>
			</div>
			<div className="absolute top-14 left-1/2 -translate-x-1/2 w-10 h-6 border-4 border-black/80 rounded-[50%] border-t-transparent animate-pulse" />
		</>
	);
}

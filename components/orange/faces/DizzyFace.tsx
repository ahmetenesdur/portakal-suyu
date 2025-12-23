export default function DizzyFace() {
	return (
		<>
			<div className="flex items-center gap-10">
				<div className="text-4xl font-black text-black/80 select-none">@</div>
				<div className="text-4xl font-black text-black/80 select-none">@</div>
			</div>
			<div className="absolute top-14 left-1/2 h-6 w-10 -translate-x-1/2 animate-pulse rounded-[50%] border-4 border-black/80 border-t-transparent" />
		</>
	);
}

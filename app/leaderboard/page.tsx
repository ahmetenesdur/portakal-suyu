import { getCachedLeaderboard } from "@/app/actions/leaderboard";
import LeaderboardClient from "@/components/LeaderboardClient";
import Navbar from "@/components/Navbar";

// Next.js 15+ searchParams is a Promise
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LeaderboardPage(props: { searchParams: SearchParams }) {
	const searchParams = await props.searchParams;
	const timeframeParam = searchParams.timeframe;

	// Validate timeframe
	const validTimeframes = ["all", "weekly", "daily"] as const;
	const timeframe = validTimeframes.includes(timeframeParam as "all" | "weekly" | "daily")
		? (timeframeParam as "all" | "weekly" | "daily")
		: "all";

	// Fetch initial data on server (SSR)
	// This makes the First Contentful Paint contain the full list
	const initialData = await getCachedLeaderboard(timeframe, 50);

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-orange-50 pb-16">
			<Navbar />

			<div className="pointer-events-none fixed inset-0">
				<div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-orange-300/20 blur-[120px]" />
				<div className="absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-yellow-300/20 blur-[120px]" />
			</div>

			<LeaderboardClient initialData={initialData} initialTimeframe={timeframe} />
		</main>
	);
}

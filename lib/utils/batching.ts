import { submitClicks } from "@/app/actions/game";

const BATCH_INTERVAL = 2000; // 2 seconds
const MAX_BATCH_SIZE = 50;

let clickQueue = 0;
let timer: NodeJS.Timeout | null = null;

export const addClick = (amount: number = 1) => {
	clickQueue += amount;

	if (clickQueue >= MAX_BATCH_SIZE) {
		flushClicks();
	} else if (!timer) {
		timer = setTimeout(flushClicks, BATCH_INTERVAL);
	}
};

const flushClicks = async () => {
	if (clickQueue === 0) return;

	const count = clickQueue;
	clickQueue = 0;
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}

	try {
		try {
			// Use Server Action instead of API route
			const result = await submitClicks(count);

			if (result.error) {
				console.error("Click sync failed:", result.error);
				// Retry on specific errors if needed, but for now we assume severe errors shouldn't be retried blindly
				// If it was a network error (exception), it goes to catch block.
				// If it is a logic error (e.g. rate limit), we probably shouldn't blindly retry immediately or we get banned.
				// But for resilience, if it's NOT a 400-type error (logic), we might retry.
				// Since we don't have status codes broadly, we'll rely on the fact that Server Actions throw on network issues.
				// For 'Batch size limit exceeded', we definitely shouldn't retry the same batch.
			}
		} catch (error) {
			console.error("Network error syncing clicks:", error);
			clickQueue += count; // Add back to queue on network failure
			if (!timer) timer = setTimeout(flushClicks, BATCH_INTERVAL * 2);
		}
	} catch (error) {
		console.error("Network error syncing clicks:", error);
		clickQueue += count; // Add back to queue on network failure
		if (!timer) timer = setTimeout(flushClicks, BATCH_INTERVAL * 2);
	}
};

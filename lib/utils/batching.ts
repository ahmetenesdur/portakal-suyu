import { submitClicks } from "@/app/actions/game";

const BATCH_INTERVAL = 2000; // 2 seconds
const MAX_BATCH_SIZE = 50;
const MAX_RETRIES = 3;
const MAX_RETRY_DELAY = 16000;

let clickQueue = 0;
let timer: NodeJS.Timeout | null = null;
let retryCount = 0;

const clearTimer = () => {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
};

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
	clearTimer();

	try {
		// Use Server Action instead of API route
		const result = await submitClicks(count);

		if (result.error) {
			console.error("Click sync failed:", result.error);
			// Logic error (e.g. rate limit, validation). Do not blindly retry.
			return;
		}

		// Success resets retry count
		retryCount = 0;
	} catch (error) {
		console.error("Network error syncing clicks:", error);
		clickQueue += count; // Add back to queue on network failure
		retryCount++;

		if (retryCount <= MAX_RETRIES) {
			const delay = Math.min(BATCH_INTERVAL * Math.pow(2, retryCount), MAX_RETRY_DELAY);
			timer = setTimeout(flushClicks, delay);
		} else {
			console.warn(
				`Click sync abandoned after ${MAX_RETRIES} retries. Lost ${clickQueue} clicks.`
			);
			clickQueue = 0;
			retryCount = 0;
		}
	}
};

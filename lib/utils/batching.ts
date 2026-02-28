import { ClickPayload, submitClicks } from "@/app/actions/game";

const BATCH_INTERVAL = 2000;
const MAX_BATCH_SIZE = 50;
const MAX_RETRIES = 3;
const MAX_RETRY_DELAY = 16000;

let clickQueue: ClickPayload[] = [];
let timer: NodeJS.Timeout | null = null;
let retryCount = 0;

const clearTimer = () => {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
};

export const addClick = (clickData: ClickPayload) => {
	clickQueue.push(clickData);

	if (clickQueue.length >= MAX_BATCH_SIZE) {
		flushClicks();
	} else if (!timer) {
		timer = setTimeout(flushClicks, BATCH_INTERVAL);
	}
};

const flushClicks = async () => {
	if (clickQueue.length === 0) return;

	// Enforce batch limit (Anti-Cheat Rate Limit)
	const batchSize = Math.min(clickQueue.length, MAX_BATCH_SIZE);
	const currentBatch = clickQueue.slice(0, batchSize);

	clickQueue = clickQueue.slice(batchSize);
	clearTimer();

	try {
		const result = await submitClicks(currentBatch);

		if (result.error) {
			console.error("Click sync failed:", result.error);
			return;
		}

		retryCount = 0;

		if (clickQueue.length > 0) {
			timer = setTimeout(flushClicks, Math.min(BATCH_INTERVAL, 500));
		}
	} catch (error) {
		console.error("Network error syncing clicks:", error);

		clickQueue = [...currentBatch, ...clickQueue];
		retryCount++;

		if (retryCount <= MAX_RETRIES) {
			const delay = Math.min(BATCH_INTERVAL * Math.pow(2, retryCount), MAX_RETRY_DELAY);
			timer = setTimeout(flushClicks, delay);
		} else {
			console.warn(
				`Click sync abandoned after ${MAX_RETRIES} retries. Dropping ${currentBatch.length} failed clicks.`
			);
			clickQueue = clickQueue.slice(currentBatch.length);
			retryCount = 0;

			if (clickQueue.length > 0) {
				timer = setTimeout(flushClicks, BATCH_INTERVAL);
			}
		}
	}
};

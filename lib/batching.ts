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
		const response = await fetch("/api/click", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ count }),
			keepalive: true,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error("Click sync failed:", response.status, errorData);
			// Retry logic: Add back to queue if it's a server error (5xx) or network error
			// We do NOT retry 4xx errors (client errors) as they will likely fail again
			if (response.status >= 500) {
				clickQueue += count; // Add back to queue
				// Exponential backoff or simple retry could be added here,
				// but adding back to queue ensures it gets picked up in next batch (or immediately if queue > max)
				if (!timer) timer = setTimeout(flushClicks, BATCH_INTERVAL * 2); // Slow down next retry
			}
			return;
		}
	} catch (error) {
		console.error("Network error syncing clicks:", error);
		clickQueue += count; // Add back to queue on network failure
		if (!timer) timer = setTimeout(flushClicks, BATCH_INTERVAL * 2);
	}
};

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
			// User requested console-only logging for errors
			console.error("Click sync failed:", response.status, errorData);
			return; // Don't retry if it's a validation error (400)
		}
	} catch (error) {
		console.error("Network error syncing clicks:", error);
		// Simple retry logic could go here, but for security rejections we shouldn't retry
	}
};

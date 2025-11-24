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
		await fetch("/api/click", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ count }),
			keepalive: true,
		});
	} catch (error) {
		console.error("Failed to sync clicks:", error);
		// Simple retry logic: put them back in queue (optional, keeping it simple for now)
	}
};

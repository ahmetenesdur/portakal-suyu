"use server";

import { createServerSupabase } from "@/lib/services/supabase/server";

export type ClickPayload = {
	x: number;
	y: number;
	isKeyboard: boolean;
	time?: number;
};

export async function submitClicks(payload: number | ClickPayload[]) {
	const count = typeof payload === "number" ? payload : payload.length;

	if (typeof count !== "number" || !Number.isInteger(count) || count <= 0) {
		return { error: "Invalid count format" };
	}

	if (count > 50) {
		console.warn(
			`[Anti-Cheat] Suspicious burst requested. Count (${count}) exceeded max batch limits.`
		);
		return { error: "Batch size limit exceeded" };
	}

	// Anti-Cheat v2 — 3-Rule Jury
	if (Array.isArray(payload)) {
		const mouseClicks = payload.filter((c) => !c.isKeyboard);

		let spatialStdDev: number | null = null;
		let deltaVariance: number | null = null;
		let cps: number | null = null;
		let cv: number | null = null;

		if (mouseClicks.length >= 10) {
			// Spatial Standard Deviation (informational)
			let sumX = 0;
			let sumY = 0;
			let sumX2 = 0;
			let sumY2 = 0;
			const n = mouseClicks.length;

			for (let i = 0; i < n; i++) {
				const c = mouseClicks[i];
				sumX += c.x;
				sumY += c.y;
				sumX2 += c.x * c.x;
				sumY2 += c.y * c.y;
			}

			const avgX = sumX / n;
			const avgY = sumY / n;

			// Var(X) = E[X^2] - (E[X])^2
			const varX = sumX2 / n - avgX * avgX;
			const varY = sumY2 / n - avgY * avgY;

			spatialStdDev = Math.sqrt(Math.max(0, varX) + Math.max(0, varY));

			// Temporal Analysis
			const clicksWithTime = mouseClicks.filter((c) => c.time !== undefined);

			if (clicksWithTime.length >= 10) {
				const times = clicksWithTime.map((c) => c.time as number).sort((a, b) => a - b);

				const deltas: number[] = [];
				let minDelta = Infinity;
				let maxDelta = -Infinity;

				for (let i = 1; i < times.length; i++) {
					const delta = times[i] - times[i - 1];
					deltas.push(delta);
					if (delta < minDelta) minDelta = delta;
					if (delta > maxDelta) maxDelta = delta;
				}

				deltaVariance = maxDelta - minDelta;

				// CPS (Clicks Per Second)
				const totalTimeSpan = times[times.length - 1] - times[0];
				cps = totalTimeSpan > 0 ? (times.length / totalTimeSpan) * 1000 : 0;

				// CV (Coefficient of Variation)
				const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
				const stdDevDelta = Math.sqrt(
					deltas.reduce((s, d) => s + (d - avgDelta) ** 2, 0) / deltas.length
				);
				cv = avgDelta > 0 ? stdDevDelta / avgDelta : 0;
			}
		}

		// Jury
		if (deltaVariance !== null) {
			let banReason: string | null = null;

			console.log(
				`[Anti-Cheat] mouse=${mouseClicks.length} σ=${spatialStdDev?.toFixed(1)} var=${deltaVariance}ms cps=${cps?.toFixed(1)} cv=${cv?.toFixed(3)}`
			);

			if (deltaVariance < 12) {
				banReason = "Zaman entropisi reddedildi (Robotik Ritim)";
				console.warn(`[Anti-Cheat] Blocked: robotic cadence. variance=${deltaVariance}ms`);
			}

			if (!banReason && cps !== null && cps > 22) {
				banReason = "Fizyolojik CPS limiti aşıldı (İnsan sınırı: ~22)";
				console.warn(`[Anti-Cheat] Blocked: superhuman CPS. cps=${cps.toFixed(1)}`);
			}

			if (!banReason && cv !== null && cv < 0.02) {
				banReason = "Ritim dağılımı insan dışı (Metronomik CV)";
				console.warn(`[Anti-Cheat] Blocked: metronomic CV. cv=${cv.toFixed(4)}`);
			}

			if (banReason) {
				return { error: `Otomatik tıklayıcı tespit edildi! ${banReason}` };
			}
		}
	}

	const supabase = await createServerSupabase();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Giriş yapmalısın" };
	}

	try {
		const { error } = await supabase.rpc("secure_increment_clicks", {
			p_count: count,
		});

		if (error) {
			console.error("RPC Error:", error);
			return { error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Click Submission Error:", error);
		return { error: "Failed to submit clicks" };
	}
}

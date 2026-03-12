import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClickPayload, submitClicks } from "@/app/actions/game";
import { createServerSupabase } from "@/lib/services/supabase/server";

vi.mock("@/lib/services/supabase/server", () => ({
	createServerSupabase: vi.fn(),
}));

/**
 * Helper to generate synthetic click payloads.
 * Supports configurable spatial, temporal, and CPS profiles.
 */
function mockPayload(
	length: number,
	options: {
		isKeyboard?: boolean;
		spatialVariance?: "stationary" | "tight-jitter" | "natural";
		temporalVariance?: "robotic" | "semi-macro" | "natural" | "none" | "os-repeat";
		cpsProfile?: "normal" | "superhuman";
	} = {}
): ClickPayload[] {
	const {
		isKeyboard = false,
		spatialVariance = "natural",
		temporalVariance = "natural",
		cpsProfile = "normal",
	} = options;

	return Array.from({ length }, (_, i) => {
		let x: number, y: number;
		if (spatialVariance === "stationary") {
			x = 500;
			y = 500;
		} else if (spatialVariance === "tight-jitter") {
			x = 500 + (i % 2 === 0 ? 1 : -1);
			y = 500 + (i % 3 === 0 ? 1 : 0);
		} else {
			x = 500 + i * 3;
			y = 500 + i * 2;
		}

		if (temporalVariance === "none") return { x, y, isKeyboard };

		let time = 1000;
		const baseInterval = cpsProfile === "superhuman" ? 20 : 100;

		if (temporalVariance === "robotic") {
			time += i * baseInterval;
		} else if (temporalVariance === "semi-macro") {
			time += Math.floor(i / 2) * 215 + (i % 2) * 100;
		} else if (temporalVariance === "natural") {
			time += i * baseInterval + (i % 3 === 0 ? 50 : 0);
		} else if (temporalVariance === "os-repeat") {
			time += i * 30;
		}

		return { x, y, isKeyboard, time };
	});
}

describe("Anti-Cheat Engine v2 (3-Rule Jury Matrix)", () => {
	let mockRpc: ReturnType<typeof vi.fn>;
	let mockGetUser: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockRpc = vi.fn().mockResolvedValue({ error: null });
		mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "test-user" } } });

		(createServerSupabase as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
			auth: { getUser: mockGetUser },
			rpc: mockRpc,
		});
	});

	describe("Hardware & Engine Exemptions", () => {
		it("should bypass all layers for small batches (<10 clicks)", async () => {
			const payload = mockPayload(5, {
				spatialVariance: "stationary",
				temporalVariance: "robotic",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
			expect(mockRpc).toHaveBeenCalledWith("secure_increment_clicks", { p_count: 5 });
		});

		it("should process primitive number payloads (legacy compatibility)", async () => {
			const result = await submitClicks(25);
			expect(result).toEqual({ success: true });
			expect(mockRpc).toHaveBeenCalledWith("secure_increment_clicks", { p_count: 25 });
		});

		it("should exempt keyboard OS auto-repeat from all mouse-based layers", async () => {
			const payload = mockPayload(20, {
				isKeyboard: true,
				spatialVariance: "stationary",
				temporalVariance: "os-repeat",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});

		it("should allow React event-loop lag spikes (grouped 0ms deltas)", async () => {
			const payload: ClickPayload[] = [
				{ x: 101, y: 101, isKeyboard: false, time: 1000 },
				{ x: 102, y: 103, isKeyboard: false, time: 1100 },
				{ x: 101, y: 101, isKeyboard: false, time: 2000 },
				{ x: 105, y: 106, isKeyboard: false, time: 2000 },
				{ x: 101, y: 101, isKeyboard: false, time: 2000 },
				{ x: 105, y: 106, isKeyboard: false, time: 2000 },
				{ x: 101, y: 101, isKeyboard: false, time: 2125 },
				{ x: 102, y: 103, isKeyboard: false, time: 2240 },
				{ x: 101, y: 101, isKeyboard: false, time: 2325 },
				{ x: 102, y: 103, isKeyboard: false, time: 2440 },
			];
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});
	});

	describe("Spatial Clustering (Informational Only)", () => {
		it("should NOT ban tight-jitter clusters with semi-macro rhythm (spatial is informational only)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "tight-jitter",
				temporalVariance: "semi-macro",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});

		it("should pass natural coordinate distributions (σ > 3px)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "natural",
				temporalVariance: "natural",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});
	});

	describe("Rule 1: Delta Variance (Cadence Rhythm)", () => {
		it("should block robotic metronome clicks (<12ms variance)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "natural",
				temporalVariance: "robotic",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({
				error: "Otomatik tıklayıcı tespit edildi! Zaman entropisi reddedildi (Robotik Ritim)",
			});
			expect(mockRpc).not.toHaveBeenCalled();
		});

		it("should pass human physiological arrhythmia (>20ms variance)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "natural",
				temporalVariance: "natural",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});
	});

	describe("Rule 2: CPS (Clicks Per Second) Limiter", () => {
		it("should block superhuman click speed (>22 CPS)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "natural",
				temporalVariance: "natural",
				cpsProfile: "superhuman",
			});
			const result = await submitClicks(payload);
			expect(result).toHaveProperty("error");
			expect(result.error).toContain("CPS");
			expect(mockRpc).not.toHaveBeenCalled();
		});

		it("should allow fast but human jitter clicking (~10 CPS)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "natural",
				temporalVariance: "natural",
				cpsProfile: "normal",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});
	});

	describe("Rule 3: CV (Coefficient of Variation)", () => {
		it("should block perfect metronomic distribution (CV < 0.02)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "natural",
				temporalVariance: "robotic",
			});
			const result = await submitClicks(payload);
			expect(result).toHaveProperty("error");
			expect(mockRpc).not.toHaveBeenCalled();
		});

		it("should pass natural human distribution (CV 0.15-0.45)", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "natural",
				temporalVariance: "natural",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});
	});

	describe("Combined Jury (Cross-Rule Deductions)", () => {
		it("should block a macro failing multiple rules simultaneously", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "stationary",
				temporalVariance: "robotic",
			});
			const result = await submitClicks(payload);
			expect(result).toHaveProperty("error");
			expect(mockRpc).not.toHaveBeenCalled();
		});

		it("should protect honest stationary mouse users with natural rhythm", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "stationary",
				temporalVariance: "natural",
			});
			const result = await submitClicks(payload);
			expect(result).toEqual({ success: true });
		});

		it("should block a full attack: stationary + robotic", async () => {
			const payload = mockPayload(15, {
				spatialVariance: "stationary",
				temporalVariance: "robotic",
			});
			const result = await submitClicks(payload);
			expect(result).toHaveProperty("error");
			expect(mockRpc).not.toHaveBeenCalled();
		});
	});

	describe("Error Handling Paths", () => {
		it("should return error when user is not authenticated", async () => {
			mockGetUser.mockResolvedValueOnce({ data: { user: null } });
			const result = await submitClicks(5);
			expect(result).toEqual({ error: "Giriş yapmalısın" });
			expect(mockRpc).not.toHaveBeenCalled();
		});

		it("should handle supabase.rpc returning an error", async () => {
			const errorMessage = "Database error occurred";
			mockRpc.mockResolvedValueOnce({ error: { message: errorMessage } });
			const result = await submitClicks(5);
			expect(result).toEqual({ error: errorMessage });
		});

		it("should handle supabase.rpc throwing an exception", async () => {
			mockRpc.mockRejectedValueOnce(new Error("Network failure"));
			const result = await submitClicks(5);
			expect(result).toEqual({ error: "Failed to submit clicks" });
		});
	});
});

"use server";

import { createServerSupabase } from "@/lib/services/supabase/server";

export async function submitClicks(count: number) {
	// Security: Strict validation to prevent score manipulation
	if (typeof count !== "number" || !Number.isInteger(count)) {
		return { error: "Invalid count format" };
	}

	if (count <= 0) {
		return { error: "Count must be positive" };
	}

	// Rate Limit / Batch Size Cap (MAX_BATCH_SIZE is 50 in frontend)
	if (count > 50) {
		console.warn(`Suspicious activity detected: Request with ${count} clicks rejected.`);
		return { error: "Batch size limit exceeded" };
	}

	const supabase = await createServerSupabase();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Unauthorized" };
	}

	try {
		// Use RPC for secure atomic increment
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

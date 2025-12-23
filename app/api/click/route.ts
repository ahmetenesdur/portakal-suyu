import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { count } = await request.json();

	// Security: Strict validation to prevent score manipulation
	if (typeof count !== "number" || !Number.isInteger(count)) {
		return NextResponse.json({ error: "Invalid count format" }, { status: 400 });
	}

	if (count <= 0) {
		return NextResponse.json({ error: "Count must be positive" }, { status: 400 });
	}

	// Rate Limit / Batch Size Cap (MAX_BATCH_SIZE is 50 in frontend)
	if (count > 50) {
		console.warn(`Suspicious activity detected: Request with ${count} clicks rejected.`);
		return NextResponse.json({ error: "Batch size limit exceeded" }, { status: 400 });
	}

	const cookieStore = await cookies();
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// Ignored
					}
				},
			},
		}
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { error } = await supabase.rpc("secure_increment_clicks", {
		p_count: count,
	});

	if (error) {
		console.error("RPC Error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}

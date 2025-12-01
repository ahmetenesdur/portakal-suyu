import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getTurkeyDateString, getTurkeyWeekStart } from "@/lib/utils";

export async function POST(request: Request) {
	const { count } = await request.json();

	if (!count || count <= 0) {
		return NextResponse.json({ error: "Invalid count" }, { status: 400 });
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

	// Call the RPC function we created in schema.sql
	const { error } = await supabase.rpc("increment_clicks", {
		click_count: count,
		milestone_step: 100, // Hardcoded for now, should match GAME_CONFIG.GOAL
		user_info: {
			username:
				user.user_metadata.full_name ||
				user.email?.split("@")[0] ||
				"Anonymous",
			avatar_url: user.user_metadata.avatar_url || "",
			id: user.id,
		},
		current_date_str: getTurkeyDateString(),
		current_week_str: getTurkeyWeekStart(),
	});

	if (error) {
		console.error("RPC Error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}

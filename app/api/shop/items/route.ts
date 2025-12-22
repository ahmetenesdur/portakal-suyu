import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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

	try {
		const { data: items, error } = await supabase
			.from("shop_items")
			.select("*")
			.eq("is_active", true)
			.order("price", { ascending: true });

		if (error) throw error;

		// Fetch user inventory if logged in to mark owned items
		const {
			data: { user },
		} = await supabase.auth.getUser();

		let inventoryIds: number[] = [];

		if (user) {
			const { data: inventory } = await supabase
				.from("user_inventory")
				.select("item_id")
				.eq("user_id", user.id);

			if (inventory) {
				inventoryIds = inventory.map((i) => i.item_id);
			}
		}

		const itemsWithOwnership = items.map((item) => ({
			...item,
			is_owned: inventoryIds.includes(item.id),
			is_locked:
				item.required_item_id &&
				!inventoryIds.includes(item.required_item_id),
		}));

		return NextResponse.json(itemsWithOwnership);
	} catch (error) {
		console.error("Shop Fetch Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch shop items" },
			{ status: 500 }
		);
	}
}

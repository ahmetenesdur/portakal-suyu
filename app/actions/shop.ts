"use server";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { cookies } from "next/headers";

import { ShopItem } from "@/types/game";

// Cached Action for fetching items
export async function getShopItems() {
	"use cache";
	cacheLife("minutes");
	cacheTag("shop-items");

	// Use a stateless client for fetching public shop items
	// This avoids "Accessing Dynamic data sources inside a cache scope" error
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const { data: items, error } = await supabase
		.from("shop_items")
		.select("*")
		.eq("is_active", true)
		.order("price", { ascending: true });

	if (error) {
		console.error("Shop Fetch Error:", error);
		throw new Error("Failed to fetch shop items");
	}

	return items as ShopItem[];
}

// Action for checking ownership (not cached or private cached per user)
export async function getUserInventory() {
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

	if (!user) return [];

	const { data: inventory } = await supabase
		.from("user_inventory")
		.select("item_id")
		.eq("user_id", user.id);

	return inventory ? inventory.map((i) => i.item_id) : [];
}

// Purchase Action
export async function purchaseItem(itemId: number) {
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
		return { error: "Lütfen önce giriş yapın." };
	}

	try {
		// Revalidate shop items to ensure ownership status is fresh if needed
		// Ideally we only need to revalidate the user's view, but global items don't change often.
		// We will assume the client will refresh the inventory list.

		const { data, error } = await supabase.rpc("secure_purchase_item", {
			p_item_id: itemId,
		});

		if (error) {
			console.error("RPC Error:", error);
			return { error: error.message || "İşlem sırasında bir hata oluştu." };
		}

		if (data) {
			if (data.success) {
				// Revalidate the user's specific paths or tags if we had them
				// revalidateTag(`user-inventory-${user.id}`); // Ideal if we used it
				return {
					success: true,
					newScore: data.new_score,
					message: data.message,
				};
			} else {
				// Handle logical errors
				let errorMessage = "Satın alma başarısız";
				if (data.error === "Insufficient balance") {
					errorMessage = "Yetersiz Portakal Suyu";
				} else if (data.error === "Item already owned") {
					errorMessage = "Bu eşyaya zaten sahipsiniz";
				} else if (data.error) {
					errorMessage = data.error;
				}

				return { error: errorMessage };
			}
		} else {
			return { error: "Satın alma başarısız oldu." };
		}
	} catch (error) {
		console.error("Purchase Error:", error);
		return { error: "Beklenmedik bir hata oluştu." };
	}
}

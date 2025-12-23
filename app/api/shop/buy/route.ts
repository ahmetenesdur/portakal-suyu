import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { itemId } = await request.json();

	if (!itemId) {
		return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
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

	try {
		const { data } = await supabase.rpc("secure_purchase_item", {
			p_item_id: itemId,
		});

		if (data) {
			if (data.success) {
				return NextResponse.json({
					success: true,
					newScore: data.new_score,
					message: data.message,
				});
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

				return NextResponse.json({ error: errorMessage }, { status: 400 });
			}
		} else {
			return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
		}
	} catch (error) {
		console.error("Purchase Error:", error);
		return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
	}
}

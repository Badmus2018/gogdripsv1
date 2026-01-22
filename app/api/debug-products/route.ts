import { NextResponse } from "next/server";
import getProducts from "@/actions/get-products";

export async function GET() {
  try {
    const products = await getProducts({ category: null });
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json({ error: e?.toString?.() || "Unknown error" }, { status: 500 });
  }
}

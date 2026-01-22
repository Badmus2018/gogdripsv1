import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";
import getRevenueGraphData, { TimeRange } from "@/actions/get-revenue-graph-data";

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "7days") as TimeRange;

    const data = await getRevenueGraphData(range);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 });
  }
}

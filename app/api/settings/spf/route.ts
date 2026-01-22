import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";

import prismadb from "@/libs/prismadb";


export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { spf } = body;

  if (spf === undefined || spf < 0) {
    return NextResponse.json({ error: "Invalid SPF value" }, { status: 400 });
  }


  try {
    // There should only be one settings row, so upsert by id
    const settings = await prismadb.settings.upsert({
      where: { id: "settings" },
      update: { spf: spf },
      create: {
        id: "settings",
        bankName: "",
        bankAccountNumber: "",
        accountHolderName: "",
        spf: spf,
      },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Update SPF error:", error);
    return NextResponse.json({ error: "Failed to update SPF" }, { status: 500 });
  }
}
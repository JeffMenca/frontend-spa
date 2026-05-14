import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

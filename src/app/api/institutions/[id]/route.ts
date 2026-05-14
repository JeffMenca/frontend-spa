import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

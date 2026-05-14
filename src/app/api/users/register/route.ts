import { NextRequest, NextResponse } from "next/server";
import { registerParticipant } from "@/lib/api/iam";
import { RegisterRequestSchema } from "@/lib/validators/auth";
import { ApplicationError } from "@/types/error";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = RegisterRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          code: "validation.failed",
          status: 400,
          title: "Validation Failed",
          detail: parsed.error.message,
        },
        { status: 400 },
      );
    }

    const user = await registerParticipant(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { code: error.code, status: error.status, title: "Error", detail: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { code: "system.internal_error", status: 500, title: "Internal Server Error", detail: "Unexpected error." },
      { status: 500 },
    );
  }
}

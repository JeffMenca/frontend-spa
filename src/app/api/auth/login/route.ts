import { NextRequest, NextResponse } from "next/server";
import { loginUser, getMe } from "@/lib/api/iam";
import { setAuthCookies } from "@/lib/auth/cookies";
import { LoginRequestSchema } from "@/lib/validators/auth";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ApplicationError } from "@/types/error";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = LoginRequestSchema.safeParse(body);

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

    const tokens = await loginUser(parsed.data);
    const profile = await getMe(tokens.accessToken);

    await setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        {
          code: error.code,
          status: error.status,
          title: "Error",
          detail: error.message,
        },
        { status: error.status },
      );
    }

    const parsed = ProblemDetailSchema.safeParse(error);
    if (parsed.success) {
      return NextResponse.json(parsed.data, { status: parsed.data.status });
    }

    return NextResponse.json(
      {
        code: "system.internal_error",
        status: 500,
        title: "Internal Server Error",
        detail: "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}

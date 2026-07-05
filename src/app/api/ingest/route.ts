import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runIngestion } from "@/lib/engine/pipeline";
import { hasOpenAIKey } from "@/lib/engine/synthesize";

export const maxDuration = 120;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";

  const authHeader = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-cron-secret");

  return authHeader === `Bearer ${secret}` || cronHeader === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const maxArticles =
      typeof body.maxArticles === "number" ? body.maxArticles : undefined;

    const result = await runIngestion({ maxArticles });

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/recherche");
    revalidatePath("/tags");

    return NextResponse.json({
      success: true,
      aiEnabled: hasOpenAIKey(),
      ...result,
    });
  } catch (error) {
    console.error("[API Ingest]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur ingestion",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { applySavedArticlesLimit } from "@/lib/saved-articles/limit";
import { savedArticlesPayloadSchema } from "@/lib/saved-articles/schema";
import { EMPTY_SAVED_ARTICLES } from "@/lib/saved-articles/types";
import { readUserJson, writeUserJson } from "@/lib/storage/user-json";

const SAVED_ARTICLES_FILENAME = "saved-articles.json";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const data = await readUserJson(
    userId,
    SAVED_ARTICLES_FILENAME,
    EMPTY_SAVED_ARTICLES
  );

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const parsed = savedArticlesPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const existing = await readUserJson(
    userId,
    SAVED_ARTICLES_FILENAME,
    EMPTY_SAVED_ARTICLES
  );
  const incomingUpdatedAt = parsed.data.updatedAt ?? "";

  if (
    existing.updatedAt &&
    incomingUpdatedAt &&
    existing.updatedAt > incomingUpdatedAt
  ) {
    return NextResponse.json(existing);
  }

  const saved = {
    articles: applySavedArticlesLimit(parsed.data.articles),
    updatedAt: new Date().toISOString(),
  };

  await writeUserJson(userId, SAVED_ARTICLES_FILENAME, saved);

  return NextResponse.json(saved);
}

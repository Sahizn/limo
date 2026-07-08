import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { EMPTY_FAVORITES } from "@/lib/favorites/types";
import { readUserJson, writeUserJson } from "@/lib/storage/user-json";

const FAVORITES_FILENAME = "favorites.json";

const favoritesSchema = z.object({
  categories: z.array(z.string()),
  favoritesOnly: z.boolean(),
  updatedAt: z.string().optional(),
});

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const data = await readUserJson(userId, FAVORITES_FILENAME, EMPTY_FAVORITES);

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

  const parsed = favoritesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const existing = await readUserJson(userId, FAVORITES_FILENAME, EMPTY_FAVORITES);
  const incomingUpdatedAt = parsed.data.updatedAt ?? "";

  if (
    existing.updatedAt &&
    incomingUpdatedAt &&
    existing.updatedAt > incomingUpdatedAt
  ) {
    return NextResponse.json(existing);
  }

  const saved = {
    categories: parsed.data.categories,
    favoritesOnly: parsed.data.favoritesOnly,
    updatedAt: new Date().toISOString(),
  };

  await writeUserJson(userId, FAVORITES_FILENAME, saved);

  return NextResponse.json(saved);
}

import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

const USER_BLOB_PREFIX = "limo/users/";

function shouldUseBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function userDataDir(userId: string): string {
  return path.join(process.cwd(), "data", "users", userId);
}

async function readFromBlob<T>(pathname: string): Promise<T | null> {
  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function writeToBlob<T>(pathname: string, data: T): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readUserJson<T>(
  userId: string,
  filename: string,
  fallback: T
): Promise<T> {
  if (shouldUseBlobStorage()) {
    const blobData = await readFromBlob<T>(`${USER_BLOB_PREFIX}${userId}/${filename}`);
    if (blobData !== null) return blobData;
  }

  const filePath = path.join(userDataDir(userId), filename);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeUserJson<T>(
  userId: string,
  filename: string,
  data: T
): Promise<void> {
  if (shouldUseBlobStorage()) {
    await writeToBlob(`${USER_BLOB_PREFIX}${userId}/${filename}`, data);
    return;
  }

  const dir = userDataDir(userId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, filename),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

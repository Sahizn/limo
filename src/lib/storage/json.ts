import { promises as fs } from "fs";
import path from "path";
import { put, head } from "@vercel/blob";

const DATA_DIR = path.join(process.cwd(), "data", "store");
const BLOB_PREFIX = "limo/store/";

function shouldUseBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readFromBlob<T>(filename: string): Promise<T | null> {
  try {
    const blob = await head(`${BLOB_PREFIX}${filename}`);
    const response = await fetch(blob.url);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function writeToBlob<T>(filename: string, data: T): Promise<void> {
  await put(`${BLOB_PREFIX}${filename}`, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  if (shouldUseBlobStorage()) {
    const blobData = await readFromBlob<T>(filename);
    if (blobData !== null) return blobData;
  }

  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  if (shouldUseBlobStorage()) {
    await writeToBlob(filename, data);
    return;
  }

  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getDataDir() {
  return DATA_DIR;
}

export function isBlobStorageEnabled() {
  return shouldUseBlobStorage();
}

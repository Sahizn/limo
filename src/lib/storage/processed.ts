import { readJsonFile, writeJsonFile } from "@/lib/storage/json";

const FILE = "processed-urls.json";

export async function getProcessedUrls(): Promise<Set<string>> {
  const urls = await readJsonFile<string[]>(FILE, []);
  return new Set(urls);
}

export async function markUrlProcessed(url: string): Promise<void> {
  const urls = await readJsonFile<string[]>(FILE, []);
  if (!urls.includes(url)) {
    urls.push(url);
    await writeJsonFile(FILE, urls.slice(-5000));
  }
}

export async function markUrlsProcessed(urls: string[]): Promise<void> {
  const existing = await readJsonFile<string[]>(FILE, []);
  const merged = [...new Set([...existing, ...urls])];
  await writeJsonFile(FILE, merged.slice(-5000));
}

import { normalizeText } from "@/lib/engine/normalize";
import type { TagType } from "@/lib/types/tag";

const BLOCKLIST = new Set([
  "actuellement",
  "le tour",
  "france des",
  "le monde",
  "la france",
  "les echos",
  "france info",
  "ouest france",
  "orient la",
  "ere etape",
  "emes economiques",
  "eratures elevees",
  "es actuellement",
  "esident subianto",
]);

const STOP_WORDS = new Set([
  "des",
  "les",
  "le",
  "la",
  "de",
  "du",
  "en",
  "et",
  "ou",
  "un",
  "une",
  "sur",
  "pour",
  "avec",
  "dans",
  "par",
  "au",
  "aux",
]);

export function isPlausibleEntity(
  name: string,
  type?: TagType | string
): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return false;

  if (!/^[A-ZÀ-Ÿ0-9"«]/.test(trimmed)) return false;

  const normalized = normalizeText(trimmed);
  if (BLOCKLIST.has(normalized)) return false;

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;

  if (words.length >= 2) {
    if (STOP_WORDS.has(normalizeText(words[0]))) return false;
    if (STOP_WORDS.has(normalizeText(words[words.length - 1]))) return false;
  }

  if (type === "personne" && words.length >= 2) {
    for (const word of words) {
      if (word.length < 2) return false;
      if (!/^[A-ZÀ-Ÿ0-9]/.test(word)) return false;
    }
  }

  if (/^[^A-ZÀ-Ÿ0-9]{2,}/.test(words[0])) return false;

  return true;
}

import type { RssFeedItem } from "@/lib/rss/types";

export interface IngestResult {
  fetched: number;
  processed: number;
  published: number;
  skipped: number;
  errors: string[];
  articles: string[];
}

export interface SynthesisInput {
  items: RssFeedItem[];
  defaultCategorySlug: string;
}

export interface SynthesisOutput {
  title: string;
  summary: string[];
  categorySlug: string;
  isBreaking: boolean;
  entities: Array<{ name: string; type: string }>;
}

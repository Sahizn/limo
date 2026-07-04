import Parser from "rss-parser";
import { rssFeeds } from "@/lib/rss/feeds";
import type { RssFeedConfig, RssFeedItem } from "@/lib/rss/types";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Limo/1.0 (French news aggregator; +https://limo.news)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDate(item: Parser.Item): string {
  const raw = item.isoDate || item.pubDate;
  if (!raw) return new Date().toISOString();
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export async function fetchFeed(
  feed: RssFeedConfig,
  limit = 10
): Promise<RssFeedItem[]> {
  try {
    const parsed = await parser.parseURL(feed.url);

    return (parsed.items ?? [])
      .slice(0, limit)
      .filter((item) => item.title && item.link)
      .map((item) => ({
        id: `${feed.id}-${item.link}`,
        title: stripHtml(item.title ?? ""),
        link: item.link ?? "",
        description: stripHtml(item.contentSnippet || item.content || item.summary || ""),
        publishedAt: parseDate(item),
        sourceName: feed.name,
        defaultCategorySlug: feed.defaultCategorySlug,
      }));
  } catch (error) {
    console.error(`[RSS] Erreur flux ${feed.name}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(limitPerFeed = 8): Promise<RssFeedItem[]> {
  const results = await Promise.all(
    rssFeeds.map((feed) => fetchFeed(feed, limitPerFeed))
  );

  const allItems = results.flat();

  return allItems.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

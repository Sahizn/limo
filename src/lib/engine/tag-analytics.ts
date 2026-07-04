import type { Tag, TagType } from "@/lib/types/tag";
import type { Article } from "@/lib/types/article";
import { getAllArticles } from "@/lib/storage/articles";
import { getAllTags, saveTags } from "@/lib/storage/tags";

const TRENDING_WINDOW_DAYS = 30;

export interface TagWithStats extends Tag {
  recentCount: number;
  totalArticles: number;
}

export function countTagUsage(
  articles: Article[],
  since?: Date
): Map<string, { total: number; recent: number; lastUsedAt: string }> {
  const stats = new Map<string, { total: number; recent: number; lastUsedAt: string }>();

  for (const article of articles) {
    const published = new Date(article.publishedAt);
    const isRecent = since ? published >= since : true;

    for (const slug of article.tagSlugs) {
      const current = stats.get(slug) ?? {
        total: 0,
        recent: 0,
        lastUsedAt: article.publishedAt,
      };
      current.total += 1;
      if (isRecent) current.recent += 1;
      if (published > new Date(current.lastUsedAt)) {
        current.lastUsedAt = article.publishedAt;
      }
      stats.set(slug, current);
    }
  }

  return stats;
}

export async function syncTagStats(): Promise<void> {
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);
  const since = new Date();
  since.setDate(since.getDate() - TRENDING_WINDOW_DAYS);

  const allUsage = countTagUsage(articles);

  let changed = false;

  for (const tag of tags) {
    const stats = allUsage.get(tag.slug);
    if (stats) {
      tag.popularity = stats.total;
      tag.lastUsedAt = stats.lastUsedAt;
      changed = true;
    }
  }

  if (changed) await saveTags(tags);
}

export async function getTrendingTagsWithStats(
  limit = 8
): Promise<TagWithStats[]> {
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);
  const since = new Date();
  since.setDate(since.getDate() - TRENDING_WINDOW_DAYS);
  const usage = countTagUsage(articles, since);
  const allUsage = countTagUsage(articles);

  return tags
    .map((tag) => ({
      ...tag,
      recentCount: usage.get(tag.slug)?.recent ?? 0,
      totalArticles: allUsage.get(tag.slug)?.total ?? 0,
    }))
    .filter((t) => t.recentCount > 0 || t.totalArticles > 0)
    .sort((a, b) => {
      if (b.recentCount !== a.recentCount) return b.recentCount - a.recentCount;
      return b.popularity - a.popularity;
    })
    .slice(0, limit);
}

export async function getRelatedTags(
  tagSlug: string,
  limit = 6
): Promise<Tag[]> {
  const articles = await getAllArticles();
  const tags = await getAllTags();
  const tagMap = new Map(tags.map((t) => [t.slug, t]));

  const cooccurrence = new Map<string, number>();

  for (const article of articles) {
    if (!article.tagSlugs.includes(tagSlug)) continue;
    for (const other of article.tagSlugs) {
      if (other === tagSlug) continue;
      cooccurrence.set(other, (cooccurrence.get(other) ?? 0) + 1);
    }
  }

  return [...cooccurrence.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => tagMap.get(slug))
    .filter((t): t is Tag => Boolean(t));
}

export async function getTagsByType(type: TagType): Promise<Tag[]> {
  const tags = await getAllTags();
  return tags
    .filter((t) => t.type === type)
    .sort((a, b) => b.popularity - a.popularity);
}

export async function getTagArticleCount(tagSlug: string): Promise<number> {
  const articles = await getAllArticles();
  return articles.filter((a) => a.tagSlugs.includes(tagSlug)).length;
}

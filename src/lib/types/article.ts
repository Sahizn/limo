export interface ArticleSource {
  name: string;
  url: string;
}

export interface Article {
  slug: string;
  title: string;
  summary: string[];
  categorySlug: string;
  tagSlugs: string[];
  sources: ArticleSource[];
  publishedAt: string;
  isBreaking?: boolean;
  sourceUrls?: string[];
}

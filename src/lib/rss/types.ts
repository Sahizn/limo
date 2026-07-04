export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  defaultCategorySlug: string;
}

export interface RssFeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  publishedAt: string;
  sourceName: string;
  defaultCategorySlug: string;
}

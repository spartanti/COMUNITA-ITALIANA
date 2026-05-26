import { useState, useEffect } from "react";
import { siteData } from "@/data/siteData";

export type UnifiedPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  categories: string[];
  date: string;
  imageUrl?: string;
  source: "db" | "static";
};

function normalize(p: {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
}): UnifiedPost {
  return {
    id: `db-${p.id}`,
    slug: p.slug,
    title: p.title,
    content: p.content,
    excerpt: p.excerpt,
    categories: [p.category],
    date: p.createdAt,
    imageUrl: p.imageUrl || undefined,
    source: "db",
  };
}

export function usePosts() {
  const [dbPosts, setDbPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?published=true")
      .then((r) => r.json())
      .then((data: Parameters<typeof normalize>[0][]) => {
        setDbPosts(data.map(normalize));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const staticPosts: UnifiedPost[] = siteData.posts.map((p) => ({
    ...p,
    id: String(p.id),
    imageUrl: undefined,
    source: "static" as const,
  }));

  // DB posts first (newest), then static posts — skip static slug if DB already has it
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const merged = [
    ...dbPosts,
    ...staticPosts.filter((p) => !dbSlugs.has(p.slug)),
  ];

  const allCategories = Array.from(
    new Set(merged.flatMap((p) => p.categories))
  ).sort();

  return { posts: merged, allCategories, loading };
}

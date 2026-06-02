import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { api, type CustomPage as CustomPageType } from "@/lib/api";

export default function CustomPage() {
  const params = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true);
    setNotFound(false);
    api.customPages.get(params.slug)
      .then(setPage)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="h-48 bg-gray-100 animate-pulse" />
        <div className="container mx-auto px-4 py-16 max-w-4xl space-y-4">
          <div className="h-6 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
        </div>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
          <p className="text-gray-500">Página não encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PageHeader title={page.title} />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary prose-img:rounded-2xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}

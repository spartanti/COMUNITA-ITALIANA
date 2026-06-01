import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteData } from "@/data/siteData";

export default function Estatuto() {
  const { t } = useLanguage();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/page:estatuto")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.value) setContent(d.value); })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title={t.pageHeaders.statute} />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary prose-img:rounded-2xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: content ?? siteData.estatuto }}
        />
      </div>
    </div>
  );
}

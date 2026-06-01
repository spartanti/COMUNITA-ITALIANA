import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteData } from "@/data/siteData";

export default function Historia() {
  const { t } = useLanguage();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/page:historia")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.value) setContent(d.value); })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white">
      <PageHeader title={t.pageHeaders.history} />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary prose-img:rounded-2xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: content ?? siteData.historia }}
        />
      </div>
    </div>
  );
}

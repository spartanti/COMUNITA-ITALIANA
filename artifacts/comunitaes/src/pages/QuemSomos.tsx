import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, Globe, Award, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteData } from "@/data/siteData";

const highlights = [
  { icon: Users, title: "Comunidade Unida", desc: "Federação de associações italianas de todo o Espírito Santo, unindo descendentes em torno da cultura e tradição." },
  { icon: Heart, title: "Amor à Raiz", desc: "Compromisso com a memória, identidade e herança dos imigrantes que chegaram ao ES a partir de 1874." },
  { icon: Globe, title: "Vínculo com a Itália", desc: "Articulação com instituições e consulados italianos para fortalecer os laços entre as comunidades." },
  { icon: Award, title: "Reconhecimento", desc: "Atuação reconhecida pelo governo estadual e federal na valorização da cultura ítalo-capixaba." },
];

export default function QuemSomos() {
  const { t } = useLanguage();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/page:quemsomos")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.value) setContent(d.value); })
      .catch(() => {});
  }, []);

  const html = content ?? siteData.quemSomos;

  return (
    <div className="bg-white">
      <PageHeader title={t.pageHeaders.about} />

      {/* Highlights */}
      <section className="py-14 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-primary font-serif mb-2">{h.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{h.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main content from admin/siteData */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary prose-img:rounded-2xl prose-img:shadow-lg prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/historia" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                Nossa História <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/associar-se" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors">
                Associe-se <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

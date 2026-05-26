import { useRoute, Link } from "wouter";
import { siteData } from "@/data/siteData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function PostDetail() {
  const [, params] = useRoute("/noticias/:slug");
  const post = siteData.posts.find(p => p.slug === params?.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-primary mb-4">Notícia não encontrada</h1>
        <Link href="/noticias" className="text-secondary hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para notícias
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/noticias" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Notícias
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map(cat => (
                <span key={cat} className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3 mr-1" /> {cat}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-500 text-sm font-medium">
              <Calendar className="w-5 h-5 mr-2 text-accent" />
              {format(new Date(post.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
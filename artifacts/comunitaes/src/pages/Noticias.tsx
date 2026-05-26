import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";

const ITEMS_PER_PAGE = 9;

export default function Noticias() {
  const { posts, allCategories, loading } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredPosts = activeCategory
    ? posts.filter(post => post.categories.includes(activeCategory))
    : posts;

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://comunitaes.org.br/wp-content/uploads/2020/12/Buenos_Aires_Guarapari_2019.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Notícias</h1>
            <div className="w-20 h-1.5 bg-accent rounded-full"></div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-12 flex flex-wrap gap-2 justify-center">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => { setActiveCategory(null); setCurrentPage(1); }}
                className={activeCategory === null ? "bg-primary text-white" : "bg-white"}
              >
                Todas
              </Button>
              {allCategories.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={activeCategory === cat ? "bg-primary text-white" : "bg-white"}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {post.categories.map(cat => (
                        <span key={cat} className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      <Link href={`/noticias/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(post.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </div>
                      <Link href={`/noticias/${post.slug}`} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 p-0 ${currentPage === i + 1 ? "bg-primary text-white" : "bg-white"}`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

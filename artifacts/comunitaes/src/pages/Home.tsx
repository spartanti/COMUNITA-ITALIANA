import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, Building2, Newspaper, BookOpen, ChevronRight, Calendar } from "lucide-react";
import { siteData } from "@/data/siteData";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Comunidade Italiana",
    description: "Unindo descendentes e associações italianas em todo o Espírito Santo.",
    icon: Users,
    href: "/quem-somos",
  },
  {
    title: "História",
    description: "Preservando a memória da imigração desde 1874 no Brasil.",
    icon: BookOpen,
    href: "/historia",
  },
  {
    title: "Institucional",
    description: "Conheça nossa diretoria, estatuto e portal da transparência.",
    icon: Building2,
    href: "/transparencia",
  },
  {
    title: "Notícias",
    description: "Acompanhe os eventos, conquistas e novidades da cultura italiana.",
    icon: Newspaper,
    href: "/noticias",
  },
];

export default function Home() {
  const recentPosts = siteData.posts.slice(0, 6);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://comunitaes.org.br/wp-content/uploads/2020/12/Buenos_Aires_Guarapari_2019.jpg')" }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 drop-shadow-lg">
              Comunità Italiana do Espírito Santo
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-10 font-light drop-shadow-md">
              Preservando nossa história, fortalecendo nossas raízes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-8 py-6 rounded-full border-none shadow-xl">
                <Link href="/quem-somos">Conheça a Associação</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-6 rounded-full">
                <Link href="/contato">Associe-se</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white relative z-20 -mt-16 mx-4 md:mx-auto md:max-w-7xl rounded-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link href={feature.href} className="group block h-full p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-accent/30 transition-all duration-300">
                    <div className="w-14 h-14 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-3 text-primary group-hover:text-accent transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center text-sm font-semibold text-primary group-hover:text-accent transition-colors mt-auto">
                      Saiba mais <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-6 relative inline-block">
                O Berço da Imigração Italiana no Brasil
                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-accent rounded-full"></span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mt-10">
                A Associação Federativa Comunità Italiana do Espírito Santo foi fundada com o propósito de unir, representar e fortalecer a presença italiana em nosso estado. Atuamos como um elo entre o passado glorioso dos nossos nonnos e o futuro das novas gerações de ítalo-capixabas.
              </p>
              <Button asChild variant="link" className="mt-8 text-primary hover:text-accent font-semibold text-lg">
                <Link href="/historia">Ler mais sobre nossa história <ChevronRight className="w-5 h-5 ml-1" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-serif text-primary relative inline-block">
                Últimas Notícias
                <span className="absolute -bottom-2 left-0 w-16 h-1.5 bg-accent rounded-full"></span>
              </h2>
            </div>
            <Link href="/noticias" className="hidden md:flex items-center text-primary font-semibold hover:text-accent transition-colors">
              Ver todas <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {post.categories.map(cat => (
                      <span key={cat} className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
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
          
          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/noticias">Ver todas as notícias</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
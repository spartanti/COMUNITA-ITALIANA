import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, Building2, Newspaper, BookOpen, ChevronRight, Calendar, ArrowDown } from "lucide-react";
import { siteData } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api, type Banner } from "@/lib/api";

const DEFAULT_BANNER = {
  title: "Comunità Italiana do Espírito Santo",
  subtitle: "Preservando nossa história, fortalecendo nossas raízes e unindo gerações de ítalo-capixabas.",
  imageUrl: "https://comunitaes.org.br/wp-content/uploads/2020/12/Buenos_Aires_Guarapari_2019.jpg",
  ctaPrimaryText: "Conheça a Associação",
  ctaPrimaryUrl: "/quem-somos",
  ctaSecondaryText: "Associe-se",
  ctaSecondaryUrl: "/associar-se",
};

const features = [
  {
    title: "Comunidade",
    description: "Unindo descendentes e associações italianas em todo o Espírito Santo.",
    icon: Users,
    href: "/quem-somos",
  },
  {
    title: "História",
    description: "Preservando a memória da imigração italiana desde 1874 no Brasil.",
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
    description: "Acompanhe eventos, conquistas e novidades da cultura italiana.",
    icon: Newspaper,
    href: "/noticias",
  },
];

const stats = [
  { value: "150+", label: "Anos de imigração" },
  { value: "20+", label: "Municípios capixabas" },
  { value: "1M+", label: "Descendentes no ES" },
  { value: "1874", label: "Primeiro desembarque" },
];

// Reusable scroll-reveal wrapper
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}) {
  const initial = {
    opacity: 0,
    y: direction === "up" ? 24 : 0,
    x: direction === "left" ? -24 : direction === "right" ? 24 : 0,
  };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const recentPosts = siteData.posts.slice(0, 6);
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    api.banners.active()
      .then((b) => { if (b) setBanner(b); })
      .catch(() => {});
  }, []);

  const hero = banner ?? DEFAULT_BANNER;

  return (
    <div className="w-full">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      {/* Negative margin cancels the Layout pt so the hero is flush with the navbar */}
      <section className="relative flex items-center justify-center overflow-hidden -mt-[91px] md:-mt-[99px]"
        style={{ minHeight: "100svh" }}
      >
        {/* Background image with subtle scale */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${hero.imageUrl}')` }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/65 to-primary/85" />

        {/* Italian flag bottom strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#009246]" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-[#CE2B37]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-28 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto"
          >
            {/* Decorative tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Associação Federativa — ES, Brasil
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 drop-shadow-lg leading-tight"
            >
              {hero.title}
            </motion.h1>

            {hero.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg md:text-xl text-white/85 mb-10 font-light drop-shadow-md max-w-2xl mx-auto leading-relaxed"
              >
                {hero.subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold text-base px-8 py-6 rounded-full border-none shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-200">
                <Link href={hero.ctaPrimaryUrl}>{hero.ctaPrimaryText}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white hover:text-primary font-bold text-base px-8 py-6 rounded-full transition-all duration-200">
                <Link href={hero.ctaSecondaryUrl}>{hero.ctaSecondaryText}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator — arrow only, no text */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Features Cards ──────────────────────────────────────── */}
      <section className="bg-white py-0">
        <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-gray-100">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={index * 0.08}>
                  <Link href={feature.href} className="group flex flex-col items-center text-center p-4 md:p-6 rounded-xl hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold font-serif mb-2 text-primary group-hover:text-accent transition-colors">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed hidden md:block">{feature.description}</p>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ───────────────────────────────────────── */}
      <section className="py-16 bg-primary relative overflow-hidden">
        {/* Background decorative */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1} direction="up">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold font-serif text-accent mb-2">{stat.value}</div>
                  <div className="text-white/70 text-sm md:text-base font-medium">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Intro Section ───────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #1E2D44 0, #1E2D44 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <span className="inline-block text-accent font-semibold text-sm tracking-widest uppercase mb-4">Nossa Missão</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-primary mb-4 leading-tight">
                O Berço da Imigração
                <br />
                <span className="text-accent">Italiana no Brasil</span>
              </h2>
              <div className="w-16 h-1.5 bg-accent rounded-full mx-auto mb-8" />
              <p className="text-lg text-gray-700 leading-relaxed">
                A Associação Federativa Comunità Italiana do Espírito Santo foi fundada com o propósito de unir, representar e fortalecer a presença italiana em nosso estado. Atuamos como um elo entre o passado glorioso dos nossos <em>nonnos</em> e o futuro das novas gerações de ítalo-capixabas.
              </p>
              <Button asChild variant="link" className="mt-8 text-primary hover:text-accent font-semibold text-base group">
                <Link href="/historia">
                  Ler mais sobre nossa história
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Latest News ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <FadeIn direction="left">
              <span className="text-accent font-semibold text-sm tracking-widest uppercase block mb-2">Fique por dentro</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary relative">
                Últimas Notícias
                <span className="absolute -bottom-2 left-0 w-16 h-1.5 bg-accent rounded-full" />
              </h2>
            </FadeIn>
            <FadeIn direction="right">
              <Link href="/noticias" className="hidden md:flex items-center gap-1 text-primary font-semibold hover:text-accent transition-colors group text-sm">
                Ver todas as notícias
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recentPosts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.08}>
                <Link href={`/noticias/${post.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                  {/* Card accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-accent to-primary group-hover:from-primary group-hover:to-accent transition-all duration-500" />

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {post.categories.map(cat => (
                        <span key={cat} className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-gray-500 mb-6 line-clamp-3 flex-grow text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {format(new Date(post.date), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                      </div>
                      <span className="text-xs font-semibold text-accent group-hover:underline">
                        Ler mais →
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/noticias">Ver todas as notícias</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary/95 to-accent/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)" }} />

        <div className="container mx-auto px-4 text-center relative">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
              Faça parte da nossa comunidade
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Associe-se e ajude a preservar a herança italiana no Espírito Santo para as próximas gerações.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-6 rounded-full shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <Link href="/associar-se">Quero me associar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white/60 text-white hover:bg-white/10 font-bold px-8 py-6 rounded-full transition-all duration-200">
                <Link href="/contato">Fale conosco</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

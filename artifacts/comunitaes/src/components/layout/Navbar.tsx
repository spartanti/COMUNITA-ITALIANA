import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { api, type CustomPage } from "@/lib/api";

const FLAG: Record<Lang, string> = { pt: "🇧🇷", it: "🇮🇹" };
const OTHER: Record<Lang, Lang> = { pt: "it", it: "pt" };
const LANG_LABEL: Record<Lang, string> = { pt: "PT", it: "IT" };

type NavItem = { name: string; href: string; dropdown?: { name: string; href: string }[] };

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { lang, setLang, t } = useLanguage();
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  useEffect(() => {
    api.customPages.list().then(setCustomPages).catch(() => {});
  }, []);

  const topCustom = customPages.filter(p => p.menuSection === "top");
  const institucionalCustom = customPages.filter(p => p.menuSection === "institucional");

  const navLinks: NavItem[] = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/quem-somos" },
    {
      name: t.nav.institutional,
      href: "/transparencia",
      dropdown: [
        { name: t.nav.transparency, href: "/transparencia" },
        { name: t.nav.board, href: "/diretoria" },
        { name: t.nav.statute, href: "/estatuto" },
        ...institucionalCustom.map(p => ({ name: p.menuLabel || p.title, href: `/${p.slug}` })),
      ],
    },
    ...topCustom.map(p => ({ name: p.menuLabel || p.title, href: `/${p.slug}` })),
    { name: t.nav.news, href: "/noticias" },
    { name: t.nav.contact, href: "/contato" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-shadow duration-300",
      "bg-[#f7f8fa] border-b border-gray-200/80",
      isScrolled ? "shadow-md" : "shadow-sm"
    )}>
      {/* Italian flag strip */}
      <div className="h-[6px] w-full flex">
        <div className="flex-1 bg-[#009246]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#CE2B37]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="https://comunitaes.org.br/wp-content/uploads/2020/08/cropped-Logo_Comunita%CC%80_01_fundo_claro.png"
              alt="ComunitaES Logo"
              className="h-11 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://comunitaes.org.br/wp-content/uploads/2020/08/cropped-Logo_Comunita%CC%80_01_fundo_escuro.png";
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div key={link.href + link.name} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 flex items-center gap-1 relative",
                    location === link.href && "text-primary"
                  )}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />}
                  <span className={cn(
                    "absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-accent rounded-full transition-transform duration-200 origin-left",
                    location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>

                {link.dropdown && (
                  <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2 px-1">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.href}
                          href={dropLink.href}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors mx-1"
                        >
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Language switcher */}
            <button
              onClick={() => setLang(OTHER[lang])}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors"
            >
              <span className="text-base">{FLAG[OTHER[lang]]}</span>
              <span className="text-xs">{LANG_LABEL[OTHER[lang]]}</span>
            </button>

            {/* CTA Button */}
            <Link
              href="/associar-se"
              className="ml-2 px-5 py-2.5 bg-accent text-white text-sm font-bold rounded-full hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              {t.nav.join}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLang(OTHER[lang])}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700"
            >
              <span>{FLAG[OTHER[lang]]}</span>
              <span>{LANG_LABEL[OTHER[lang]]}</span>
            </button>

            <button
              className="text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#f7f8fa] border-t border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col py-4 px-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href + link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-3 px-4 text-base font-semibold text-gray-700 hover:bg-white hover:text-primary rounded-xl transition-colors",
                      location === link.href && "text-primary bg-white"
                    )}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-4 mt-1 space-y-0.5">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.href}
                          href={dropLink.href}
                          className="block py-2 px-4 text-sm text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-colors"
                        >
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.2 }}
                className="pt-2"
              >
                <Link
                  href="/associar-se"
                  className="block w-full text-center py-3 px-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
                >
                  {t.nav.join}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Quem Somos", href: "/quem-somos" },
  {
    name: "Institucional",
    href: "/transparencia",
    dropdown: [
      { name: "Transparência", href: "/transparencia" },
      { name: "Diretoria", href: "/diretoria" },
      { name: "Estatuto", href: "/estatuto" },
    ],
  },
  { name: "Notícias", href: "/noticias" },
  { name: "Contato", href: "/contato" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 py-2"
          : "bg-white shadow-md border-b border-gray-100 py-3"
      )}
    >
      {/* Italian flag strip */}
      <div className="h-[3px] w-full flex absolute top-0 left-0">
        <div className="flex-1 bg-[#009246]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#CE2B37]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.img
              src="https://comunitaes.org.br/wp-content/uploads/2020/08/cropped-Logo_Comunita%CC%80_01_fundo_claro.png"
              alt="ComunitaES Logo"
              className={cn("transition-all duration-300 object-contain", isScrolled ? "h-9" : "h-12")}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://comunitaes.org.br/wp-content/uploads/2020/08/cropped-Logo_Comunita%CC%80_01_fundo_escuro.png";
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 flex items-center gap-1 relative",
                    location === link.href && "text-accent"
                  )}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />}
                  {/* Underline indicator */}
                  <span className={cn(
                    "absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full transition-transform duration-200 origin-left",
                    location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>

                {link.dropdown && (
                  <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                    <div className="py-2 px-1">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.name}
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

            {/* CTA Button */}
            <Link
              href="/associar-se"
              className="ml-3 px-5 py-2.5 bg-accent text-white text-sm font-bold rounded-full hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Associe-se
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-primary p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col py-4 px-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-3 px-4 text-base font-semibold text-primary hover:bg-gray-50 hover:text-accent rounded-xl transition-colors",
                      location === link.href && "text-accent bg-accent/5"
                    )}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-4 mt-1 space-y-0.5">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.name}
                          href={dropLink.href}
                          className="block py-2 px-4 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
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
                  Associe-se
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

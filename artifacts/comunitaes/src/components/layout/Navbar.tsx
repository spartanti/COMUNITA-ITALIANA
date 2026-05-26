import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "QUEM SOMOS", href: "/quem-somos" },
    {
      name: "TRANSPARÊNCIA",
      href: "/transparencia",
      dropdown: [
        { name: "Diretoria", href: "/diretoria" },
        { name: "Estatuto", href: "/estatuto" },
      ],
    },
    { name: "NOTÍCIAS", href: "/noticias" },
    { name: "CONTATO", href: "/contato" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 bg-primary shadow-lg",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="https://comunitaes.org.br/wp-content/uploads/2020/08/cropped-Logo_Comunita%CC%80_01_fundo_escuro.png"
              alt="ComunitaES Logo"
              className={cn("transition-all duration-300", isScrolled ? "h-12" : "h-16")}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold text-white uppercase tracking-wider hover:text-accent transition-colors flex items-center gap-1",
                    location === link.href && "text-accent"
                  )}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

                {link.dropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.name}
                          href={dropLink.href}
                          className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-primary transition-colors"
                        >
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="md:hidden bg-primary border-t border-primary-foreground/10"
          >
            <div className="flex flex-col py-4 px-4 space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => !link.dropdown && setIsOpen(false)}
                    className={cn(
                      "block py-3 px-4 text-base font-semibold text-white uppercase tracking-wider hover:bg-white/10 rounded-md",
                      location === link.href && "text-accent bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-6 mt-1 space-y-1">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.name}
                          href={dropLink.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 px-4 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md"
                        >
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
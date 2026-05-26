import { Link } from "wouter";
import { Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & About */}
          <div>
            <img
              src="https://comunitaes.org.br/wp-content/uploads/2020/08/cropped-Logo_Comunita%CC%80_01_fundo_escuro.png"
              alt="ComunitaES Logo"
              className="h-16 mb-6"
            />
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              A Associação Federativa Comunità Italiana do Espírito Santo atua na preservação e promoção da cultura, história e tradições italianas no estado, que é o berço da imigração italiana no Brasil.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 relative inline-block">
              Acesso Rápido
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/quem-somos" className="text-gray-300 hover:text-accent transition-colors inline-block">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/historia" className="text-gray-300 hover:text-accent transition-colors inline-block">
                  História da Imigração
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-gray-300 hover:text-accent transition-colors inline-block">
                  Notícias e Eventos
                </Link>
              </li>
              <li>
                <Link href="/transparencia" className="text-gray-300 hover:text-accent transition-colors inline-block">
                  Transparência
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-accent transition-colors inline-block">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 relative inline-block">
              Contato
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                <span>Vitória, Espírito Santo - Brasil</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+55 (27) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:contato@comunitaes.org.br" className="hover:text-accent transition-colors">
                  contato@comunitaes.org.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ComunitaES - Associação Federativa Comunità Italiana do Espírito Santo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
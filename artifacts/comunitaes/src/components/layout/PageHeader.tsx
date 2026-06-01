import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  imageUrl?: string;
}

const DEFAULT_BG = "https://comunitaes.org.br/wp-content/uploads/2020/12/Buenos_Aires_Guarapari_2019.jpg";

export function PageHeader({ title, subtitle, children, imageUrl = DEFAULT_BG }: PageHeaderProps) {
  return (
    <div className="bg-primary py-16 md:py-20 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
      {/* Italian flag bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] flex">
        <div className="flex-1 bg-[#009246]" />
        <div className="flex-1 bg-white/60" />
        <div className="flex-1 bg-[#CE2B37]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-3 leading-tight drop-shadow-lg">
            {title}
          </h1>
          <div className="w-16 h-1.5 bg-accent rounded-full mb-4" />
          {subtitle && (
            <p className="text-white/75 text-base md:text-lg max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </div>
  );
}

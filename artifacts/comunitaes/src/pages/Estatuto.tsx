import { siteData } from "@/data/siteData";
import { motion } from "framer-motion";

export default function Estatuto() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://comunitaes.org.br/wp-content/uploads/2020/12/Buenos_Aires_Guarapari_2019.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Estatuto</h1>
            <div className="w-20 h-1.5 bg-accent rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-strong:text-primary"
          dangerouslySetInnerHTML={{ __html: siteData.estatuto }}
        />
      </div>
    </div>
  );
}
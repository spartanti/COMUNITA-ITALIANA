import { siteData } from "@/data/siteData";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";

export default function Transparencia() {
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
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Transparência</h1>
            <div className="w-20 h-1.5 bg-accent rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: siteData.transparencia }}
            />
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-primary p-8 rounded-2xl text-white sticky top-32"
            >
              <h3 className="font-serif font-bold text-2xl mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-accent" /> Documentos
              </h3>
              
              <ul className="space-y-4">
                <li>
                  <a href="#" className="group flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white hover:text-primary transition-all duration-300">
                    <span className="font-medium">Estatuto Social</span>
                    <Download className="w-5 h-5 text-accent group-hover:text-primary" />
                  </a>
                </li>
                <li>
                  <a href="#" className="group flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white hover:text-primary transition-all duration-300">
                    <span className="font-medium">Ata de Eleição</span>
                    <Download className="w-5 h-5 text-accent group-hover:text-primary" />
                  </a>
                </li>
                <li>
                  <a href="#" className="group flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white hover:text-primary transition-all duration-300">
                    <span className="font-medium">Balancete Anual</span>
                    <Download className="w-5 h-5 text-accent group-hover:text-primary" />
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
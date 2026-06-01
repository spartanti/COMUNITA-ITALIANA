import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Contato() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada com sucesso",
      description: "Agradecemos o contato. Retornaremos em breve.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title={t.pageHeaders.contact} />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold font-serif text-primary mb-6">Fale Conosco</h2>
            <p className="text-gray-600 mb-10 text-lg">
              Tem alguma dúvida, sugestão ou deseja se associar? Entre em contato conosco através do formulário ou de nossos canais de atendimento.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-4 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Endereço</h3>
                  <p className="text-gray-600">Vitória, Espírito Santo<br/>Brasil</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-4 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Telefone</h3>
                  <p className="text-gray-600">+55 (27) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-4 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">E-mail</h3>
                  <p className="text-gray-600">contato@comunitaes.org.br</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold font-serif text-primary mb-6">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" required placeholder="Seu nome" className="bg-gray-50 border-gray-200" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required placeholder="seu@email.com" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" required placeholder="Assunto da mensagem" className="bg-gray-50 border-gray-200" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea id="message" required placeholder="Escreva sua mensagem aqui..." className="min-h-[150px] bg-gray-50 border-gray-200" />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg">
                Enviar Mensagem <Send className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
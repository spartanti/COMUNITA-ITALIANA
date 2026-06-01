import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, CreditCard, MapPin, Phone, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

function formatWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

type AddressFields = {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
};

const EMPTY = { logradouro: "", bairro: "", cidade: "", estado: "" };

export default function AssociarSe() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    cpf: "",
    cep: "",
    numero: "",
    complemento: "",
    whatsapp: "",
    email: "",
  });
  const [address, setAddress] = useState<AddressFields>(EMPTY);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const complementoRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (field === "cpf") v = formatCpf(v);
    if (field === "whatsapp") v = formatWhatsapp(v);
    if (field === "cep") {
      v = formatCep(v);
      setCepError("");
      if (v.replace(/\D/g, "").length === 8) fetchCep(v.replace(/\D/g, ""));
    }
    setForm((p) => ({ ...p, [field]: v }));
  };

  const fetchCep = async (cep: string) => {
    setCepLoading(true);
    setCepError("");
    setAddress(EMPTY);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) { setCepError("CEP não encontrado"); return; }
      setAddress({
        logradouro: data.logradouro ?? "",
        bairro: data.bairro ?? "",
        cidade: data.localidade ?? "",
        estado: data.uf ?? "",
      });
      setTimeout(() => complementoRef.current?.focus(), 100);
    } catch {
      setCepError("Erro ao buscar CEP. Verifique sua conexão.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfDigits = form.cpf.replace(/\D/g, "");
    if (cpfDigits.length !== 11) {
      toast({ title: "CPF inválido", description: "Digite os 11 dígitos do CPF.", variant: "destructive" });
      return;
    }
    if (form.cep.replace(/\D/g, "").length !== 8 || !address.cidade) {
      toast({ title: "CEP inválido", description: "Informe um CEP válido para preencher o endereço.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/associates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeCompleto: form.nomeCompleto,
          dataNascimento: form.dataNascimento,
          cpf: form.cpf,
          cep: form.cep,
          logradouro: address.logradouro,
          numero: form.numero,
          bairro: address.bairro,
          cidade: address.cidade,
          estado: address.estado,
          complemento: form.complemento,
          whatsapp: form.whatsapp,
          email: form.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao cadastrar");
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Erro ao enviar", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-12 shadow-xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-primary mb-3">Cadastro realizado!</h2>
          <p className="text-gray-600 mb-2">
            Bem-vindo(a) à família da <strong>Comunità Italiana do Espírito Santo</strong>!
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Em breve nossa equipe entrará em contato pelo WhatsApp ou e-mail informado para concluir sua associação.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 w-full">
            <a href="/">Voltar ao início</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title={t.pageHeaders.join} subtitle={t.join.subtitle} />

      {/* Form */}
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Dados Pessoais */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-bold text-primary text-lg font-serif">Dados Pessoais</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={form.nomeCompleto}
                onChange={set("nomeCompleto")}
                placeholder="Seu nome completo"
                required
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={form.dataNascimento}
                onChange={(e) => setForm((p) => ({ ...p, dataNascimento: e.target.value }))}
                required
                max={new Date().toISOString().split("T")[0]}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" /> CPF *
              </Label>
              <Input
                id="cpf"
                value={form.cpf}
                onChange={set("cpf")}
                placeholder="000.000.000-00"
                required
                inputMode="numeric"
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-bold text-primary text-lg font-serif">Endereço</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <div className="relative">
                <Input
                  id="cep"
                  value={form.cep}
                  onChange={set("cep")}
                  placeholder="00000-000"
                  required
                  inputMode="numeric"
                  className={`bg-gray-50 pr-10 ${cepError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                />
                {cepLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                )}
                {!cepLoading && address.cidade && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {cepError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {cepError}
                </p>
              )}
              {!cepError && (
                <p className="text-xs text-gray-400">Digite o CEP para preencher o endereço automaticamente.</p>
              )}
            </div>

            {address.cidade && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-xs text-gray-500">Logradouro</Label>
                    <Input value={address.logradouro} readOnly className="bg-gray-100 text-gray-600 cursor-default" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="numero" className="text-xs text-gray-500">Número *</Label>
                    <Input
                      id="numero"
                      value={form.numero}
                      onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))}
                      placeholder="Ex: 123"
                      required
                      inputMode="numeric"
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-xs text-gray-500">Bairro</Label>
                    <Input value={address.bairro} readOnly className="bg-gray-100 text-gray-600 cursor-default" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Estado</Label>
                    <Input value={address.estado} readOnly className="bg-gray-100 text-gray-600 cursor-default" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Cidade</Label>
                  <Input value={address.cidade} readOnly className="bg-gray-100 text-gray-600 cursor-default" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento <span className="text-gray-400 font-normal">(apto, bloco...)</span></Label>
                  <Input
                    id="complemento"
                    ref={complementoRef}
                    value={form.complemento}
                    onChange={(e) => setForm((p) => ({ ...p, complemento: e.target.value }))}
                    placeholder="Apartamento, bloco, número..."
                    className="bg-gray-50"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Contato */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-bold text-primary text-lg font-serif">Contato</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> WhatsApp *
              </Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={set("whatsapp")}
                placeholder="(27) 99999-9999"
                required
                inputMode="tel"
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="seu@email.com"
                required
                className="bg-gray-50"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-6 text-lg rounded-xl shadow-lg"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</>
            ) : (
              "Enviar Cadastro"
            )}
          </Button>

          <p className="text-center text-xs text-gray-400">
            Seus dados são protegidos e utilizados apenas para fins associativos.
          </p>
        </motion.form>
      </div>
    </div>
  );
}

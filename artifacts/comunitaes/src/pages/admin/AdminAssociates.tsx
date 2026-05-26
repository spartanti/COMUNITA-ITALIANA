import { useEffect, useState } from "react";
import { Trash2, Search, Download, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Associate = {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
  whatsapp: string;
  email: string;
  createdAt: string;
};

function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatWhatsapp(w: string): string {
  return w.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export default function AdminAssociates() {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Associate | null>(null);
  const { toast } = useToast();

  const load = () => {
    const token = localStorage.getItem("admin_token") ?? "";
    fetch("/api/associates", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setAssociates)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (a: Associate) => {
    if (!confirm(`Remover ${a.nomeCompleto} da lista?`)) return;
    const token = localStorage.getItem("admin_token") ?? "";
    try {
      await fetch(`/api/associates/${a.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast({ title: "Associado removido" });
      setSelected(null);
      load();
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const exportCsv = () => {
    const header = "Nome,Data Nascimento,CPF,E-mail,WhatsApp,CEP,Logradouro,Número,Bairro,Cidade,Estado,Complemento,Data Cadastro";
    const rows = associates.map((a) =>
      [
        `"${a.nomeCompleto}"`,
        a.dataNascimento ? new Date(a.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR") : "",
        formatCpf(a.cpf),
        a.email,
        formatWhatsapp(a.whatsapp),
        a.cep,
        `"${a.logradouro}"`,
        `"${a.numero}"`,
        `"${a.bairro}"`,
        a.cidade,
        a.estado,
        `"${a.complemento}"`,
        new Date(a.createdAt).toLocaleDateString("pt-BR"),
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `associados-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = associates.filter(
    (a) =>
      a.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.cpf.includes(search.replace(/\D/g, "")) ||
      a.cidade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Associados">
      <div className="space-y-6">
        {/* Stats */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white flex items-center gap-4">
          <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
            <Users className="w-7 h-7 text-accent" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Total de associados cadastrados</p>
            <p className="text-4xl font-bold">{loading ? "—" : associates.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, e-mail, CPF ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={exportCsv} variant="outline" disabled={associates.length === 0}>
            <Download className="w-4 h-4 mr-2" /> Exportar CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Carregando...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                {associates.length === 0
                  ? "Nenhum associado cadastrado ainda."
                  : "Nenhum resultado encontrado."}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Cidade</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected?.id === a.id ? "bg-accent/5" : ""}`}
                      onClick={() => setSelected(selected?.id === a.id ? null : a)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{a.nomeCompleto}</p>
                        <p className="text-xs text-gray-400">{a.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {a.cidade}/{a.estado}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                        {new Date(a.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleDelete(a); }}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5 sticky top-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-primary text-lg font-serif leading-tight">{selected.nomeCompleto}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Cadastrado em {new Date(selected.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold shrink-0">Ativo</span>
                </div>

                <div className="divide-y divide-gray-100 text-sm">
                  {selected.dataNascimento && (
                    <div className="py-3 flex justify-between">
                      <span className="text-gray-500 font-medium">Nascimento</span>
                      <span className="text-gray-800">{new Date(selected.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500 font-medium">CPF</span>
                    <span className="text-gray-800 font-mono">{formatCpf(selected.cpf)}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500 font-medium">WhatsApp</span>
                    <a
                      href={`https://wa.me/55${selected.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                      {formatWhatsapp(selected.whatsapp)}
                    </a>
                  </div>
                  <div className="py-3 flex justify-between gap-4">
                    <span className="text-gray-500 font-medium shrink-0">E-mail</span>
                    <a href={`mailto:${selected.email}`} className="text-primary hover:underline truncate">{selected.email}</a>
                  </div>
                  <div className="py-3">
                    <span className="text-gray-500 font-medium block mb-1">Endereço</span>
                    <p className="text-gray-800 leading-relaxed">
                      {selected.logradouro}{selected.numero ? `, ${selected.numero}` : ""}{selected.complemento ? ` — ${selected.complemento}` : ""}<br />
                      {selected.bairro}{selected.bairro ? " — " : ""}{selected.cidade}/{selected.estado}<br />
                      CEP: {selected.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleDelete(selected)}
                  variant="outline"
                  className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remover associado
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-8 text-center text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Clique em um associado para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

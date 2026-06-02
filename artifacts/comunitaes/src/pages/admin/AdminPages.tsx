import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type PageConfig = {
  key: string;
  label: string;
  hint: string;
  href: string;
};

const PAGES: PageConfig[] = [
  { key: "page:quemsomos", label: "Quem Somos", hint: "Conteúdo HTML da página Quem Somos. Deixe vazio para usar o conteúdo padrão importado do WordPress.", href: "/quem-somos" },
  { key: "page:historia", label: "História da Imigração", hint: "Conteúdo HTML da página História.", href: "/historia" },
  { key: "page:transparencia", label: "Transparência", hint: "Conteúdo HTML da página Transparência.", href: "/transparencia" },
  { key: "page:diretoria", label: "Diretoria", hint: "Conteúdo HTML da página Diretoria.", href: "/diretoria" },
  { key: "page:estatuto", label: "Estatuto", hint: "Conteúdo HTML do Estatuto.", href: "/estatuto" },
];

export default function AdminPages() {
  const { toast } = useToast();
  const [active, setActive] = useState<PageConfig>(PAGES[0]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setContent("");
    fetch(`/api/settings/${active.key}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.value) setContent(d.value); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [active.key]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.settings.set(active.key, content, active.label);
      toast({ title: `"${active.label}" salvo com sucesso!` });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("Resetar para o conteúdo padrão? Seu conteúdo editado será perdido.")) return;
    setSaving(true);
    try {
      await api.settings.set(active.key, "", active.label);
      setContent("");
      toast({ title: "Resetado para o conteúdo padrão." });
    } catch {
      toast({ title: "Erro ao resetar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Conteúdo das Páginas">
      <div className="flex gap-6 h-full">
        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Páginas</span>
            </div>
            <nav className="p-2 space-y-1">
              {PAGES.map(p => (
                <button
                  key={p.key}
                  onClick={() => setActive(p)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${active.key === p.key ? "bg-accent/10 text-accent" : "text-gray-600 hover:bg-gray-50 hover:text-primary"}`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  {p.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Editor */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-primary font-serif">{active.label}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{active.hint}</p>
              </div>
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Ver página
              </a>
            </div>

            <div className="space-y-2">
              <Label>
                Conteúdo{" "}
                <span className="text-xs text-gray-400 font-normal">— Deixe vazio para usar o conteúdo padrão</span>
              </Label>
              {loading ? (
                <div className="h-96 bg-gray-50 rounded-xl animate-pulse" />
              ) : (
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  minHeight={480}
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleReset} disabled={saving || loading}>
              Resetar para padrão
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-accent hover:bg-accent/90 text-white gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Conteúdo"}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import { Save, BarChart3, Globe, Lock } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SETTINGS_SCHEMA = [
  {
    group: "Google Analytics",
    icon: BarChart3,
    items: [
      { key: "google_analytics_id", label: "Measurement ID (GA4)", placeholder: "G-XXXXXXXXXX", description: "Insira seu ID do Google Analytics 4 para ativar o rastreamento." },
    ],
  },
  {
    group: "SEO do Site",
    icon: Globe,
    items: [
      { key: "site_title", label: "Título do Site", placeholder: "Comunità Italiana do Espírito Santo", description: "Aparece na aba do navegador e nos resultados do Google." },
      { key: "site_description", label: "Descrição (Meta Description)", placeholder: "Associação Federativa...", description: "Texto exibido abaixo do título nos resultados de busca. Máx. 160 caracteres." },
      { key: "site_keywords", label: "Palavras-chave", placeholder: "italianos, espírito santo, cultura italiana...", description: "Palavras-chave separadas por vírgula para SEO." },
      { key: "og_image_url", label: "Imagem de Compartilhamento (OG Image)", placeholder: "https://...", description: "Imagem exibida ao compartilhar o site em redes sociais." },
    ],
  },
  {
    group: "Senha do Admin",
    icon: Lock,
    items: [
      { key: "_new_password", label: "Nova senha de administrador", placeholder: "Mínimo 8 caracteres", description: "Deixe em branco para manter a senha atual.", isPassword: true },
    ],
  },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.settings.list()
      .then((settings) => {
        const map: Record<string, string> = {};
        settings.forEach((s) => { map[s.key] = s.value; });
        setValues(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises: Promise<unknown>[] = [];

      for (const group of SETTINGS_SCHEMA) {
        for (const item of group.items) {
          if (item.key === "_new_password") continue;
          const val = values[item.key] ?? "";
          promises.push(api.settings.set(item.key, val, item.label));
        }
      }

      const newPw = values["_new_password"];
      if (newPw && newPw.length >= 8) {
        const key = localStorage.getItem("admin_token") ?? "";
        promises.push(
          fetch("/api/auth/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPw, setupKey: key }),
          }).then(async (r) => {
            if (!r.ok) {
              const b = await r.json().catch(() => ({}));
              throw new Error(b.error ?? "Erro ao mudar senha");
            }
          })
        );
      } else if (newPw && newPw.length > 0 && newPw.length < 8) {
        toast({ title: "Senha deve ter pelo menos 8 caracteres", variant: "destructive" });
        setSaving(false);
        return;
      }

      await Promise.all(promises);
      toast({ title: "Configurações salvas com sucesso!" });
      setValues((prev) => ({ ...prev, _new_password: "" }));
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Configurações">
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configurações">
      <div className="space-y-6 max-w-3xl">
        {SETTINGS_SCHEMA.map(({ group, icon: Icon, items }) => (
          <div key={group} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-primary text-lg font-serif">{group}</h3>
            </div>

            {items.map(({ key, label, placeholder, description, ...rest }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type={"isPassword" in rest && rest.isPassword ? "password" : "text"}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="bg-gray-50"
                />
                {description && <p className="text-xs text-gray-400">{description}</p>}
                {key === "google_analytics_id" && values[key] && (
                  <p className="text-xs text-green-600 font-medium">✓ Google Analytics ativo: {values[key]}</p>
                )}
              </div>
            ))}
          </div>
        ))}

        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 w-full py-6 text-base font-bold">
          <Save className="w-5 h-5 mr-2" /> {saving ? "Salvando..." : "Salvar Todas as Configurações"}
        </Button>
      </div>
    </AdminLayout>
  );
}

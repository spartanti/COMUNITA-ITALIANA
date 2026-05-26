import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle, Save, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type Banner } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaPrimaryText: "Conheça a Associação",
  ctaPrimaryUrl: "/quem-somos",
  ctaSecondaryText: "Associe-se",
  ctaSecondaryUrl: "/contato",
  active: false,
  sortOrder: 0,
};

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => {
    api.banners.list()
      .then(setBanners)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (banner: Banner) => {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      ctaPrimaryText: banner.ctaPrimaryText,
      ctaPrimaryUrl: banner.ctaPrimaryUrl,
      ctaSecondaryText: banner.ctaSecondaryText,
      ctaSecondaryUrl: banner.ctaSecondaryUrl,
      active: banner.active,
      sortOrder: banner.sortOrder,
    });
    setEditingId(banner.id);
  };

  const startNew = () => {
    setForm(emptyForm);
    setEditingId("new");
  };

  const cancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) {
      toast({ title: "Título e URL da imagem são obrigatórios", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        await api.banners.create(form);
        toast({ title: "Banner criado!" });
      } else {
        await api.banners.update(editingId as number, form);
        toast({ title: "Banner atualizado!" });
      }
      cancel();
      load();
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`Excluir banner "${banner.title}"?`)) return;
    try {
      await api.banners.delete(banner.id);
      toast({ title: "Banner excluído" });
      load();
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleSetActive = async (banner: Banner) => {
    try {
      await Promise.all([
        ...banners.filter((b) => b.active && b.id !== banner.id).map((b) => api.banners.update(b.id, { active: false })),
        api.banners.update(banner.id, { active: true }),
      ]);
      toast({ title: "Banner ativado como principal!" });
      load();
    } catch {
      toast({ title: "Erro ao ativar", variant: "destructive" });
    }
  };

  const FormPanel = () => (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
      <h3 className="font-bold text-primary text-lg font-serif">{editingId === "new" ? "Novo Banner" : "Editar Banner"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label>Título Principal *</Label>
          <Input value={form.title} onChange={set("title")} placeholder="Ex: Comunità Italiana do Espírito Santo" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Subtítulo</Label>
          <Input value={form.subtitle} onChange={set("subtitle")} placeholder="Ex: Preservando nossa história..." />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Imagem de Fundo *</Label>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            aspectLabel="1920 × 600 px (proporção 16:5)"
            hint="Imagem exibida como fundo do banner na página inicial. Prefira fotos largas e horizontais."
          />
        </div>
        <div className="space-y-2">
          <Label>Texto do Botão Principal</Label>
          <Input value={form.ctaPrimaryText} onChange={set("ctaPrimaryText")} />
        </div>
        <div className="space-y-2">
          <Label>Link do Botão Principal</Label>
          <Input value={form.ctaPrimaryUrl} onChange={set("ctaPrimaryUrl")} placeholder="/quem-somos" />
        </div>
        <div className="space-y-2">
          <Label>Texto do Botão Secundário</Label>
          <Input value={form.ctaSecondaryText} onChange={set("ctaSecondaryText")} />
        </div>
        <div className="space-y-2">
          <Label>Link do Botão Secundário</Label>
          <Input value={form.ctaSecondaryUrl} onChange={set("ctaSecondaryUrl")} placeholder="/contato" />
        </div>
        <div className="space-y-2">
          <Label>Ordem de exibição</Label>
          <Input type="number" value={form.sortOrder} onChange={set("sortOrder")} min={0} />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? "bg-accent" : "bg-gray-200"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <Label className="cursor-pointer">Ativar como banner principal</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" /> {saving ? "Salvando..." : "Salvar"}
        </Button>
        <Button onClick={cancel} variant="outline">
          <X className="w-4 h-4 mr-2" /> Cancelar
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Banner Principal">
      <div className="space-y-6 max-w-4xl">
        <p className="text-gray-500 text-sm">Configure a imagem e textos exibidos no banner principal da página inicial.</p>

        {editingId !== null && <FormPanel />}

        {editingId === null && (
          <Button onClick={startNew} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Novo Banner
          </Button>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Carregando...</div>
          ) : banners.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-gray-200">
              <p className="mb-2 font-medium">Nenhum banner cadastrado</p>
              <p className="text-sm">Crie um banner para personalizar o início da sua página.</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${banner.active ? "border-accent ring-1 ring-accent" : "border-gray-100"}`}>
                <div className="flex gap-4">
                  {banner.imageUrl && (
                    <img src={banner.imageUrl} alt={banner.title} className="w-32 h-20 object-cover rounded-lg border shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-primary">{banner.title}</h4>
                        {banner.subtitle && <p className="text-sm text-gray-500 mt-0.5">{banner.subtitle}</p>}
                      </div>
                      {banner.active && (
                        <span className="text-xs bg-accent/20 text-primary px-2 py-1 rounded-full font-semibold shrink-0">✓ Ativo</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!banner.active && (
                        <Button variant="outline" size="sm" onClick={() => handleSetActive(banner)} className="text-green-600 border-green-200 hover:bg-green-50">
                          <CheckCircle className="w-4 h-4 mr-1" /> Ativar
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => startEdit(banner)}>
                        <Pencil className="w-4 h-4 mr-1" /> Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(banner)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

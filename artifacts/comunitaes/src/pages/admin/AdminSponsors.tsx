import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api, type Sponsor } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Check, ExternalLink, GripVertical, Eye, EyeOff } from "lucide-react";

type FormData = {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  active: boolean;
  sortOrder: number;
};

const EMPTY: FormData = { name: "", logoUrl: "", websiteUrl: "", active: true, sortOrder: 0 };

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try { setSponsors(await api.sponsors.listAll()); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setError("");
    setShowForm(true);
  }

  function openEdit(s: Sponsor) {
    setEditId(s.id);
    setForm({ name: s.name, logoUrl: s.logoUrl, websiteUrl: s.websiteUrl, active: s.active, sortOrder: s.sortOrder });
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.logoUrl.trim()) {
      setError("Nome e URL do logo são obrigatórios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editId !== null) {
        await api.sponsors.update(editId, form);
      } else {
        await api.sponsors.create(form);
      }
      setShowForm(false);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Remover este patrocinador?")) return;
    try {
      await api.sponsors.delete(id);
      await load();
    } catch { /* noop */ }
  }

  async function toggleActive(s: Sponsor) {
    try {
      await api.sponsors.update(s.id, { active: !s.active });
      await load();
    } catch { /* noop */ }
  }

  return (
    <AdminLayout title="Patrocinadores">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Gerencie os logos de patrocinadores exibidos na faixa da página inicial.
          </p>
          <Button onClick={openCreate} className="bg-accent hover:bg-accent/90 text-white gap-2">
            <Plus className="w-4 h-4" /> Novo Patrocinador
          </Button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-bold font-serif text-primary">
                  {editId !== null ? "Editar Patrocinador" : "Novo Patrocinador"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="name">Nome do patrocinador *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Governo do ES"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="logoUrl">URL do Logo *</Label>
                  <Input
                    id="logoUrl"
                    placeholder="https://exemplo.com/logo.png"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  />
                  {form.logoUrl && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center h-20">
                      <img
                        src={form.logoUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="websiteUrl">Site (opcional)</Label>
                  <Input
                    id="websiteUrl"
                    placeholder="https://exemplo.com"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="sortOrder">Ordem de exibição</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      min={0}
                      value={form.sortOrder}
                      onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div
                        onClick={() => setForm({ ...form, active: !form.active })}
                        className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? "bg-accent" : "bg-gray-300"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-6" : "left-1"}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {form.active ? "Ativo" : "Inativo"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1" disabled={saving}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-accent hover:bg-accent/90 text-white gap-2">
                  <Check className="w-4 h-4" />
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sponsors list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Carregando...</div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <GripVertical className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-600 mb-2">Nenhum patrocinador ainda</h3>
            <p className="text-gray-400 text-sm mb-6">Adicione logos que aparecerão na faixa da página inicial.</p>
            <Button onClick={openCreate} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Adicionar primeiro patrocinador
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 divide-y divide-gray-100">
              {/* Header */}
              <div className="contents text-xs text-gray-400 uppercase tracking-wider font-semibold">
                <div className="px-4 py-3 bg-gray-50" />
                <div className="px-4 py-3 bg-gray-50">Patrocinador</div>
                <div className="px-4 py-3 bg-gray-50 text-center">Ordem</div>
                <div className="px-4 py-3 bg-gray-50 text-center">Status</div>
                <div className="px-4 py-3 bg-gray-50 text-right">Ações</div>
              </div>

              {sponsors.map((s) => (
                <div key={s.id} className="contents group">
                  {/* Logo preview */}
                  <div className="px-4 py-3 flex items-center">
                    <div className="w-16 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                      {s.logoUrl ? (
                        <img src={s.logoUrl} alt={s.name} className="max-h-full max-w-full object-contain p-1" />
                      ) : (
                        <span className="text-xs text-gray-400">sem logo</span>
                      )}
                    </div>
                  </div>

                  {/* Name + link */}
                  <div className="px-4 py-3 flex items-center gap-2">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{s.name}</div>
                      {s.websiteUrl && (
                        <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-accent flex items-center gap-1 transition-colors">
                          <ExternalLink className="w-3 h-3" /> {s.websiteUrl}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Sort order */}
                  <div className="px-4 py-3 flex items-center justify-center">
                    <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5 font-medium">
                      {s.sortOrder}
                    </span>
                  </div>

                  {/* Active toggle */}
                  <div className="px-4 py-3 flex items-center justify-center">
                    <button
                      onClick={() => toggleActive(s)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        s.active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {s.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {s.active ? "Ativo" : "Inativo"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview strip */}
        {sponsors.filter((s) => s.active).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Preview da faixa ({sponsors.filter((s) => s.active).length} patrocinadores ativos)
            </h3>
            <div className="flex items-center gap-8 overflow-x-auto pb-2">
              {sponsors
                .filter((s) => s.active)
                .map((s) => (
                  <div key={s.id} className="shrink-0 h-12 flex items-center justify-center">
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                      style={{ maxWidth: 120 }}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

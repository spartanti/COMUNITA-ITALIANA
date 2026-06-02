import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { api, type CustomPage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ExternalLink, FileText, Plus, Pencil, Trash2, X, Check, Eye, EyeOff, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MenuPositionField } from "@/components/admin/MenuPositionField";

type PageConfig = { key: string; label: string; hint: string; href: string; navKey: string };

const FIXED_PAGES: PageConfig[] = [
  { key: "page:quemsomos",     navKey: "quemsomos",     label: "Quem Somos",            hint: "Conteúdo da página Quem Somos.",     href: "/quem-somos" },
  { key: "page:historia",      navKey: "historia",      label: "História da Imigração",  hint: "Conteúdo da página História.",        href: "/historia" },
  { key: "page:transparencia", navKey: "transparencia", label: "Transparência",           hint: "Conteúdo da página Transparência.",   href: "/transparencia" },
  { key: "page:diretoria",     navKey: "diretoria",     label: "Diretoria",               hint: "Conteúdo da página Diretoria.",       href: "/diretoria" },
  { key: "page:estatuto",      navKey: "estatuto",      label: "Estatuto",                hint: "Conteúdo do Estatuto.",               href: "/estatuto" },
];

// Default nav positions (current hardcoded behaviour)
const DEFAULT_NAV: Record<string, { label: string; section: string; order: number }> = {
  quemsomos:     { label: "Quem Somos",           section: "dropdown:Quem Somos",      order: 0 },
  historia:      { label: "História da Imigração", section: "none",                     order: 0 },
  transparencia: { label: "Transparência",          section: "dropdown:Institucional",   order: 0 },
  diretoria:     { label: "Diretoria",              section: "dropdown:Quem Somos",      order: 1 },
  estatuto:      { label: "Estatuto",               section: "dropdown:Quem Somos",      order: 2 },
};

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

type Section = "fixed" | "custom";

type PageForm = {
  title: string; slug: string; content: string;
  menuLabel: string; menuSection: string; menuOrder: number; active: boolean;
};

const EMPTY_FORM: PageForm = {
  title: "", slug: "", content: "", menuLabel: "", menuSection: "none", menuOrder: 0, active: true,
};

type NavConfigs = Record<string, { label: string; section: string; order: number }>;

export default function AdminPages() {
  const { toast } = useToast();

  // ── fixed section ──
  const [activeFixed, setActiveFixed] = useState<PageConfig>(FIXED_PAGES[0]);
  const [fixedContent, setFixedContent] = useState("");
  const [fixedLoading, setFixedLoading] = useState(false);
  const [fixedSaving, setFixedSaving] = useState(false);
  const [navConfigs, setNavConfigs] = useState<NavConfigs>({ ...DEFAULT_NAV });
  const [showMenuConfig, setShowMenuConfig] = useState(false);

  // ── custom section ──
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [customLoading, setCustomLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PageForm>(EMPTY_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [section, setSection] = useState<Section>("fixed");

  // load nav config
  useEffect(() => {
    fetch("/api/settings/nav:fixed_pages", {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.value) setNavConfigs({ ...DEFAULT_NAV, ...JSON.parse(d.value) }); })
      .catch(() => {});
  }, []);

  // load fixed content when active page changes
  useEffect(() => {
    setFixedLoading(true);
    setFixedContent("");
    setShowMenuConfig(false);
    fetch(`/api/settings/${activeFixed.key}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.value) setFixedContent(d.value); })
      .catch(() => {})
      .finally(() => setFixedLoading(false));
  }, [activeFixed.key]);

  async function loadCustom() {
    setCustomLoading(true);
    try { setCustomPages(await api.customPages.listAll()); }
    finally { setCustomLoading(false); }
  }

  useEffect(() => { loadCustom(); }, []);

  function updateNavConfig(navKey: string, field: string, value: string | number) {
    setNavConfigs(prev => ({ ...prev, [navKey]: { ...prev[navKey], [field]: value } }));
  }

  async function saveFixed() {
    setFixedSaving(true);
    try {
      await Promise.all([
        api.settings.set(activeFixed.key, fixedContent, activeFixed.label),
        api.settings.set("nav:fixed_pages", JSON.stringify(navConfigs), "Configuração do menu de páginas fixas"),
      ]);
      toast({ title: `"${activeFixed.label}" salvo com sucesso!` });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Erro ao salvar", variant: "destructive" });
    } finally { setFixedSaving(false); }
  }

  async function resetFixed() {
    if (!confirm("Resetar para o conteúdo padrão? Seu conteúdo editado será perdido.")) return;
    setFixedSaving(true);
    try {
      await api.settings.set(activeFixed.key, "", activeFixed.label);
      setFixedContent("");
      toast({ title: "Resetado para o conteúdo padrão." });
    } catch { toast({ title: "Erro ao resetar", variant: "destructive" }); }
    finally { setFixedSaving(false); }
  }

  function openCreate() { setEditId(null); setForm(EMPTY_FORM); setFormError(""); setShowForm(true); }

  function openEdit(p: CustomPage) {
    setEditId(p.id);
    setForm({ title: p.title, slug: p.slug, content: p.content, menuLabel: p.menuLabel, menuSection: p.menuSection, menuOrder: p.menuOrder, active: p.active });
    setFormError("");
    setShowForm(true);
  }

  async function saveCustom() {
    if (!form.title.trim() || !form.slug.trim()) { setFormError("Título e slug são obrigatórios."); return; }
    setFormSaving(true); setFormError("");
    try {
      if (editId !== null) await api.customPages.update(editId, form);
      else await api.customPages.create(form);
      setShowForm(false); await loadCustom();
      toast({ title: editId ? "Página atualizada!" : "Página criada com sucesso!" });
    } catch (e) { setFormError(e instanceof Error ? e.message : "Erro ao salvar."); }
    finally { setFormSaving(false); }
  }

  async function deleteCustom(id: number) {
    if (!confirm("Excluir esta página permanentemente?")) return;
    try { await api.customPages.delete(id); await loadCustom(); }
    catch { toast({ title: "Erro ao excluir", variant: "destructive" }); }
  }

  async function toggleActive(p: CustomPage) {
    try { await api.customPages.update(p.id, { active: !p.active }); await loadCustom(); }
    catch { /* noop */ }
  }

  const sectionLabel = (s: string) =>
    s === "top" ? "Menu principal" : s === "institucional" ? "Institucional" : "Fora do menu";

  const activeNav = navConfigs[activeFixed.navKey] ?? DEFAULT_NAV[activeFixed.navKey];

  // Collect all existing dropdown group names for autocomplete
  const allDropdownGroups = Array.from(new Set([
    ...Object.values(navConfigs).map(c => c.section).filter(s => s.startsWith("dropdown:")).map(s => s.slice(9)),
    ...customPages.map(p => p.menuSection).filter(s => s.startsWith("dropdown:")).map(s => s.slice(9)),
  ]));

  return (
    <AdminLayout title="Conteúdo das Páginas">

      {/* ── Page form modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold font-serif text-primary">
                {editId !== null ? "Editar Página" : "Nova Página"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5">
              {formError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{formError}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título *</Label>
                  <Input value={form.title} onChange={(e) => { const title = e.target.value; setForm(f => ({ ...f, title, ...(editId === null ? { slug: slugify(title), menuLabel: title } : {}) })); }} placeholder="Ex: Eventos 2025" />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug (URL) *</Label>
                  <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} placeholder="eventos-2025" />
                  <p className="text-xs text-gray-400">/{form.slug || "..."}</p>
                </div>
              </div>

              <MenuPositionField
                section={form.menuSection}
                order={form.menuOrder}
                label={form.menuLabel}
                existingGroups={allDropdownGroups}
                onChangeSection={v => setForm(f => ({ ...f, menuSection: v }))}
                onChangeOrder={v => setForm(f => ({ ...f, menuOrder: v }))}
                onChangeLabel={v => setForm(f => ({ ...f, menuLabel: v }))}
              />

              <div className="flex items-center gap-2">
                <div onClick={() => setForm(f => ({ ...f, active: !f.active }))} className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${form.active ? "bg-accent" : "bg-gray-300"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-6" : "left-1"}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{form.active ? "Ativa" : "Inativa"}</span>
              </div>

              <div className="space-y-1.5">
                <Label>Conteúdo</Label>
                <RichTextEditor value={form.content} onChange={(html) => setForm(f => ({ ...f, content: html }))} minHeight={320} />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={formSaving} className="flex-1">Cancelar</Button>
              <Button onClick={saveCustom} disabled={formSaving} className="flex-1 bg-accent hover:bg-accent/90 text-white gap-2">
                <Check className="w-4 h-4" />
                {formSaving ? "Salvando..." : "Salvar Página"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Páginas do Site</span>
            </div>
            <nav className="p-2 space-y-1">
              {FIXED_PAGES.map(p => (
                <button key={p.key} onClick={() => { setSection("fixed"); setActiveFixed(p); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${section === "fixed" && activeFixed.key === p.key ? "bg-accent/10 text-accent" : "text-gray-600 hover:bg-gray-50 hover:text-primary"}`}>
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{p.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-normal ${navConfigs[p.navKey]?.section === "none" ? "text-gray-400" : "bg-accent/10 text-accent"}`}>
                    {sectionLabel(navConfigs[p.navKey]?.section ?? DEFAULT_NAV[p.navKey].section)}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Páginas Personalizadas</span>
              <button onClick={openCreate} className="text-accent hover:text-accent/80" title="Nova página"><Plus className="w-4 h-4" /></button>
            </div>
            <nav className="p-2 space-y-1">
              {customLoading ? (
                <div className="px-3 py-2 text-xs text-gray-400">Carregando...</div>
              ) : customPages.length === 0 ? (
                <div className="px-3 py-3 text-center">
                  <p className="text-xs text-gray-400 mb-2">Nenhuma página criada</p>
                  <button onClick={openCreate} className="text-xs text-accent hover:underline flex items-center gap-1 mx-auto"><Plus className="w-3 h-3" /> Criar página</button>
                </div>
              ) : customPages.map(p => (
                <div key={p.id} onClick={() => setSection("custom")} className="flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-50 group">
                  <FileText className="w-4 h-4 shrink-0 text-gray-400" />
                  <span className={`flex-1 text-sm font-medium truncate ${p.active ? "text-gray-700" : "text-gray-400 italic"}`}>{p.title}</span>
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(p); }} className="p-1 text-gray-400 hover:text-primary rounded"><Pencil className="w-3 h-3" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteCustom(p.id); }} className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {section === "fixed" ? (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-primary font-serif">{activeFixed.label}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{activeFixed.hint}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowMenuConfig(v => !v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${showMenuConfig ? "border-accent text-accent bg-accent/5" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      <Settings2 className="w-4 h-4" /> Configurar menu
                    </button>
                    <a href={activeFixed.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" /> Ver página
                    </a>
                  </div>
                </div>

                {/* Menu config panel */}
                {showMenuConfig && (
                  <MenuPositionField
                    section={activeNav.section}
                    order={activeNav.order}
                    label={activeNav.label}
                    existingGroups={allDropdownGroups}
                    onChangeSection={v => updateNavConfig(activeFixed.navKey, "section", v)}
                    onChangeOrder={v => updateNavConfig(activeFixed.navKey, "order", v)}
                    onChangeLabel={v => updateNavConfig(activeFixed.navKey, "label", v)}
                    compact
                  />
                )}

                <div className="space-y-1.5">
                  <Label>Conteúdo <span className="text-xs text-gray-400 font-normal">— Deixe vazio para usar o conteúdo padrão</span></Label>
                  {fixedLoading ? <div className="h-96 bg-gray-50 rounded-xl animate-pulse" /> : (
                    <RichTextEditor value={fixedContent} onChange={setFixedContent} minHeight={480} />
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={resetFixed} disabled={fixedSaving || fixedLoading}>Resetar para padrão</Button>
                <Button onClick={saveFixed} disabled={fixedSaving || fixedLoading} className="bg-accent hover:bg-accent/90 text-white gap-2">
                  <Save className="w-4 h-4" /> {fixedSaving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-primary font-serif">Páginas Personalizadas</h2>
                <Button onClick={openCreate} className="bg-accent hover:bg-accent/90 text-white gap-2"><Plus className="w-4 h-4" /> Nova Página</Button>
              </div>
              {customPages.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-sm mb-4">Nenhuma página personalizada ainda.</p>
                  <Button onClick={openCreate} variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Criar primeira página</Button>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Título</th>
                      <th className="px-5 py-3 text-left">URL</th>
                      <th className="px-5 py-3 text-center">Menu</th>
                      <th className="px-5 py-3 text-center">Status</th>
                      <th className="px-5 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customPages.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-900">{p.title}</td>
                        <td className="px-5 py-3 text-gray-500">/{p.slug}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.menuSection === "none" ? "bg-gray-100 text-gray-500" : "bg-accent/10 text-accent"}`}>
                            {sectionLabel(p.menuSection)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button onClick={() => toggleActive(p)} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mx-auto transition-colors ${p.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {p.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {p.active ? "Ativa" : "Inativa"}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-right space-x-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteCustom(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

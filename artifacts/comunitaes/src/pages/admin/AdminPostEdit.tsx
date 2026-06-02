import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { api, type Post } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminPostEdit() {
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "Notícias",
    imageUrl: "",
    published: true,
  });

  useEffect(() => {
    if (!isNew) {
      api.posts.list()
        .then((posts) => {
          const post = posts.find((p) => p.id === parseInt(params.id, 10));
          if (post) {
            setForm({
              title: post.title,
              slug: post.slug,
              content: post.content,
              excerpt: post.excerpt,
              category: post.category,
              imageUrl: post.imageUrl,
              published: post.published,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isNew, params.id]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({ ...prev, title, ...(isNew ? { slug: slugify(title) } : {}) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      toast({ title: "Preencha título, slug e conteúdo", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await api.posts.create(form);
        toast({ title: "Notícia criada com sucesso!" });
      } else {
        await api.posts.update(parseInt(params.id, 10), form);
        toast({ title: "Notícia atualizada!" });
      }
      setLocation("/admin/posts");
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isNew ? "Nova Notícia" : "Editar Notícia"}>
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? "Nova Notícia" : "Editar Notícia"}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <Button type="button" variant="ghost" onClick={() => setLocation("/admin/posts")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={form.title} onChange={handleTitleChange} placeholder="Título da notícia" required className="text-lg font-medium" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input id="slug" value={form.slug} onChange={set("slug")} placeholder="titulo-da-noticia" required />
              <p className="text-xs text-gray-400">Usado na URL: /noticias/{form.slug || "..."}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={form.category}
                onChange={set("category")}
                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Notícias">Notícias</option>
                <option value="Cultura">Cultura</option>
                <option value="Eventos">Eventos</option>
                <option value="Institucional">Institucional</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Imagem de Capa</Label>
              <ImageUpload
                value={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                aspectLabel="1200 × 630 px (proporção 16:9)"
                hint="Aparece no topo da notícia e no card da listagem. Prefira imagens horizontais."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea id="excerpt" value={form.excerpt} onChange={set("excerpt")} placeholder="Breve descrição que aparece na listagem de notícias..." rows={2} />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Conteúdo *</Label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                minHeight={420}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.published}
                onClick={() => setForm((prev) => ({ ...prev, published: !prev.published }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${form.published ? "bg-accent" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.published ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <span className="font-medium text-gray-700 flex items-center gap-2">
                {form.published ? <><Eye className="w-4 h-4 text-green-600" /> Publicado</> : <><EyeOff className="w-4 h-4 text-gray-400" /> Rascunho</>}
              </span>
            </div>

            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Salvando..." : isNew ? "Criar Notícia" : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

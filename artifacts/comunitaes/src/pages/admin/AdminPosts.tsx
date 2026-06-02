import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Download, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type Post } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { siteData } from "@/data/siteData";

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const load = () => {
    api.posts.list()
      .then(setPosts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (post: Post) => {
    if (!confirm(`Excluir "${post.title}"?`)) return;
    try {
      await api.posts.delete(post.id);
      toast({ title: "Notícia excluída" });
      load();
    } catch (err) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await api.posts.update(post.id, { published: !post.published });
      toast({ title: post.published ? "Despublicado" : "Publicado" });
      load();
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const [importing, setImporting] = useState(false);

  async function handleImport() {
    if (!confirm(`Importar ${siteData.posts.length} notícias do site para o banco de dados? Posts já existentes (mesmo slug) serão ignorados.`)) return;
    setImporting(true);
    const existingSlugs = new Set(posts.map(p => p.slug));
    const toImport = siteData.posts.filter(p => !existingSlugs.has(p.slug));
    let ok = 0;
    for (const p of toImport) {
      try {
        await api.posts.create({
          title: p.title,
          slug: p.slug,
          content: p.content,
          excerpt: p.excerpt,
          category: p.categories?.[0] ?? "Notícias",
          imageUrl: "",
          published: true,
        });
        ok++;
      } catch { /* skip */ }
    }
    toast({ title: `${ok} notícias importadas com sucesso!` });
    setImporting(false);
    load();
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Notícias">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por título ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {posts.length === 0 && (
              <Button variant="outline" onClick={handleImport} disabled={importing} className="gap-2">
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {importing ? "Importando..." : "Importar notícias do site"}
              </Button>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/posts/new"><Plus className="w-4 h-4 mr-2" /> Nova Notícia</Link>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Nenhuma notícia encontrada.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoria</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 line-clamp-1 max-w-xs">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{post.excerpt}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleTogglePublish(post)} title={post.published ? "Despublicar" : "Publicar"}>
                        {post.published ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit mx-auto">
                            <Eye className="w-3 h-3" /> Publicado
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit mx-auto">
                            <EyeOff className="w-3 h-3" /> Rascunho
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/posts/${post.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

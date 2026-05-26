import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Newspaper, Image, Settings, TrendingUp, Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { api, type Post, type Banner } from "@/lib/api";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.posts.list(), api.banners.list()])
      .then(([p, b]) => { setPosts(p); setBanners(b); })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Notícias publicadas",
      value: posts.filter((p) => p.published).length,
      total: posts.length,
      icon: Newspaper,
      href: "/admin/posts",
      color: "bg-blue-500",
    },
    {
      label: "Banners cadastrados",
      value: banners.filter((b) => b.active).length,
      total: banners.length,
      icon: Image,
      href: "/admin/banners",
      color: "bg-cyan-500",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold font-serif">Bem-vindo ao painel</h2>
          </div>
          <p className="text-white/70">Gerencie as notícias, o banner da home e as configurações do site.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map(({ label, value, total, icon: Icon, href, color }) => (
            <Link key={href} href={href}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-4xl font-bold text-primary">
                      {loading ? "—" : value}
                      <span className="text-lg font-normal text-gray-400 ml-1">/ {loading ? "—" : total}</span>
                    </p>
                  </div>
                  <div className={`${color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-primary text-lg mb-4 font-serif">Ações rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/posts/new"><Plus className="w-4 h-4 mr-2" /> Nova Notícia</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/banners"><Image className="w-4 h-4 mr-2" /> Editar Banner</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/settings"><Settings className="w-4 h-4 mr-2" /> Configurações</Link>
            </Button>
          </div>
        </div>

        {/* Recent posts */}
        {!loading && posts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary text-lg font-serif">Últimas notícias</h3>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/posts">Ver todas</Link>
              </Button>
            </div>
            <div className="divide-y divide-gray-100">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 line-clamp-1">{post.title}</p>
                    <p className="text-xs text-gray-400">{post.category} · {new Date(post.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

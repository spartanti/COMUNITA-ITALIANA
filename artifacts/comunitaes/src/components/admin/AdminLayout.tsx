import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Newspaper, Image, Settings, LogOut, ChevronRight, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Notícias", href: "/admin/posts", icon: Newspaper },
  { label: "Associados", href: "/admin/associates", icon: Users },
  { label: "Banner Principal", href: "/admin/banners", icon: Image },
  { label: "Configurações", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="bg-white rounded-xl px-4 py-2 mb-3 inline-block">
            <img
              src="https://comunitaes.org.br/wp-content/uploads/2020/08/cropped-Logo_Comunita%CC%80_01_fundo_escuro.png"
              alt="Logo"
              className="h-10"
            />
          </div>
          <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                location === href
                  ? "bg-accent text-primary font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
              {location === href && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <Globe className="w-5 h-5" />
            Ver site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary font-serif">{title}</h1>
          <span className="text-sm text-gray-400">ComunitaES Admin</span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

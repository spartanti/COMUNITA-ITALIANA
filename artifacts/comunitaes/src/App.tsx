import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout/Layout";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SEOProvider } from "@/components/SEO";

import Home from "@/pages/Home";
import QuemSomos from "@/pages/QuemSomos";
import Historia from "@/pages/Historia";
import Noticias from "@/pages/Noticias";
import PostDetail from "@/pages/PostDetail";
import Transparencia from "@/pages/Transparencia";
import Diretoria from "@/pages/Diretoria";
import Estatuto from "@/pages/Estatuto";
import Contato from "@/pages/Contato";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPosts from "@/pages/admin/AdminPosts";
import AdminPostEdit from "@/pages/admin/AdminPostEdit";
import AdminBanners from "@/pages/admin/AdminBanners";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminAssociates from "@/pages/admin/AdminAssociates";
import AdminSponsors from "@/pages/admin/AdminSponsors";
import AdminPages from "@/pages/admin/AdminPages";
import AssociarSe from "@/pages/AssociarSe";
import CustomPage from "@/pages/CustomPage";

const queryClient = new QueryClient();

function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) return <Redirect to="/admin/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public site routes */}
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/quem-somos" component={() => <Layout><QuemSomos /></Layout>} />
      <Route path="/historia" component={() => <Layout><Historia /></Layout>} />
      <Route path="/noticias" component={() => <Layout><Noticias /></Layout>} />
      <Route path="/noticias/:slug" component={() => <Layout><PostDetail /></Layout>} />
      <Route path="/transparencia" component={() => <Layout><Transparencia /></Layout>} />
      <Route path="/diretoria" component={() => <Layout><Diretoria /></Layout>} />
      <Route path="/estatuto" component={() => <Layout><Estatuto /></Layout>} />
      <Route path="/contato" component={() => <Layout><Contato /></Layout>} />
      <Route path="/associar-se" component={() => <Layout><AssociarSe /></Layout>} />

      {/* Dynamic custom pages — must be before NotFound */}
      <Route path="/:slug" component={() => <Layout><CustomPage /></Layout>} />

      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => <ProtectedAdminRoute component={AdminDashboard} />} />
      <Route path="/admin/posts" component={() => <ProtectedAdminRoute component={AdminPosts} />} />
      <Route path="/admin/posts/:id" component={() => <ProtectedAdminRoute component={AdminPostEdit} />} />
      <Route path="/admin/banners" component={() => <ProtectedAdminRoute component={AdminBanners} />} />
      <Route path="/admin/settings" component={() => <ProtectedAdminRoute component={AdminSettings} />} />
      <Route path="/admin/associates" component={() => <ProtectedAdminRoute component={AdminAssociates} />} />
      <Route path="/admin/sponsors" component={() => <ProtectedAdminRoute component={AdminSponsors} />} />
      <Route path="/admin/pages" component={() => <ProtectedAdminRoute component={AdminPages} />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
        <AdminProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <SEOProvider />
            <Router />
          </WouterRouter>
          <Toaster />
        </AdminProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

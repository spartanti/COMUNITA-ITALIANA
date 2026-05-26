import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import QuemSomos from "@/pages/QuemSomos";
import Historia from "@/pages/Historia";
import Noticias from "@/pages/Noticias";
import PostDetail from "@/pages/PostDetail";
import Transparencia from "@/pages/Transparencia";
import Diretoria from "@/pages/Diretoria";
import Estatuto from "@/pages/Estatuto";
import Contato from "@/pages/Contato";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/quem-somos" component={QuemSomos} />
        <Route path="/historia" component={Historia} />
        <Route path="/noticias" component={Noticias} />
        <Route path="/noticias/:slug" component={PostDetail} />
        <Route path="/transparencia" component={Transparencia} />
        <Route path="/diretoria" component={Diretoria} />
        <Route path="/estatuto" component={Estatuto} />
        <Route path="/contato" component={Contato} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
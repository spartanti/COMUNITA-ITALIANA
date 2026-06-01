import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "pt" | "it";

export type Translations = {
  nav: {
    home: string; about: string; institutional: string; news: string; contact: string; join: string;
    transparency: string; board: string; statute: string;
  };
  pageHeaders: {
    about: string; history: string; transparency: string; board: string;
    statute: string; contact: string; news: string; join: string;
  };
  home: {
    tagline: string; cta1: string; cta2: string; scrollHint: string;
    missionLabel: string; missionTitle: string; missionLine: string;
    readMore: string; latestNews: string; seeAll: string;
    ctaBannerTitle: string; ctaBannerSub: string; ctaJoin: string; ctaContact: string;
    featComm: string; featCommDesc: string;
    featHist: string; featHistDesc: string;
    featInst: string; featInstDesc: string;
    featNews: string; featNewsDesc: string;
    stat1: string; stat2: string; stat3: string; stat4: string;
    sponsors: string;
  };
  contact: { title: string; subtitle: string; address: string; phone: string; email: string; formTitle: string; name: string; emailLabel: string; subject: string; message: string; send: string; sent: string; sentDesc: string; };
  join: { title: string; subtitle: string; personalData: string; address: string; contactTitle: string; sendBtn: string; sending: string; successTitle: string; successSub: string; successDesc: string; backHome: string; };
  misc: { loading: string; backToNews: string; notFound: string; };
};

const PT: Translations = {
  nav: { home: "Início", about: "Quem Somos", institutional: "Institucional", news: "Notícias", contact: "Contato", join: "Associe-se", transparency: "Transparência", board: "Diretoria", statute: "Estatuto" },
  pageHeaders: { about: "Quem Somos", history: "História da Imigração", transparency: "Transparência", board: "Diretoria", statute: "Estatuto", contact: "Contato", news: "Notícias", join: "Associe-se" },
  home: {
    tagline: "Associação Federativa — ES, Brasil",
    cta1: "Conheça a Associação", cta2: "Associe-se", scrollHint: "",
    missionLabel: "Nossa Missão",
    missionTitle: "O Berço da Imigração\nItaliana no Brasil",
    missionLine: "A Associação Federativa Comunità Italiana do Espírito Santo foi fundada com o propósito de unir, representar e fortalecer a presença italiana em nosso estado. Atuamos como um elo entre o passado glorioso dos nossos nonnos e o futuro das novas gerações de ítalo-capixabas.",
    readMore: "Ler mais sobre nossa história",
    latestNews: "Últimas Notícias", seeAll: "Ver todas as notícias",
    ctaBannerTitle: "Faça parte da nossa comunidade",
    ctaBannerSub: "Associe-se e ajude a preservar a herança italiana no Espírito Santo para as próximas gerações.",
    ctaJoin: "Quero me associar", ctaContact: "Fale conosco",
    featComm: "Comunidade", featCommDesc: "Unindo descendentes e associações italianas em todo o Espírito Santo.",
    featHist: "História", featHistDesc: "Preservando a memória da imigração italiana desde 1874 no Brasil.",
    featInst: "Institucional", featInstDesc: "Conheça nossa diretoria, estatuto e portal da transparência.",
    featNews: "Notícias", featNewsDesc: "Acompanhe eventos, conquistas e novidades da cultura italiana.",
    stat1: "Anos de imigração", stat2: "Municípios capixabas", stat3: "Descendentes no ES", stat4: "Primeiro desembarque",
    sponsors: "Apoiadores",
  },
  contact: { title: "Contato", subtitle: "Tem alguma dúvida, sugestão ou deseja se associar? Entre em contato conosco através do formulário ou de nossos canais de atendimento.", address: "Endereço", phone: "Telefone", email: "E-mail", formTitle: "Envie uma mensagem", name: "Nome completo", emailLabel: "E-mail", subject: "Assunto", message: "Mensagem", send: "Enviar Mensagem", sent: "Mensagem enviada com sucesso", sentDesc: "Agradecemos o contato. Retornaremos em breve." },
  join: { title: "Associe-se", subtitle: "Faça parte da maior rede de descendentes italianos do Espírito Santo. Preencha o formulário abaixo e nossa equipe entrará em contato.", personalData: "Dados Pessoais", address: "Endereço", contactTitle: "Contato", sendBtn: "Enviar Cadastro", sending: "Enviando...", successTitle: "Cadastro realizado!", successSub: "Bem-vindo(a) à família da Comunità Italiana do Espírito Santo!", successDesc: "Em breve nossa equipe entrará em contato pelo WhatsApp ou e-mail informado para concluir sua associação.", backHome: "Voltar ao início" },
  misc: { loading: "Carregando...", backToNews: "Voltar para Notícias", notFound: "Notícia não encontrada" },
};

const IT: Translations = {
  nav: { home: "Inizio", about: "Chi Siamo", institutional: "Istituzionale", news: "Notizie", contact: "Contatti", join: "Iscriviti", transparency: "Trasparenza", board: "Direzione", statute: "Statuto" },
  pageHeaders: { about: "Chi Siamo", history: "Storia dell'Immigrazione", transparency: "Trasparenza", board: "Direzione", statute: "Statuto", contact: "Contatti", news: "Notizie", join: "Iscriviti" },
  home: {
    tagline: "Associazione Federativa — ES, Brasile",
    cta1: "Scopri l'Associazione", cta2: "Iscriviti", scrollHint: "",
    missionLabel: "La Nostra Missione",
    missionTitle: "La Culla dell'Immigrazione\nItaliana in Brasile",
    missionLine: "L'Associazione Federativa Comunità Italiana dello Stato di Espírito Santo è stata fondata con lo scopo di unire, rappresentare e rafforzare la presenza italiana nel nostro stato. Siamo il collegamento tra il glorioso passato dei nostri nonni e il futuro delle nuove generazioni di italo-capixaba.",
    readMore: "Leggi di più sulla nostra storia",
    latestNews: "Ultime Notizie", seeAll: "Vedi tutte le notizie",
    ctaBannerTitle: "Fai parte della nostra comunità",
    ctaBannerSub: "Iscriviti e aiuta a preservare l'eredità italiana nello Espírito Santo per le prossime generazioni.",
    ctaJoin: "Voglio iscrivermi", ctaContact: "Contattaci",
    featComm: "Comunità", featCommDesc: "Unendo discendenti e associazioni italiane in tutto lo Stato di Espírito Santo.",
    featHist: "Storia", featHistDesc: "Preservando la memoria dell'immigrazione italiana dal 1874 in Brasile.",
    featInst: "Istituzionale", featInstDesc: "Scopri la nostra direzione, statuto e portale della trasparenza.",
    featNews: "Notizie", featNewsDesc: "Segui eventi, conquiste e novità della cultura italiana.",
    stat1: "Anni d'immigrazione", stat2: "Comuni dell'ES", stat3: "Discendenti nell'ES", stat4: "Primo sbarco",
    sponsors: "Sostenitori",
  },
  contact: { title: "Contatti", subtitle: "Hai domande, suggerimenti o vuoi iscriverti? Contattaci tramite il modulo o i nostri canali di assistenza.", address: "Indirizzo", phone: "Telefono", email: "E-mail", formTitle: "Invia un messaggio", name: "Nome completo", emailLabel: "E-mail", subject: "Oggetto", message: "Messaggio", send: "Invia Messaggio", sent: "Messaggio inviato con successo", sentDesc: "Grazie per aver contattato. Risponderemo presto." },
  join: { title: "Iscriviti", subtitle: "Fai parte della più grande rete di discendenti italiani dell'Espírito Santo. Compila il modulo e il nostro team ti contatterà.", personalData: "Dati Personali", address: "Indirizzo", contactTitle: "Contatti", sendBtn: "Invia Iscrizione", sending: "Invio in corso...", successTitle: "Iscrizione completata!", successSub: "Benvenuto nella famiglia della Comunità Italiana dell'Espírito Santo!", successDesc: "Il nostro team ti contatterà presto tramite WhatsApp o email per completare la tua iscrizione.", backHome: "Torna all'inizio" },
  misc: { loading: "Caricamento...", backToNews: "Torna alle Notizie", notFound: "Notizia non trovata" },
};

const translations: Record<Lang, Translations> = { pt: PT, it: IT };

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  t: PT,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    return (stored === "it" ? "it" : "pt") as Lang;
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

const BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers as Record<string, string> ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type Post = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Setting = {
  id: number;
  key: string;
  value: string;
  label: string;
};

export type CustomPage = {
  id: number;
  slug: string;
  title: string;
  content: string;
  menuLabel: string;
  menuSection: string;
  menuOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Sponsor = {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export const api = {
  auth: {
    login: (password: string) =>
      request<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      }),
    setup: (password: string, setupKey: string) =>
      request<{ ok: boolean }>("/auth/setup", {
        method: "POST",
        body: JSON.stringify({ password, setupKey }),
      }),
  },

  posts: {
    list: () => request<Post[]>("/posts"),
    get: (slug: string) => request<Post>(`/posts/${slug}`),
    create: (data: Omit<Post, "id" | "createdAt" | "updatedAt">) =>
      request<Post>("/posts", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>) =>
      request<Post>(`/posts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/posts/${id}`, { method: "DELETE" }),
  },

  banners: {
    list: () => request<Banner[]>("/banners"),
    active: () => request<Banner | null>("/banners/active"),
    create: (data: Omit<Banner, "id" | "createdAt" | "updatedAt">) =>
      request<Banner>("/banners", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Omit<Banner, "id" | "createdAt" | "updatedAt">>) =>
      request<Banner>(`/banners/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/banners/${id}`, { method: "DELETE" }),
  },

  settings: {
    list: () => request<Setting[]>("/settings/all"),
    set: (key: string, value: string, label?: string) =>
      request<Setting>(`/settings/${key}`, { method: "PUT", body: JSON.stringify({ value, label }) }),
    publicList: () => request<Setting[]>("/settings"),
  },

  customPages: {
    list: () => request<CustomPage[]>("/pages"),
    listAll: () => request<CustomPage[]>("/pages/all"),
    get: (slug: string) => request<CustomPage>(`/pages/${slug}`),
    create: (data: Omit<CustomPage, "id" | "createdAt" | "updatedAt">) =>
      request<CustomPage>("/pages", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Omit<CustomPage, "id" | "createdAt" | "updatedAt">>) =>
      request<CustomPage>(`/pages/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/pages/${id}`, { method: "DELETE" }),
  },

  sponsors: {
    list: () => request<Sponsor[]>("/sponsors"),
    listAll: () => request<Sponsor[]>("/sponsors/all"),
    create: (data: Omit<Sponsor, "id" | "createdAt" | "updatedAt">) =>
      request<Sponsor>("/sponsors", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Omit<Sponsor, "id" | "createdAt" | "updatedAt">>) =>
      request<Sponsor>(`/sponsors/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/sponsors/${id}`, { method: "DELETE" }),
  },
};

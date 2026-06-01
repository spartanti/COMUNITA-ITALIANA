import { useRef, useState } from "react";
import { Upload, Link, X, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspectLabel?: string;
}

type Tab = "upload" | "url";

export function ImageUpload({ value, onChange, hint, aspectLabel }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState(value.startsWith("/uploads/") ? "" : value);
  const [tab, setTab] = useState<Tab>(value.startsWith("/uploads/") ? "upload" : "url");

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem (JPG, PNG, WebP, GIF).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo: 10 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token") ?? "";
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Erro ao enviar arquivo");
      }
      const { url } = await res.json() as { url: string };
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (files?.[0]) uploadFile(files[0]);
  }

  function applyUrl() {
    const trimmed = urlInput.trim();
    if (trimmed) onChange(trimmed);
  }

  const isUploaded = value.startsWith("/uploads/");
  const hasValue = value.length > 0;

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          onClick={() => { setTab("upload"); setError(""); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200",
            tab === "upload" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Upload className="w-4 h-4" />
          Upload de arquivo
        </button>
        <button
          type="button"
          onClick={() => { setTab("url"); setError(""); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200",
            tab === "url" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Link className="w-4 h-4" />
          Link (URL)
        </button>
      </div>

      {/* ── Upload tab ─────────────────────────────────────────── */}
      {tab === "upload" && (
        <div className="space-y-2">
          <div
            className={cn(
              "border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
              dragOver ? "border-accent bg-accent/5 scale-[1.01]" : "border-gray-200 hover:border-accent/60 hover:bg-gray-50",
              uploading && "pointer-events-none opacity-60"
            )}
            onClick={() => !hasValue && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          >
            {hasValue ? (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full max-h-52 object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors group flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Trocar imagem
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onChange(""); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-lg shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {isUploaded && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow">
                    <Check className="w-3 h-3" /> Enviada ao servidor
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                {uploading ? (
                  <>
                    <Loader2 className="w-9 h-9 text-accent animate-spin mb-3" />
                    <p className="text-sm font-medium text-gray-600">Enviando imagem...</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                      <ImageIcon className="w-7 h-7 text-accent" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Arraste uma imagem ou{" "}
                      <span className="text-accent underline cursor-pointer">clique para selecionar</span>
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP ou GIF • máx. 10 MB</p>
                    {aspectLabel && (
                      <p className="text-xs text-accent font-semibold mt-3 bg-accent/10 px-3 py-1.5 rounded-full">
                        Tamanho ideal: {aspectLabel}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* ── URL tab ────────────────────────────────────────────── */}
      {tab === "url" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyUrl()}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 border border-input bg-background px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={applyUrl}
              disabled={!urlInput.trim()}
              className="px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Usar
            </button>
          </div>
          {hasValue && !isUploaded && (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img
                src={value}
                alt="Preview"
                className="w-full max-h-48 object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x300?text=URL+inválida"; }}
              />
              <button
                type="button"
                onClick={() => { onChange(""); setUrlInput(""); }}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          <X className="w-3.5 h-3.5 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}

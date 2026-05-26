import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspectLabel?: string;
}

export function ImageUpload({ value, onChange, hint, aspectLabel }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem (JPG, PNG, WebP).");
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

      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Erro ao obter URL de upload");
      }

      const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };

      const putRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!putRes.ok) throw new Error("Falha ao enviar arquivo para o servidor");

      onChange(`/api/storage${objectPath}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (files: FileList | null) => {
    if (files?.[0]) upload(files[0]);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "border-2 border-dashed rounded-xl transition-colors cursor-pointer",
          dragOver ? "border-accent bg-accent/5" : "border-gray-200 hover:border-accent/50",
          uploading && "pointer-events-none opacity-60"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full rounded-xl object-cover max-h-48"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-3 py-1.5 rounded-b-xl flex items-center gap-2">
              <Upload className="w-3 h-3" /> Clique para trocar a imagem
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {uploading ? (
              <><Loader2 className="w-8 h-8 text-accent animate-spin mb-2" /><p className="text-sm text-gray-500">Enviando imagem...</p></>
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Clique ou arraste uma imagem</p>
                <p className="text-xs text-gray-400">JPG, PNG ou WebP • máx. 10 MB</p>
                {aspectLabel && (
                  <p className="text-xs text-accent font-medium mt-2 bg-accent/10 px-3 py-1 rounded-full">
                    📐 Tamanho ideal: {aspectLabel}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* URL manual fallback */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">ou cole uma URL</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <input
        type="url"
        value={value.startsWith("/api/storage") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://exemplo.com/imagem.jpg"
        className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />
    </div>
  );
}

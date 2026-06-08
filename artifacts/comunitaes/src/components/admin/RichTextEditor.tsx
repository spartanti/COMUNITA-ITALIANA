import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Table as TableIcon, Undo, Redo,
  Heading2, Heading3, Minus, Quote, ImageIcon, Youtube as YoutubeIcon,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        'p-1.5 rounded text-sm transition-colors',
        active ? 'bg-accent text-white' : 'text-gray-600 hover:bg-gray-100',
        disabled && 'opacity-30 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-gray-200 mx-1 self-center" />;
}

export function RichTextEditor({ value, onChange, minHeight = 400 }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ controls: true, nocookie: true }),
      Placeholder.configure({ placeholder: 'Escreva o conteúdo aqui...' }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  function addLink() {
    const url = window.prompt('URL do link:');
    if (!url) return;
    if (editor?.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  function insertTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function insertImageByUrl() {
    const url = window.prompt('URL da imagem:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  async function uploadImageFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token') ?? '';
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Falha no upload');
      const { url } = await res.json() as { url: string };
      editor?.chain().focus().setImage({ src: url }).run();
    } catch {
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  }

  function handleImageButton() {
    // mostra opções: upload ou URL
    const choice = window.confirm('Clique em OK para fazer upload de um arquivo.\nClique em Cancelar para inserir por URL.');
    if (choice) {
      fileInputRef.current?.click();
    } else {
      insertImageByUrl();
    }
  }

  function insertVideo() {
    const url = window.prompt('URL do vídeo (YouTube, Vimeo ou link direto):');
    if (!url) return;

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
      return;
    }

    // Vimeo ou outro — embed como iframe via HTML
    let embedUrl = url;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    editor?.chain().focus().insertContent(
      `<iframe src="${embedUrl}" width="640" height="360" frameborder="0" allowfullscreen style="max-width:100%;display:block;margin:1rem auto"></iframe>`
    ).run();
  }

  if (!editor) return <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Sublinhado">
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Esquerda">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centralizar">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Direita">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justificado">
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Linha horizontal">
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertTable} title="Inserir tabela">
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Image */}
        <ToolbarButton onClick={handleImageButton} disabled={uploading} title="Inserir imagem (upload ou URL)">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </ToolbarButton>

        {/* Video */}
        <ToolbarButton onClick={insertVideo} title="Inserir vídeo (YouTube, Vimeo)">
          <YoutubeIcon className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImageFile(file);
          e.target.value = '';
        }}
      />

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 focus:outline-none [&_.tiptap]:outline-none [&_img]:max-w-full [&_iframe]:max-w-full"
        style={{ minHeight }}
      />
    </div>
  );
}

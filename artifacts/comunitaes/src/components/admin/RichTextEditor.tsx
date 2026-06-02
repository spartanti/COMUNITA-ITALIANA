import { Component, type ReactNode, Suspense, lazy } from 'react';

// Lazy load para isolar erros de inicialização do CKEditor
const CKEditorWidget = lazy(() => import('./CKEditorWidget'));

interface Props {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}

interface State {
  error: string | null;
}

export class RichTextEditor extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(err: unknown): State {
    return { error: err instanceof Error ? err.message : String(err) };
  }

  render() {
    const { value, onChange, minHeight = 400 } = this.props;

    if (this.state.error) {
      return (
        <div className="space-y-2">
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Editor visual indisponível — edite o HTML diretamente: {this.state.error}
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={20}
            className="w-full border border-input bg-background px-4 py-3 text-sm rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-y"
          />
        </div>
      );
    }

    return (
      <Suspense fallback={<div className="h-64 bg-gray-50 rounded-xl animate-pulse" />}>
        <CKEditorWidget value={value} onChange={onChange} minHeight={minHeight} />
      </Suspense>
    );
  }
}

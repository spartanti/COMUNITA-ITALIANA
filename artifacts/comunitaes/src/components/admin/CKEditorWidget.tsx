import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  FindAndReplace,
  Heading,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  Strikethrough,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface Props {
  value: string;
  onChange: (html: string) => void;
  minHeight: number;
}

export default function CKEditorWidget({ value, onChange, minHeight }: Props) {
  return (
    <div className="rich-editor-wrapper">
      <style>{`
        .rich-editor-wrapper .ck-editor__editable_inline {
          min-height: ${minHeight}px;
          font-size: 0.9375rem;
          line-height: 1.75;
          padding: 1rem 1.5rem;
        }
        .rich-editor-wrapper .ck.ck-toolbar {
          border-radius: 0.5rem 0.5rem 0 0 !important;
          border-color: #e5e7eb !important;
          background: #f9fafb !important;
        }
        .rich-editor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          border-radius: 0 0 0.5rem 0.5rem !important;
          border-color: #e5e7eb !important;
        }
        .rich-editor-wrapper .ck.ck-editor__main > .ck-editor__editable:focus {
          border-color: #06b6d4 !important;
          box-shadow: 0 0 0 2px rgb(6 182 212 / 0.2) !important;
        }
      `}</style>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_event, editor) => onChange(editor.getData())}
        config={{
          plugins: [
            Essentials,
            Paragraph,
            TextTransformation,
            PasteFromOffice,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            RemoveFormat,
            Link,
            List,
            ListProperties,
            BlockQuote,
            Alignment,
            HorizontalLine,
            Indent,
            IndentBlock,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            FindAndReplace,
            SourceEditing,
          ],
          toolbar: {
            items: [
              'heading', '|',
              'bold', 'italic', 'underline', 'strikethrough', 'removeFormat', '|',
              'link', '|',
              'bulletedList', 'numberedList', '|',
              'indent', 'outdent', '|',
              'blockQuote', 'horizontalLine', '|',
              'alignment', '|',
              'insertTable', '|',
              'findAndReplace', '|',
              'undo', 'redo', '|',
              'sourceEditing',
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Parágrafo', class: 'ck-heading_paragraph' },
              { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Título 4', class: 'ck-heading_heading4' },
            ],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true,
            },
          },
        }}
      />
    </div>
  );
}

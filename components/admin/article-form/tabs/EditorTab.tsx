type EditorTabProps = {
  content: string;
  contentSanitized: boolean;
  onContentChange: (value: string) => void;
  onSanitize: () => void;
};

export default function EditorTab({
  content,
  contentSanitized,
  onContentChange,
  onSanitize,
}: EditorTabProps) {
  return (
    <div className="mb-3 w-full">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="block text-[#bfc7d5]" htmlFor="content">
          Conteúdo do Artigo (Markdown)
        </label>
        <button
          type="button"
          onClick={onSanitize}
          className="px-2 py-1 text-xs bg-[#eebbc3] text-[#232946] rounded hover:bg-[#d9aab2] transition"
        >
          Limpar formatação
        </button>
      </div>
      <div className="flex w-full min-w-0 bg-[#18181b] text-white rounded-lg border border-[#4b6b57] focus-within:border-[#6b8c77] overflow-hidden">
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={14}
          className="min-w-0 flex-1 bg-transparent text-white px-3 py-1.5 focus:outline-none font-mono text-sm leading-6"
          placeholder="Digite o conteúdo do artigo em Markdown..."
        />
      </div>
      {contentSanitized && (
        <p className="mt-2 text-xs text-green-400">
          Formatação invisível removida do conteúdo.
        </p>
      )}
    </div>
  );
}

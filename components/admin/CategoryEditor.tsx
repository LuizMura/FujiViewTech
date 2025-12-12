"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Type, Palette, FileText } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

interface ArticleData {
  id?: string;
  title: string;
  excerpt?: string;
  image?: string;
  content?: string;
  date?: string;
  slug: string;
  category: string;
  title_font_size?: string;
  title_color?: string;
  excerpt_font_size?: string;
  excerpt_color?: string;
  bg_color?: string;
  bg_opacity?: string;
  show_button?: boolean;
  button_text?: string;
  button_bg_color?: string;
  button_text_color?: string;
  button_font_size?: string;
  button_border_radius?: string;
  updated_at?: string;
  sub_component?: string;
}

interface CategoryEditorProps {
  category: string;
  onSave: (data: ArticleData) => Promise<void>;
  supabase: SupabaseClient;
}

export default function CategoryEditor({
  category,
  onSave,
  supabase,
}: CategoryEditorProps) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  // Editor states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [slug, setSlug] = useState("");
  const [subComponent, setSubComponent] = useState("");

  // Style states
  const [titleFontSize, setTitleFontSize] = useState("24");
  const [titleColor, setTitleColor] = useState("#1e293b");
  const [excerptFontSize, setExcerptFontSize] = useState("14");
  const [excerptColor, setExcerptColor] = useState("#64748b");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgOpacity, setBgOpacity] = useState("100");

  // Button states
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("Ver mais");
  const [buttonBgColor, setButtonBgColor] = useState("#3b82f6");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");
  const [buttonFontSize, setButtonFontSize] = useState("14");
  const [buttonBorderRadius, setButtonBorderRadius] = useState("8");

  // Sub-component options
  const getSubComponentOptions = () => {
    if (category === "viagens") {
      return [
        { value: "lista-top", label: "Lista Top (Carrossel principal)" },
        { value: "destinos-imperdiveis", label: "Destinos Imperdíveis" },
        { value: "proximas-aventuras", label: "Próximas Aventuras" },
      ];
    }
    if (category === "filmes-series") {
      return [
        { value: "lista-top", label: "Lista Top (Carrossel principal)" },
        { value: "nao-perca", label: "Não Perca" },
        { value: "ultimos-lancamentos", label: "Últimos Lançamentos" },
      ];
    }
    return [];
  };

  const hasSubComponents =
    category === "viagens" || category === "filmes-series";

  useEffect(() => {
    loadArticles();
  }, [category]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("category", category)
        .order("date", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Erro ao carregar artigos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleSelect = async (article: ArticleData) => {
    setSelectedArticle(article);
    setTitle(article.title || "");
    setExcerpt(article.excerpt || "");
    setImage(article.image || "");
    setContent(article.content || "");
    setDate(article.date ?? "");
    setSlug(article.slug || "");
    setSubComponent(article.sub_component || "");
    setTitleFontSize(article.title_font_size || "24");
    setTitleColor(article.title_color || "#1e293b");
    setExcerptFontSize(article.excerpt_font_size || "14");
    setExcerptColor(article.excerpt_color || "#64748b");
    setBgColor(article.bg_color || "#ffffff");
    setBgOpacity(article.bg_opacity || "100");
    setShowButton(article.show_button || false);
    setButtonText(article.button_text || "Ver mais");
    setButtonBgColor(article.button_bg_color || "#3b82f6");
    setButtonTextColor(article.button_text_color || "#ffffff");
    setButtonFontSize(article.button_font_size || "14");
    setButtonBorderRadius(article.button_border_radius || "8");
  };

  const handleSave = async () => {
    if (!slug.trim()) {
      alert("O slug é obrigatório!");
      return;
    }

    setSaveStatus("saving");
    try {
      const articleData = {
        title,
        excerpt,
        image,
        content,
        date,
        slug,
        category,
        title_font_size: titleFontSize,
        title_color: titleColor,
        excerpt_font_size: excerptFontSize,
        excerpt_color: excerptColor,
        show_button: showButton,
        button_text: buttonText,
        button_bg_color: buttonBgColor,
        button_text_color: buttonTextColor,
        button_font_size: buttonFontSize,
        button_border_radius: buttonBorderRadius,
        updated_at: new Date().toISOString(),
      };

      if (selectedArticle?.id) {
        // Update existing
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", selectedArticle.id);

        if (error) throw error;
      } else {
        // Create new - check if slug already exists
        const { data: existing } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", slug)
          .single();

        if (existing) {
          alert(
            "Já existe um artigo com este slug. Por favor, use um slug diferente."
          );
          setSaveStatus("error");
          setTimeout(() => setSaveStatus("idle"), 2000);
          return;
        }

        const { error } = await supabase.from("articles").insert([articleData]);

        if (error) throw error;
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
      await loadArticles();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      if (
        errorMessage.includes("duplicate key") ||
        errorMessage.includes("23505")
      ) {
        alert(
          "Este slug já está em uso. Por favor, escolha um slug diferente."
        );
      } else {
        alert(`Erro ao salvar: ${errorMessage}`);
      }
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const createNewArticle = () => {
    setSelectedArticle(null);
    setTitle("");
    setExcerpt("");
    setImage("");
    setContent("");
    setDate(new Date().toISOString().split("T")[0]);
    setSlug("");
    setTitleFontSize("24");
    setTitleColor("#1e293b");
    setExcerptFontSize("14");
    setExcerptColor("#64748b");
    setBgColor("#ffffff");
    setBgOpacity("100");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar esquerda - Lista de artigos */}
      <div className="lg:col-span-1 space-y-6">
        {/* Lista de artigos */}
        <div className="bg-[#252526] rounded-lg p-4 border border-[#2d2d30]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#cccccc]">Artigos</h3>
            <button
              onClick={createNewArticle}
              className="px-3 py-1 bg-[#4fc3f7] text-[#1e1e1e] rounded hover:bg-[#03a9f4] transition text-sm"
            >
              + Novo
            </button>
          </div>

          {isLoading ? (
            <div className="text-center text-[#858585] py-4">Carregando...</div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleArticleSelect(article)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedArticle?.id === article.id
                      ? "bg-[#4fc3f7]/20 border border-[#4fc3f7]"
                      : "bg-[#2d2d30] hover:bg-[#3c3c3c] border border-transparent"
                  }`}
                >
                  <div className="text-sm font-medium text-[#cccccc] truncate">
                    {article.title}
                  </div>
                  <div className="text-xs text-[#858585] mt-1">
                    {new Date(article.date ?? "").toLocaleDateString("pt-BR")}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Coluna do meio - Editor + Preview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Card Preview */}
        <div className="bg-[#252526] rounded-lg p-4 border border-[#2d2d30]">
          <h3 className="text-sm font-semibold text-[#cccccc] mb-3">
            Preview do Card
          </h3>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg relative h-[500px]">
            {image && (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: `${bgColor}${Math.round(
                    (parseInt(bgOpacity) / 100) * 255
                  )
                    .toString(16)
                    .padStart(2, "0")}`,
                }}
              >
                <h4
                  style={{
                    fontSize: `${titleFontSize}px`,
                    color: titleColor,
                  }}
                  className="font-bold mb-1 line-clamp-2"
                >
                  {title || "Título do artigo"}
                </h4>
                {excerpt && (
                  <p
                    style={{
                      fontSize: `${excerptFontSize}px`,
                      color: excerptColor,
                    }}
                    className="line-clamp-2 mb-2"
                  >
                    {excerpt}
                  </p>
                )}
                {showButton && (
                  <button
                    style={{
                      backgroundColor: buttonBgColor,
                      color: buttonTextColor,
                      fontSize: `${buttonFontSize}px`,
                      borderRadius: `${buttonBorderRadius}px`,
                    }}
                    className="mt-2 px-4 py-2 font-semibold transition-opacity hover:opacity-90"
                  >
                    {buttonText || "Ver mais"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-[#858585] mt-2 text-center">
            Preview exato de como aparecerá nas páginas
          </p>
        </div>
        {/* Formulário */}
        <div className="bg-[#252526] rounded-lg p-6 border border-[#2d2d30] space-y-4">
          <h3 className="text-lg font-semibold text-[#cccccc] mb-4 flex items-center gap-2">
            <FileText size={20} />
            Informações do Artigo
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-2 flex items-center gap-2">
                <Upload size={16} />
                Imagem do Card
              </label>
              <ImageUpload
                currentImageUrl={image}
                onUploadComplete={setImage}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-2">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                placeholder="url-do-artigo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-2">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">
              Descrição/Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
            />
          </div>

          {/* Style Controls */}
          <div className="border-t border-[#2d2d30] pt-4 mt-4">
            <h4 className="text-md font-semibold text-[#cccccc] mb-3 flex items-center gap-2">
              <Palette size={18} />
              Estilo do Card
            </h4>

            {/* Background Color */}
            <div className="mb-4 p-4 bg-[#2d2d30] rounded">
              <h5 className="text-sm font-semibold text-[#cccccc] mb-3">
                Cor de Fundo do Card
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#cccccc] mb-2 flex items-center gap-2">
                    <Palette size={12} />
                    Cor de Fundo
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 bg-[#3c3c3c] border border-[#3e3e42] rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#cccccc] mb-2">
                    Opacidade (%)
                  </label>
                  <input
                    type="number"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Title Style */}
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-[#cccccc] mb-3 flex items-center gap-2">
                <Type size={16} />
                Estilo do Título
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#cccccc] mb-2">
                    Tamanho da fonte (px)
                  </label>
                  <input
                    type="number"
                    value={titleFontSize}
                    onChange={(e) => setTitleFontSize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                    min="12"
                    max="48"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#cccccc] mb-2 flex items-center gap-2">
                    <Palette size={12} />
                    Cor
                  </label>
                  <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    className="w-full h-10 bg-[#3c3c3c] border border-[#3e3e42] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Description Style */}
            <div>
              <h5 className="text-sm font-semibold text-[#cccccc] mb-3 flex items-center gap-2">
                <Type size={16} />
                Estilo da Descrição
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#cccccc] mb-2">
                    Tamanho da fonte (px)
                  </label>
                  <input
                    type="number"
                    value={excerptFontSize}
                    onChange={(e) => setExcerptFontSize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                    min="10"
                    max="24"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#cccccc] mb-2 flex items-center gap-2">
                    <Palette size={12} />
                    Cor
                  </label>
                  <input
                    type="color"
                    value={excerptColor}
                    onChange={(e) => setExcerptColor(e.target.value)}
                    className="w-full h-10 bg-[#3c3c3c] border border-[#3e3e42] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Button Configuration */}
            <div className="border-t border-[#2d2d30] pt-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-[#cccccc] flex items-center gap-2">
                  Botão de Ação
                </h5>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showButton}
                    onChange={(e) => setShowButton(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-[#cccccc]">Mostrar botão</span>
                </label>
              </div>

              {showButton && (
                <div className="space-y-4 pl-4 border-l-2 border-[#4fc3f7]/30">
                  <div>
                    <label className="block text-xs text-[#cccccc] mb-2">
                      Texto do botão
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                      placeholder="Ver mais"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#cccccc] mb-2 flex items-center gap-2">
                        <Palette size={12} />
                        Cor de fundo
                      </label>
                      <input
                        type="color"
                        value={buttonBgColor}
                        onChange={(e) => setButtonBgColor(e.target.value)}
                        className="w-full h-10 bg-[#3c3c3c] border border-[#3e3e42] rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#cccccc] mb-2 flex items-center gap-2">
                        <Palette size={12} />
                        Cor do texto
                      </label>
                      <input
                        type="color"
                        value={buttonTextColor}
                        onChange={(e) => setButtonTextColor(e.target.value)}
                        className="w-full h-10 bg-[#3c3c3c] border border-[#3e3e42] rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#cccccc] mb-2">
                        Tamanho da fonte (px)
                      </label>
                      <input
                        type="number"
                        value={buttonFontSize}
                        onChange={(e) => setButtonFontSize(e.target.value)}
                        className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                        min="10"
                        max="24"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#cccccc] mb-2">
                        Arredondamento (px)
                      </label>
                      <input
                        type="number"
                        value={buttonBorderRadius}
                        onChange={(e) => setButtonBorderRadius(e.target.value)}
                        className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="border-t border-[#2d2d30] pt-4">
            <label className="block text-sm font-medium text-[#cccccc] mb-2">
              Conteúdo do Artigo (MDX)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] font-mono text-sm focus:ring-2 focus:ring-[#4fc3f7]"
              placeholder="# Título do Artigo&#10;&#10;Conteúdo em markdown..."
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="w-full px-6 py-3 bg-[#4fc3f7] text-[#1e1e1e] font-semibold rounded-lg hover:bg-[#03a9f4] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {saveStatus === "saving"
              ? "Salvando..."
              : saveStatus === "success"
              ? "Salvo com sucesso!"
              : "Salvar Artigo"}
          </button>

          {saveStatus === "error" && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
              Erro ao salvar. Tente novamente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

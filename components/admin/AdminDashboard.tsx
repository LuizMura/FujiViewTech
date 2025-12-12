"use client";
import { useState, useEffect } from "react";
import { useHero } from "@/context/HeroContext";
import ImageUpload from "@/components/ImageUpload";
import RelatedProductsManager from "@/components/RelatedProductsManager";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Save,
  Check,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";

interface Article {
  slug: string;
  filename: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  frontmatter: Record<string, unknown>;
  contentLength: number;
}

export default function AdminDashboard() {
  const {
    heroContent,
    topCard,
    bottomCard,
    saveAll,
    refreshData,
    isSaving,
    saveError,
  } = useHero();

  const [localHeroContent, setLocalHeroContent] = useState(heroContent);
  const [localTopCard, setLocalTopCard] = useState(topCard);
  const [localBottomCard, setLocalBottomCard] = useState(bottomCard);
  const [mainTab, setMainTab] = useState<"hero" | "content" | "products">(
    "hero"
  );
  const [heroTab, setHeroTab] = useState<"hero" | "topCard" | "bottomCard">(
    "hero"
  );
  const [contentTab, setContentTab] = useState<
    "reviews" | "noticias" | "tutoriais"
  >("reviews");
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Content management states
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<{
    slug: string;
    frontmatter: Record<string, string>;
    content: string;
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  // Related Products states
  const [selectedArticleForProducts, setSelectedArticleForProducts] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Sync local state with context when hero data changes
  useEffect(() => {
    setLocalHeroContent(heroContent);
  }, [heroContent]);

  useEffect(() => {
    setLocalTopCard(topCard);
  }, [topCard]);

  useEffect(() => {
    setLocalBottomCard(bottomCard);
  }, [bottomCard]);

  const handleSave = async () => {
    // Salva tudo de uma vez com os valores locais atuais
    await saveAll(localHeroContent, localTopCard, localBottomCard);

    // Recarrega os dados do servidor
    await refreshData();

    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  // Content management functions
  useEffect(() => {
    if (mainTab === "content") {
      loadArticles();
    }
  }, [mainTab, contentTab]);

  const loadArticles = async () => {
    setIsLoadingArticles(true);
    try {
      const response = await fetch(`/api/content?category=${contentTab}`);
      const data = await response.json();
      setArticles(data.files || []);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const loadArticleForEdit = async (slug: string) => {
    try {
      const response = await fetch(
        `/api/content/${slug}?category=${contentTab}`
      );
      const data = await response.json();
      setCurrentArticle(data);
      setIsEditing(true);
    } catch (error) {
      console.error("Error loading article:", error);
    }
  };

  const createNewArticle = () => {
    const now = new Date().toISOString().split("T")[0];
    setCurrentArticle({
      slug: "",
      frontmatter: {
        title: "",
        description: "",
        date: now,
        category: contentTab,
        image: "",
        author: "FujiViewTech",
        readTime: "5 min",
      },
      content: "",
    });
    setIsEditing(true);
  };

  const saveArticle = async () => {
    if (!currentArticle) return;

    setSaveStatus("saving");

    try {
      const slug =
        currentArticle.slug ||
        currentArticle.frontmatter.title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        "novo-artigo";

      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: contentTab,
          slug,
          frontmatter: currentArticle.frontmatter,
          content: currentArticle.content,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setSaveStatus("success");
      setTimeout(() => {
        setSaveStatus("idle");
        setIsEditing(false);
        setCurrentArticle(null);
        loadArticles();
      }, 1500);
    } catch (error) {
      console.error("Error saving article:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const deleteArticle = async (slug: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;

    try {
      const response = await fetch(
        `/api/content?category=${contentTab}&slug=${slug}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      loadArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] rounded-lg shadow-2xl overflow-y-auto scrollbar-hide scrollbar-hide flex flex-col">
      {/* Header with Title, Tabs and Logout */}
      <div className="flex items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-6 py-3">
        <h1 className="text-xl font-bold text-[#cccccc]">Admin Dashboard</h1>

        {/* Main Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setMainTab("hero")}
            className={`px-4 py-2 text-sm font-bold transition-all ${
              mainTab === "hero"
                ? "bg-[#1e1e1e] text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                : "text-[#969696] hover:text-[#cccccc] hover:bg-[#2d2d30]"
            }`}
          >
            🎨 Hero
          </button>
          <button
            onClick={() => setMainTab("content")}
            className={`px-4 py-2 text-sm font-bold transition-all ${
              mainTab === "content"
                ? "bg-[#1e1e1e] text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                : "text-[#969696] hover:text-[#cccccc] hover:bg-[#2d2d30]"
            }`}
          >
            📝 Content
          </button>
          <button
            onClick={() => setMainTab("products")}
            className={`px-4 py-2 text-sm font-bold transition-all ${
              mainTab === "products"
                ? "bg-[#1e1e1e] text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                : "text-[#969696] hover:text-[#cccccc] hover:bg-[#2d2d30]"
            }`}
          >
            🛍️ Products
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => (window.location.href = "/api/auth/logout")}
          className="px-4 py-2 bg-[#f48771] text-[#1e1e1e] text-sm font-semibold rounded hover:bg-[#ff6b6b] transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Hero Section Tab Content */}
      {mainTab === "hero" && (
        <div className="flex-1 p-6 bg-[#1e1e1e] overflow-y-auto scrollbar-hide scrollbar-hide">
          {/* Hero Sub-Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[#2d2d30]">
            <button
              onClick={() => setHeroTab("hero")}
              className={`px-4 py-3 text-sm font-semibold transition-all ${
                heroTab === "hero"
                  ? "bg-[#1e1e1e] text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                  : "text-[#969696] hover:text-[#cccccc]"
              }`}
            >
              Hero Principal
            </button>
            <button
              onClick={() => setHeroTab("topCard")}
              className={`px-4 py-3 text-sm font-semibold transition-all ${
                heroTab === "topCard"
                  ? "bg-[#1e1e1e] text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                  : "text-[#969696] hover:text-[#cccccc]"
              }`}
            >
              Card Superior
            </button>
            <button
              onClick={() => setHeroTab("bottomCard")}
              className={`px-4 py-3 text-sm font-semibold transition-all ${
                heroTab === "bottomCard"
                  ? "bg-[#1e1e1e] text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                  : "text-[#969696] hover:text-[#cccccc]"
              }`}
            >
              Card Inferior
            </button>
          </div>

          {/* Hero Principal Tab */}
          {heroTab === "hero" && (
            <div className="flex gap-6 h-[calc(100%-60px)]">
              {/* Preview - Lado Esquerdo */}
              <div className="w-1/2 border-r border-[#2d2d30] pr-6 overflow-y-auto scrollbar-hide scrollbar-hide">
                <h3 className="text-lg font-bold text-[#cccccc] mb-4">
                  Preview
                </h3>

                {/* Hero Preview com imagem de fundo */}
                <div className="relative h-[28rem] rounded-2xl overflow-y-auto scrollbar-hide scrollbar-hide shadow-2xl">
                  {/* Background Image */}
                  {localHeroContent.imageUrl && (
                    <div className="absolute inset-0 w-full h-full">
                      <img
                        src={localHeroContent.imageUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90"></div>
                    </div>
                  )}

                  {/* Content sobreposto */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                    {/* Badge */}
                    {localHeroContent.badge && (
                      <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                        {localHeroContent.badge}
                      </span>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                      {localHeroContent.mainTitle}
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                        {localHeroContent.gradientTitle}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-slate-300 mb-6 font-light max-w-xl leading-relaxed">
                      {localHeroContent.description}
                    </p>

                    {/* Button */}
                    {localHeroContent.buttonText && (
                      <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg">
                        {localHeroContent.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulário - Lado Direito */}
              <div className="w-1/2 overflow-y-auto scrollbar-hide scrollbar-hide relative h-full">
                <div className="space-y-6 pb-24">
                  <h3 className="text-lg font-bold text-[#cccccc] mb-4">
                    Editar Hero Principal
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Badge
                    </label>
                    <input
                      type="text"
                      value={localHeroContent.badge}
                      onChange={(e) =>
                        setLocalHeroContent({
                          ...localHeroContent,
                          badge: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={localHeroContent.mainTitle}
                      onChange={(e) =>
                        setLocalHeroContent({
                          ...localHeroContent,
                          mainTitle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Título Gradiente
                    </label>
                    <input
                      type="text"
                      value={localHeroContent.gradientTitle}
                      onChange={(e) =>
                        setLocalHeroContent({
                          ...localHeroContent,
                          gradientTitle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={localHeroContent.description}
                      onChange={(e) =>
                        setLocalHeroContent({
                          ...localHeroContent,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={localHeroContent.buttonText}
                      onChange={(e) =>
                        setLocalHeroContent({
                          ...localHeroContent,
                          buttonText: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Link do Botão
                    </label>
                    <input
                      type="text"
                      value={localHeroContent.buttonLink}
                      onChange={(e) =>
                        setLocalHeroContent({
                          ...localHeroContent,
                          buttonLink: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Imagem (1200x700px recomendado)
                    </label>
                    <ImageUpload
                      currentImageUrl={localHeroContent.imageUrl}
                      onUploadComplete={(url) =>
                        setLocalHeroContent({
                          ...localHeroContent,
                          imageUrl: url,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Save Button - Sticky Bottom */}
                <div className="sticky bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d30] p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#569cd6] to-[#4fc3f7] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={20} />
                      {isSaving ? "Salvando..." : "Salvar Mudanças"}
                    </button>
                    {showSaveNotification && (
                      <div className="flex items-center gap-2 text-[#4ec9b0] font-semibold">
                        <Check size={20} />
                        Salvo com sucesso!
                      </div>
                    )}
                    {saveError && (
                      <div className="flex items-center gap-2 text-[#f48771] font-semibold">
                        <AlertCircle size={20} />
                        Erro ao salvar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Card Tab */}
          {heroTab === "topCard" && (
            <div className="flex gap-6 h-[calc(100%-60px)]">
              {/* Preview - Lado Esquerdo */}
              <div className="w-1/2 border-r border-[#2d2d30] pr-6 overflow-y-auto scrollbar-hide scrollbar-hide">
                <h3 className="text-lg font-bold text-[#cccccc] mb-4">
                  Preview
                </h3>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                  <div className="bg-white rounded-lg overflow-y-auto scrollbar-hide scrollbar-hide shadow-lg max-w-sm">
                    {localTopCard.imageUrl && (
                      <img
                        src={localTopCard.imageUrl}
                        alt="Top Card"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      {localTopCard.category && (
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                          {localTopCard.category}
                        </span>
                      )}
                      {localTopCard.title && (
                        <h3 className="text-lg font-bold text-slate-900 mt-2">
                          {localTopCard.title}
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário - Lado Direito */}
              <div className="w-1/2 overflow-y-auto scrollbar-hide scrollbar-hide relative h-full">
                <div className="space-y-6 pb-24">
                  <h3 className="text-lg font-bold text-[#cccccc] mb-4">
                    Editar Card Superior
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={localTopCard.category}
                      onChange={(e) =>
                        setLocalTopCard({
                          ...localTopCard,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={localTopCard.title}
                      onChange={(e) =>
                        setLocalTopCard({
                          ...localTopCard,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Link
                    </label>
                    <input
                      type="text"
                      value={localTopCard.link}
                      onChange={(e) =>
                        setLocalTopCard({
                          ...localTopCard,
                          link: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Imagem (600x500px recomendado)
                    </label>
                    <ImageUpload
                      currentImageUrl={localTopCard.imageUrl}
                      onUploadComplete={(url) =>
                        setLocalTopCard({ ...localTopCard, imageUrl: url })
                      }
                    />
                  </div>
                </div>

                {/* Save Button - Sticky Bottom */}
                <div className="sticky bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d30] p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#569cd6] to-[#4fc3f7] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={20} />
                      {isSaving ? "Salvando..." : "Salvar Mudanças"}
                    </button>
                    {showSaveNotification && (
                      <div className="flex items-center gap-2 text-[#4ec9b0] font-semibold">
                        <Check size={20} />
                        Salvo com sucesso!
                      </div>
                    )}
                    {saveError && (
                      <div className="flex items-center gap-2 text-[#f48771] font-semibold">
                        <AlertCircle size={20} />
                        Erro ao salvar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Card Tab */}
          {heroTab === "bottomCard" && (
            <div className="flex gap-6 h-[calc(100%-60px)]">
              {/* Preview - Lado Esquerdo */}
              <div className="w-1/2 border-r border-[#2d2d30] pr-6 overflow-y-auto scrollbar-hide scrollbar-hide">
                <h3 className="text-lg font-bold text-[#cccccc] mb-4">
                  Preview
                </h3>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                  <div className="bg-white rounded-lg overflow-y-auto scrollbar-hide scrollbar-hide shadow-lg max-w-sm">
                    {localBottomCard.imageUrl && (
                      <img
                        src={localBottomCard.imageUrl}
                        alt="Bottom Card"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      {localBottomCard.category && (
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                          {localBottomCard.category}
                        </span>
                      )}
                      {localBottomCard.title && (
                        <h3 className="text-lg font-bold text-slate-900 mt-2">
                          {localBottomCard.title}
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário - Lado Direito */}
              <div className="w-1/2 overflow-y-auto scrollbar-hide scrollbar-hide relative h-full">
                <div className="space-y-6 pb-24">
                  <h3 className="text-lg font-bold text-[#cccccc] mb-4">
                    Editar Card Inferior
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={localBottomCard.category}
                      onChange={(e) =>
                        setLocalBottomCard({
                          ...localBottomCard,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={localBottomCard.title}
                      onChange={(e) =>
                        setLocalBottomCard({
                          ...localBottomCard,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Link
                    </label>
                    <input
                      type="text"
                      value={localBottomCard.link}
                      onChange={(e) =>
                        setLocalBottomCard({
                          ...localBottomCard,
                          link: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Imagem (600x500px recomendado)
                    </label>
                    <ImageUpload
                      currentImageUrl={localBottomCard.imageUrl}
                      onUploadComplete={(url) =>
                        setLocalBottomCard({
                          ...localBottomCard,
                          imageUrl: url,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Save Button - Sticky Bottom */}
                <div className="sticky bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d30] p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#569cd6] to-[#4fc3f7] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={20} />
                      {isSaving ? "Salvando..." : "Salvar Mudanças"}
                    </button>
                    {showSaveNotification && (
                      <div className="flex items-center gap-2 text-[#4ec9b0] font-semibold">
                        <Check size={20} />
                        Salvo com sucesso!
                      </div>
                    )}
                    {saveError && (
                      <div className="flex items-center gap-2 text-[#f48771] font-semibold">
                        <AlertCircle size={20} />
                        Erro ao salvar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Management Tab Content */}
      {mainTab === "content" && (
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide scrollbar-hide">
          {/* Content Sub-Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[#2d2d30]">
            <button
              onClick={() => setContentTab("reviews")}
              className={`px-4 py-3 text-sm font-semibold transition-all ${
                contentTab === "reviews"
                  ? "bg-[#264f78] text-[#4fc3f7] border-b-2 border-indigo-600"
                  : "text-[#969696] hover:text-[#cccccc]"
              }`}
            >
              📱 Reviews
            </button>
            <button
              onClick={() => setContentTab("noticias")}
              className={`px-4 py-3 text-sm font-semibold transition-all ${
                contentTab === "noticias"
                  ? "bg-[#264f78] text-[#4fc3f7] border-b-2 border-indigo-600"
                  : "text-[#969696] hover:text-[#cccccc]"
              }`}
            >
              📰 Notícias
            </button>
            <button
              onClick={() => setContentTab("tutoriais")}
              className={`px-4 py-3 text-sm font-semibold transition-all ${
                contentTab === "tutoriais"
                  ? "bg-[#264f78] text-[#4fc3f7] border-b-2 border-indigo-600"
                  : "text-[#969696] hover:text-[#cccccc]"
              }`}
            >
              🎓 Tutoriais
            </button>
          </div>

          {/* Editing Mode */}
          {isEditing && currentArticle ? (
            <div className="flex gap-6 h-[calc(100%-60px)]">
              {/* Preview - Lado Esquerdo */}
              <div className="w-1/2 bg-white border border-slate-200 rounded-lg overflow-y-auto scrollbar-hide scrollbar-hide">
                <div className="sticky top-0 bg-slate-100 border-b border-slate-200 p-4 z-10">
                  <h3 className="text-lg font-bold text-slate-900">
                    Preview do Artigo
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Visualização em tempo real
                  </p>
                </div>

                <div className="p-6 prose prose-slate max-w-none">
                  {/* Header Preview */}
                  <div className="not-prose mb-8">
                    {currentArticle.frontmatter.image && (
                      <img
                        src={currentArticle.frontmatter.image}
                        alt={currentArticle.frontmatter.title || "Preview"}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {currentArticle.frontmatter.title || "Título do Artigo"}
                    </h1>
                    <p className="text-slate-600 mb-4">
                      {currentArticle.frontmatter.description ||
                        "Descrição do artigo..."}
                    </p>
                    <div className="flex gap-4 text-sm text-slate-500">
                      <span>
                        📅 {currentArticle.frontmatter.date || "Data"}
                      </span>
                      <span>
                        ⏱️{" "}
                        {currentArticle.frontmatter.readTime ||
                          "Tempo de leitura"}
                      </span>
                      <span>
                        ✍️ {currentArticle.frontmatter.author || "Autor"}
                      </span>
                    </div>
                  </div>

                  {/* Content Preview - Markdown Renderizado */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-3xl font-bold text-[#cccccc] mb-4"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-2xl font-bold text-[#cccccc] mb-3"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-xl font-bold text-[#cccccc] mb-2"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className="text-slate-700 mb-4 leading-relaxed"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-[#4fc3f7] hover:underline"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-bold text-[#cccccc]"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc list-inside mb-4 text-slate-700"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside mb-4 text-slate-700"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-indigo-500 pl-4 italic text-[#969696] mb-4"
                          {...props}
                        />
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-[#2d2d30] px-2 py-1 rounded text-sm font-mono text-slate-800"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {currentArticle.content ||
                      "# Seu conteúdo MDX aparecerá aqui...\n\nComece a digitar para ver o preview renderizado!"}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Formulário - Lado Direito */}
              <div className="w-1/2 overflow-y-auto scrollbar-hide scrollbar-hide relative h-full">
                <div className="space-y-6 pb-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#cccccc]">
                      {currentArticle.slug ? "Editar Artigo" : "Novo Artigo"}
                    </h3>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setCurrentArticle(null);
                      }}
                      className="text-[#969696] hover:text-[#cccccc]"
                    >
                      ← Voltar
                    </button>
                  </div>

                  {/* Frontmatter Fields */}
                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={currentArticle.frontmatter.title || ""}
                      onChange={(e) =>
                        setCurrentArticle({
                          ...currentArticle,
                          frontmatter: {
                            ...currentArticle.frontmatter,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={currentArticle.frontmatter.description || ""}
                      onChange={(e) =>
                        setCurrentArticle({
                          ...currentArticle,
                          frontmatter: {
                            ...currentArticle.frontmatter,
                            description: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                        Data
                      </label>
                      <input
                        type="date"
                        value={currentArticle.frontmatter.date || ""}
                        onChange={(e) =>
                          setCurrentArticle({
                            ...currentArticle,
                            frontmatter: {
                              ...currentArticle.frontmatter,
                              date: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                        Tempo de Leitura
                      </label>
                      <input
                        type="text"
                        value={currentArticle.frontmatter.readTime || ""}
                        onChange={(e) =>
                          setCurrentArticle({
                            ...currentArticle,
                            frontmatter: {
                              ...currentArticle.frontmatter,
                              readTime: e.target.value,
                            },
                          })
                        }
                        placeholder="5 min"
                        className="w-full px-4 py-2 border border-[#3e3e42] rounded-lg text-[#cccccc] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                        Upload Image
                      </label>
                      <ImageUpload
                        currentImageUrl=""
                        onUploadComplete={(url) =>
                          setCurrentArticle({
                            ...currentArticle,
                            frontmatter: {
                              ...currentArticle.frontmatter,
                              image: url,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#cccccc] mb-2">
                      Conteúdo MDX
                    </label>
                    <textarea
                      value={currentArticle.content}
                      onChange={(e) =>
                        setCurrentArticle({
                          ...currentArticle,
                          content: e.target.value,
                        })
                      }
                      rows={15}
                      className="w-full px-4 py-3 border border-[#3e3e42] rounded-lg text-[#cccccc] font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="# Seu conteúdo em MDX aqui..."
                    />
                  </div>

                  {/* Save Button - Sticky Bottom */}
                  <div className="sticky bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d30] p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={saveArticle}
                        disabled={saveStatus === "saving"}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#569cd6] to-[#4fc3f7] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={20} />
                        {saveStatus === "saving"
                          ? "Salvando..."
                          : "Salvar Artigo"}
                      </button>
                      {saveStatus === "success" && (
                        <div className="flex items-center gap-2 text-[#4ec9b0] font-semibold">
                          <Check size={20} />
                          Salvo com sucesso!
                        </div>
                      )}
                      {saveStatus === "error" && (
                        <div className="flex items-center gap-2 text-[#f48771] font-semibold">
                          <AlertCircle size={20} />
                          Erro ao salvar
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* List Mode */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#cccccc]">
                  Artigos em{" "}
                  {contentTab === "reviews"
                    ? "Reviews"
                    : contentTab === "noticias"
                    ? "Notícias"
                    : "Tutoriais"}
                </h3>
                <button
                  onClick={createNewArticle}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#569cd6] to-[#4fc3f7] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus size={18} />
                  Novo Artigo
                </button>
              </div>

              {isLoadingArticles ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12 text-[#858585]">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhum artigo encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article.slug}
                      className="flex items-center justify-between p-4 bg-[#252526] rounded-lg hover:bg-[#2d2d30] transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#cccccc]">
                          {article.title}
                        </h4>
                        <p className="text-sm text-[#969696] mt-1">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-[#858585]">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.contentLength} chars</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadArticleForEdit(article.slug)}
                          className="p-2 text-[#4fc3f7] hover:bg-[#264f78] rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteArticle(article.slug)}
                          className="p-2 text-[#f48771] hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Related Products Tab Content */}
      {mainTab === "products" && (
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide scrollbar-hide">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#cccccc] mb-2">
              Gerenciar Produtos Relacionados
            </h2>
            <p className="text-[#969696]">
              Adicione produtos relacionados que serão exibidos automaticamente
              no final dos artigos
            </p>
          </div>

          {!selectedArticleForProducts ? (
            <div className="space-y-4">
              <div className="flex gap-2 mb-6 border-b border-[#2d2d30]">
                <button
                  onClick={() => setContentTab("reviews")}
                  className={`px-4 py-3 text-sm font-semibold transition-all ${
                    contentTab === "reviews"
                      ? "bg-[#264f78] text-[#4fc3f7] border-b-2 border-indigo-600"
                      : "text-[#969696] hover:text-[#cccccc]"
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setContentTab("noticias")}
                  className={`px-4 py-3 text-sm font-semibold transition-all ${
                    contentTab === "noticias"
                      ? "bg-[#264f78] text-[#4fc3f7] border-b-2 border-indigo-600"
                      : "text-[#969696] hover:text-[#cccccc]"
                  }`}
                >
                  Notícias
                </button>
                <button
                  onClick={() => setContentTab("tutoriais")}
                  className={`px-4 py-3 text-sm font-semibold transition-all ${
                    contentTab === "tutoriais"
                      ? "bg-[#264f78] text-[#4fc3f7] border-b-2 border-indigo-600"
                      : "text-[#969696] hover:text-[#cccccc]"
                  }`}
                >
                  Tutoriais
                </button>
              </div>

              <div className="bg-[#264f78] border border-indigo-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-indigo-800">
                  💡 Selecione um artigo abaixo para gerenciar seus produtos
                  relacionados
                </p>
              </div>

              {isLoadingArticles ? (
                <div className="text-center py-8 text-[#969696]">
                  Carregando artigos...
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8 text-[#858585]">
                  Nenhum artigo encontrado em {contentTab}
                </div>
              ) : (
                <div className="grid gap-4">
                  {articles.map((article) => (
                    <div
                      key={article.slug}
                      className="flex items-center justify-between p-4 bg-[#1e1e1e] border border-[#2d2d30] rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#cccccc]">
                          {article.title}
                        </h3>
                        <p className="text-sm text-[#969696]">
                          {article.description}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedArticleForProducts({
                            id: article.slug,
                            title: article.title,
                          });
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Gerenciar Produtos
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedArticleForProducts(null)}
                className="text-sm text-[#4fc3f7] hover:text-indigo-700 mb-4"
              >
                ← Voltar para lista de artigos
              </button>
              <RelatedProductsManager
                articleId={selectedArticleForProducts.id}
                articleTitle={selectedArticleForProducts.title}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

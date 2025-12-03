"use client";

import React from "react";
import { useHero } from "@/context/HeroContext";
import ImageUpload from "./ImageUpload";
import {
  X,
  Save,
  Eye,
  Link2,
  Type,
  Image as ImageIcon,
  FileText,
  Tag,
  Tabs,
  Check,
  AlertCircle,
} from "lucide-react";

interface HeroDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HeroDashboard({ isOpen, onClose }: HeroDashboardProps) {
  const {
    heroContent,
    topCard,
    bottomCard,
    updateHeroContent,
    updateTopCard,
    updateBottomCard,
    isSaving,
    saveError,
  } = useHero();
  const [localHeroContent, setLocalHeroContent] = React.useState(heroContent);
  const [localTopCard, setLocalTopCard] = React.useState(topCard);
  const [localBottomCard, setLocalBottomCard] = React.useState(bottomCard);
  const [activeTab, setActiveTab] = React.useState<
    "hero" | "topCard" | "bottomCard"
  >("hero");
  const [showSaveNotification, setShowSaveNotification] = React.useState(false);

  React.useEffect(() => {
    setLocalHeroContent(heroContent);
  }, [heroContent]);

  React.useEffect(() => {
    setLocalTopCard(topCard);
  }, [topCard]);

  React.useEffect(() => {
    setLocalBottomCard(bottomCard);
  }, [bottomCard]);

  const handleChangeHero = (field: string, value: string) => {
    setLocalHeroContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeTopCard = (field: string, value: string) => {
    setLocalTopCard((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeBottomCard = (field: string, value: string) => {
    setLocalBottomCard((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateHeroContent(localHeroContent);
    updateTopCard(localTopCard);
    updateBottomCard(localBottomCard);
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Dashboard Panel */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-sky-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Hero Editor</h2>
            <p className="text-indigo-100 text-sm">
              Customize o conteúdo principal e cards
            </p>
          </div>
          <div className="flex items-center gap-3">
            {showSaveNotification && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium">
                <Check size={16} />
                Salvo!
              </div>
            )}
            {saveError && (
              <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium">
                <AlertCircle size={16} />
                Erro
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 bg-slate-50 border-b border-slate-200 flex gap-0">
          <button
            onClick={() => setActiveTab("hero")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "hero"
                ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hero Principal
          </button>
          <button
            onClick={() => setActiveTab("topCard")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "topCard"
                ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Card Superior
          </button>
          <button
            onClick={() => setActiveTab("bottomCard")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "bottomCard"
                ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Card Inferior
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === "hero" && (
            <>
              {/* Badge */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Tag size={16} className="text-indigo-600" />
                  Badge
                </label>
                <input
                  type="text"
                  value={localHeroContent.badge}
                  onChange={(e) => handleChangeHero("badge", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900"
                  placeholder="Ex: Destaque da Semana"
                />
              </div>

              {/* Main Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} className="text-indigo-600" />
                  Título Principal
                </label>
                <textarea
                  value={localHeroContent.mainTitle}
                  onChange={(e) =>
                    handleChangeHero("mainTitle", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none h-20 text-slate-900"
                  placeholder="Digite o título principal"
                />
              </div>

              {/* Gradient Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} className="text-sky-500" />
                  Título com Gradiente
                </label>
                <textarea
                  value={localHeroContent.gradientTitle}
                  onChange={(e) =>
                    handleChangeHero("gradientTitle", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none h-16 text-slate-900"
                  placeholder="Parte do título com gradiente"
                />
                <p className="text-xs text-slate-500">
                  Este texto será exibido com gradiente (indigo → sky)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText size={16} className="text-indigo-600" />
                  Descrição
                </label>
                <textarea
                  value={localHeroContent.description}
                  onChange={(e) =>
                    handleChangeHero("description", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none h-24 text-slate-900"
                  placeholder="Descrição do hero"
                />
              </div>

              {/* Button Text */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Eye size={16} className="text-indigo-600" />
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={localHeroContent.buttonText}
                  onChange={(e) =>
                    handleChangeHero("buttonText", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900"
                  placeholder="Ex: Ver Matéria Completa"
                />
              </div>

              {/* Button Link */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={16} className="text-indigo-600" />
                  Link do Botão
                </label>
                <input
                  type="text"
                  value={localHeroContent.buttonLink}
                  onChange={(e) =>
                    handleChangeHero("buttonLink", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900"
                  placeholder="Ex: /reviews/celulares-mais-vendidos"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <ImageIcon size={16} className="text-indigo-600" />
                  Upload de Imagem
                </label>
                <ImageUpload
                  onUploadComplete={(url) => handleChangeHero("imageUrl", url)}
                  currentImageUrl={localHeroContent.imageUrl}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ImageIcon size={16} className="text-indigo-600" />
                  URL da Imagem (Manual)
                </label>
                <p className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
                  📐 Tamanho recomendado: <strong>1200x700px</strong> (aspecto
                  16:9)
                </p>
                <input
                  type="text"
                  value={localHeroContent.imageUrl}
                  onChange={(e) => handleChangeHero("imageUrl", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900"
                  placeholder="Ex: /images/hero-image.jpg"
                />
                {localHeroContent.imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={localHeroContent.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={() => {
                        /* Handle error silently */
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Image Alt */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} className="text-indigo-600" />
                  Alt da Imagem
                </label>
                <input
                  type="text"
                  value={localHeroContent.imageAlt}
                  onChange={(e) => handleChangeHero("imageAlt", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900"
                  placeholder="Descrição para acessibilidade"
                />
              </div>
            </>
          )}

          {activeTab === "topCard" && (
            <>
              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Tag size={16} className="text-sky-500" />
                  Categoria
                </label>
                <input
                  type="text"
                  value={localTopCard.category}
                  onChange={(e) =>
                    handleChangeTopCard("category", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-900"
                  placeholder="Ex: Notícia"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} className="text-sky-500" />
                  Título
                </label>
                <textarea
                  value={localTopCard.title}
                  onChange={(e) => handleChangeTopCard("title", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none h-16 text-slate-900"
                  placeholder="Título do card"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <ImageIcon size={16} className="text-sky-500" />
                  Upload de Imagem
                </label>
                <ImageUpload
                  onUploadComplete={(url) =>
                    handleChangeTopCard("imageUrl", url)
                  }
                  currentImageUrl={localTopCard.imageUrl}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ImageIcon size={16} className="text-sky-500" />
                  URL da Imagem (Manual)
                </label>
                <p className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
                  📐 Tamanho recomendado: <strong>600x500px</strong> (aspecto
                  6:5)
                </p>
                <input
                  type="text"
                  value={localTopCard.imageUrl}
                  onChange={(e) =>
                    handleChangeTopCard("imageUrl", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-900"
                  placeholder="Ex: /images/post-image.jpg"
                />
                {localTopCard.imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={localTopCard.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={() => {
                        /* Handle error silently */
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Image Alt */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} className="text-sky-500" />
                  Alt da Imagem
                </label>
                <input
                  type="text"
                  value={localTopCard.imageAlt}
                  onChange={(e) =>
                    handleChangeTopCard("imageAlt", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-900"
                  placeholder="Descrição para acessibilidade"
                />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={16} className="text-sky-500" />
                  Link
                </label>
                <input
                  type="text"
                  value={localTopCard.link}
                  onChange={(e) => handleChangeTopCard("link", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-900"
                  placeholder="Ex: /noticias/exemplo"
                />
              </div>
            </>
          )}

          {activeTab === "bottomCard" && (
            <>
              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Tag size={16} className="text-emerald-500" />
                  Categoria
                </label>
                <input
                  type="text"
                  value={localBottomCard.category}
                  onChange={(e) =>
                    handleChangeBottomCard("category", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
                  placeholder="Ex: Tutorial"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} className="text-emerald-500" />
                  Título
                </label>
                <textarea
                  value={localBottomCard.title}
                  onChange={(e) =>
                    handleChangeBottomCard("title", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-16 text-slate-900"
                  placeholder="Título do card"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <ImageIcon size={16} className="text-emerald-500" />
                  Upload de Imagem
                </label>
                <ImageUpload
                  onUploadComplete={(url) =>
                    handleChangeBottomCard("imageUrl", url)
                  }
                  currentImageUrl={localBottomCard.imageUrl}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ImageIcon size={16} className="text-emerald-500" />
                  URL da Imagem (Manual)
                </label>
                <p className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
                  📐 Tamanho recomendado: <strong>600x500px</strong> (aspecto
                  6:5)
                </p>
                <input
                  type="text"
                  value={localBottomCard.imageUrl}
                  onChange={(e) =>
                    handleChangeBottomCard("imageUrl", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
                  placeholder="Ex: /images/post-image.jpg"
                />
                {localBottomCard.imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={localBottomCard.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={() => {
                        /* Handle error silently */
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Image Alt */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} className="text-emerald-500" />
                  Alt da Imagem
                </label>
                <input
                  type="text"
                  value={localBottomCard.imageAlt}
                  onChange={(e) =>
                    handleChangeBottomCard("imageAlt", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
                  placeholder="Descrição para acessibilidade"
                />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={16} className="text-emerald-500" />
                  Link
                </label>
                <input
                  type="text"
                  value={localBottomCard.link}
                  onChange={(e) =>
                    handleChangeBottomCard("link", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
                  placeholder="Ex: /tutoriais/exemplo"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            Fechar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Mudanças
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

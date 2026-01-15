"use client";
import { useEffect, useMemo, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import AdminHeader from "../AdminHeader";
import AfiliadosCard from "@/components/home/AfiliadosCard";

type AfiliadoProduto = {
  id?: string;
  imagem: string;
  imagens: string[];
  titulo: string;
  descricao: string;
  status: string;
  publicado_em: string;
  categoria: string;
  loja: string;
  preco: string;
  afiliado_url: string;
  button_text: string;
  button_color: string;
};

export default function AdminAfiliadosPage() {
  const emptyForm: AfiliadoProduto = useMemo(
    () => ({
      imagem: "",
      imagens: [],
      titulo: "",
      descricao: "",
      status: "published",
      publicado_em: "",
      categoria: "",
      loja: "",
      preco: "",
      afiliado_url: "",
      button_text: "COMPRAR",
      button_color: "#3b82f6",
    }),
    []
  );

  const [form, setForm] = useState<AfiliadoProduto>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<AfiliadoProduto[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<string>("");

  async function handleUploadImagem(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha no upload");
      setForm((prev) => ({ ...prev, imagem: data.url }));
      setMessage("Imagem enviada com sucesso");
    } catch (err: any) {
      setMessage(err?.message || "Erro ao enviar imagem");
    }
  }

  const categoriasSugeridas = useMemo(
    () => Array.from(new Set(produtos.map((p) => p.categoria).filter(Boolean))),
    [produtos]
  );

  const produtosFiltrados = useMemo(() => {
    if (!filterCategoria) return produtos;
    return produtos.filter((p) => p.categoria === filterCategoria);
  }, [produtos, filterCategoria]);

  const previewData = useMemo(() => {
    const imagens =
      form.imagens && form.imagens.length
        ? form.imagens
        : form.imagem
        ? [form.imagem]
        : [];
    const imagem = imagens[0] || "/images/og-default.png";
    const titulo = form.titulo || "Título do produto";
    const descricao =
      form.descricao || "Descrição breve do produto para preview.";
    const loja = form.loja || "Nome da Loja";
    const preco = form.preco || "R$ 0,00";
    return {
      imagem,
      imagens,
      titulo,
      descricao,
      loja,
      preco,
      afiliados: [
        {
          nome: "Afiliado",
          url: form.afiliado_url || "#",
          texto: form.button_text || "COMPRAR",
          cor: form.button_color || "#3b82f6",
        },
      ],
    };
  }, [form]);

  // Validação de URL/domínio permitido pelo next/image
  const allowedHosts = useMemo(
    () => [
      "jxcmxjmqcsxkxftblbrq.supabase.co",
      "images.unsplash.com",
      "example.com",
      "images.samsung.com",
      "m.media-amazon.com",
    ],
    []
  );

  const isValidImgInput = (s?: string) => {
    if (!s) return false;
    const v = s.trim();
    if (!v) return false;
    if (v.startsWith("/")) return true; // caminho público
    try {
      const url = new URL(v);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const getHostname = (s?: string): string | null => {
    if (!s) return null;
    const v = s.trim();
    if (!v || v.startsWith("/")) return null;
    try {
      return new URL(v).hostname;
    } catch {
      return null;
    }
  };

  const imagemValidation = useMemo(() => {
    const v = form.imagem?.trim() || "";
    if (!v)
      return {
        has: false,
        valid: true,
        allowed: true,
        host: null as string | null,
      };
    const valid = isValidImgInput(v);
    const host = getHostname(v);
    const allowed = !host || allowedHosts.includes(host);
    return { has: true, valid, allowed, host };
  }, [form.imagem, allowedHosts]);

  const imagensValidation = useMemo(() => {
    const lines = (form.imagens || [])
      .map((x) => (x || "").trim())
      .filter(Boolean);
    const details = lines.map((v) => {
      const valid = isValidImgInput(v);
      const host = getHostname(v);
      const allowed = !host || allowedHosts.includes(host);
      return { v, valid, allowed, host };
    });
    const invalidCount = details.filter((d) => !d.valid).length;
    const disallowedHosts = Array.from(
      new Set(
        details
          .filter((d) => d.valid && d.host && !d.allowed)
          .map((d) => d.host as string)
      )
    );
    return { details, invalidCount, disallowedHosts };
  }, [form.imagens, allowedHosts]);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/afiliados");
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao carregar afiliados");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof AfiliadoProduto, value: string) => {
    let next = value;
    if (key === "imagens") {
      const list = value
        .split(/\n+/)
        .map((v) => v.trim())
        .filter(Boolean);
      setForm((prev) => ({ ...prev, imagens: list }));
      return;
    }
    if (key === "preco") {
      // Remove tudo que não é dígito
      const digits = value.replace(/\D/g, "");

      // Se vazio, deixa vazio
      if (!digits) {
        setForm((prev) => ({ ...prev, preco: "" }));
        return;
      }

      // Converte para centavos (ex: "1000" = 1000 centavos = R$ 10,00)
      const cents = parseInt(digits, 10);
      const reais = Math.floor(cents / 100);
      const centavos = cents % 100;

      // Formata reais com separador de milhares
      const reaisFormatted = reais.toLocaleString("pt-BR");
      const centavosFormatted = centavos.toString().padStart(2, "0");

      next = `R$ ${reaisFormatted},${centavosFormatted}`;
    }
    setForm((prev) => ({ ...prev, [key]: next }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      // Validação dos campos obrigatórios da API
      const required: Array<keyof AfiliadoProduto> = [
        "titulo",
        "descricao",
        "categoria",
        "loja",
        "preco",
        "afiliado_url",
        "status",
      ];
      const missing = required.filter(
        (k) => !String((form as any)[k] || "").trim()
      );
      if (missing.length) {
        throw new Error(
          `Preencha os campos obrigatórios: ${missing.join(", ")}`
        );
      }

      // Auto-preenche imagem a partir da primeira da lista, se necessário
      const imagemFinal = form.imagem?.trim()
        ? form.imagem.trim()
        : (form.imagens?.[0] || "").trim();

      const method = selectedId ? "PUT" : "POST";
      // Envia apenas campos suportados pela API
      const basePayload = {
        titulo: form.titulo,
        descricao: form.descricao,
        categoria: form.categoria,
        loja: form.loja,
        preco: form.preco,
        afiliado_url: form.afiliado_url,
        status: form.status,
        publicado_em: form.publicado_em,
        imagem: imagemFinal || undefined,
      } as any;

      const payload = selectedId
        ? { id: selectedId, ...basePayload }
        : basePayload;
      const res = await fetch("/api/afiliados", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Erro ao salvar");
      }
      setMessage("Afiliado salvo com sucesso");
      setSelectedId(null);
      setForm(emptyForm);
      loadProdutos();
    } catch (error: any) {
      setMessage(error?.message || "Erro ao salvar afiliado");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: AfiliadoProduto) => {
    const published = item.publicado_em
      ? new Date(item.publicado_em).toISOString().slice(0, 16)
      : "";
    setSelectedId(item.id || null);
    setForm({
      ...emptyForm,
      ...item,
      publicado_em: published,
      imagens: item.imagens || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setMessage(null);
  };

  const fillPublishedNow = () => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISO = new Date(Date.now() - tzoffset).toISOString().slice(0, 16);
    setForm((prev) => ({ ...prev, publicado_em: localISO }));
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmDelete = confirm("Remover este afiliado?");
    if (!confirmDelete) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/afiliados?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Erro ao excluir");
      }
      setMessage("Afiliado removido");
      if (selectedId === id) {
        handleReset();
      }
      loadProdutos();
    } catch (error: any) {
      setMessage(error?.message || "Erro ao excluir afiliado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#bfc7d5]">
            {selectedId ? "Editar AfiliadosCard" : "Criar AfiliadosCard"}
          </h1>
          <button
            onClick={handleReset}
            className="text-sm text-[#bfc7d5] hover:text-white border border-[#3b4250] px-3 py-1 rounded"
          >
            Novo
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Coluna 1: Afiliados cadastrados */}
          <section className="bg-[#1d2027] border border-[#2c313c] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#bfc7d5]">
                Afiliados cadastrados
              </h2>
              <button
                onClick={loadProdutos}
                className="text-sm text-[#bfc7d5] hover:text-white border border-[#3b4250] px-3 py-1 rounded"
              >
                Recarregar
              </button>
            </div>
            <div className="mb-4">
              <select
                className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white text-sm"
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categoriasSugeridas.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <div className="text-[#9ca3af]">Carregando...</div>
            ) : !produtosFiltrados.length ? (
              <div className="text-[#9ca3af]">
                {filterCategoria
                  ? `Nenhum afiliado encontrado na categoria "${filterCategoria}".`
                  : "Nenhum afiliado encontrado."}
              </div>
            ) : (
              <div className="overflow-x-auto border border-[#2c313c] rounded-xl">
                <table className="min-w-full text-sm text-left text-[#cbd5e1]">
                  <thead className="bg-[#1a1e25] text-[#9ca3af]">
                    <tr>
                      <th className="px-4 py-3">Título</th>
                      <th className="px-4 py-3">Categoria</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosFiltrados.map((item) => (
                      <tr
                        key={item.id}
                        className={`border-t border-[#2c313c] cursor-pointer ${
                          selectedId === item.id
                            ? "bg-[#2a3040]"
                            : "hover:bg-[#1f2430]"
                        }`}
                        onClick={() => handleEdit(item)}
                      >
                        <td className="px-4 py-3 max-w-[150px] truncate">
                          {item.titulo}
                        </td>
                        <td className="px-4 py-3">{item.categoria}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="p-2 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="p-2 rounded bg-red-600 text-white hover:bg-red-500"
                            disabled={saving}
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Coluna 2: Preview */}
          <div className="bg-[#1d2027] border border-[#2c313c] rounded-xl p-6 text-[#d5deed] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Preview</h2>
              <span className="text-xs text-[#9ca3af]">
                Atualiza em tempo real
              </span>
            </div>
            <div className="bg-[#11151c] border border-[#2c313c] rounded-xl p-4 flex justify-center">
              <div className="w-full max-w-sm">
                <AfiliadosCard {...previewData} />
              </div>
            </div>
          </div>

          {/* Coluna 3: Formulário */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#1d2027] border border-[#2c313c] rounded-xl p-6 text-[#d5deed] space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Imagem (URL)</label>
                <input
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  value={form.imagem}
                  onChange={(e) => handleChange("imagem", e.target.value)}
                  placeholder="https://...jpg"
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#9ca3af]">
                    ou envie um arquivo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImagem(file);
                    }}
                    className="text-sm"
                  />
                </div>
                {imagemValidation.has && !imagemValidation.valid && (
                  <div className="text-xs text-red-400">
                    URL de imagem inválida.
                  </div>
                )}
                {imagemValidation.has &&
                  imagemValidation.valid &&
                  imagemValidation.host &&
                  !imagemValidation.allowed && (
                    <div className="text-xs text-amber-400">
                      Domínio não permitido pelo next/image (
                      {imagemValidation.host}). Adicione em next.config.ts e
                      reinicie.
                    </div>
                  )}
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm text-[#9ca3af]">
                  Imagens (uma por linha)
                </label>
                <textarea
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  rows={3}
                  value={form.imagens.join("\n")}
                  onChange={(e) => handleChange("imagens", e.target.value)}
                  placeholder={"https://...1.jpg\nhttps://...2.jpg"}
                />
                {imagensValidation.invalidCount > 0 && (
                  <div className="text-xs text-red-400">
                    {imagensValidation.invalidCount} URL(s) inválida(s) na
                    lista.
                  </div>
                )}
                {imagensValidation.disallowedHosts.length > 0 && (
                  <div className="text-xs text-amber-400">
                    Domínios não permitidos:{" "}
                    {imagensValidation.disallowedHosts.join(", ")}. Adicione em
                    next.config.ts e reinicie.
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Título</label>
                <input
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  value={form.titulo}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  placeholder="Nome do produto"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#9ca3af]">Descrição</label>
                <textarea
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  rows={2}
                  value={form.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  placeholder="Resumo curto"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Categoria</label>
                <input
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  value={form.categoria}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                  placeholder="Ex: Smartphones, Notebooks"
                  list="categoria-options"
                />
                <datalist id="categoria-options">
                  {categoriasSugeridas.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Loja</label>
                <input
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  value={form.loja}
                  onChange={(e) => handleChange("loja", e.target.value)}
                  placeholder="Nome da loja"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Preço</label>
                <input
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  value={form.preco}
                  onChange={(e) => handleChange("preco", e.target.value)}
                  placeholder="R$ 1.299,00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Status</label>
                <select
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="hidden">Oculto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Publicado em</label>
                <div className="flex gap-3">
                  <input
                    type="datetime-local"
                    className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                    value={form.publicado_em}
                    onChange={(e) =>
                      handleChange("publicado_em", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={fillPublishedNow}
                    className="px-3 py-2 text-sm rounded-lg bg-[#2f3542] text-white border border-[#3c4354] hover:bg-[#3a4050]"
                  >
                    Hoje
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <fieldset className="border border-[#2c313c] rounded-lg p-2">
                <legend className="px-2 text-sm text-[#9ca3af]">
                  Link de Afiliado
                </legend>
                <input
                  className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                  value={form.afiliado_url}
                  onChange={(e) => handleChange("afiliado_url", e.target.value)}
                  placeholder="URL de afiliado"
                />{" "}
                <div className="space-y-2">
                  <label className="text-sm text-[#9ca3af]">
                    Texto do Botão (padrão: COMPRAR)
                  </label>
                  <input
                    className="w-full bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                    value={form.button_text}
                    onChange={(e) =>
                      handleChange("button_text", e.target.value)
                    }
                    placeholder="COMPRAR"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#9ca3af]">Cor do Botão</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      className="h-10 w-20 rounded border border-[#2c313c] cursor-pointer"
                      value={form.button_color}
                      onChange={(e) =>
                        handleChange("button_color", e.target.value)
                      }
                    />
                    <input
                      className="flex-1 bg-[#11151c] border border-[#2c313c] rounded-lg px-3 py-2 text-white"
                      value={form.button_color}
                      onChange={(e) =>
                        handleChange("button_color", e.target.value)
                      }
                      placeholder="#ac3e3e"
                    />
                  </div>
                </div>{" "}
              </fieldset>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-lg"
              >
                {saving ? "Salvando..." : selectedId ? "Atualizar" : "Criar"}
              </button>
              {message && (
                <span className="text-sm text-[#9ca3af]">{message}</span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

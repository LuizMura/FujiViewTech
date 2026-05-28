import type React from "react";

export interface CardBase {
  title: string;
  image?: string;
  category?: string;
  [key: string]: unknown;
}

export interface Afiliado {
  id: string;
  titulo: string;
  categoria: string;
  button_text?: string;
  button_color?: string;
  afiliado_url?: string;
  afiliado1_url?: string;
  afiliado2_url?: string;
  imagem?: string;
  descricao?: string;
  loja?: string;
  preco?: string;
}

export interface ArticleFormProps<T extends CardBase> {
  form: T;
  cardType: string;
  onFormChange: (field: string, value: unknown) => void;
  onImageUpload: (url: string) => void;
  onMdxImageUpload: (url: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export type FieldConfig = {
  name: string;
  label: string;
  type: string;
  options?: string[];
};

export type EditorTab = "cover" | "templates" | "editor";

export type MdxConfig = {
  selectedTemplate: string;
  imageSide: "left" | "right";
  buttonText: string;
  buttonUrl: string;
  amazonUrl: string;
  mercadoLivreUrl: string;
};

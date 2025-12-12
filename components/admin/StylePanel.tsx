"use client";

import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import * as Switch from "@radix-ui/react-switch";
import * as Label from "@radix-ui/react-label";

// TODO: Move ArticleFormData to a shared types file and import here
type ArticleFormData = any;

interface StylePanelProps {
  register: UseFormRegister<ArticleFormData>;
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
  errors?: any;
}

export default function StylePanel({
  register,
  watch,
  setValue,
}: StylePanelProps) {
  const showButton = watch("showButton");

  return (
    <div className="space-y-8">
      {/* Título */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Estilos do Título
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor do Título
            </label>
            <div className="flex gap-2">
              <input
                {...register("titleColor")}
                type="color"
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                {...register("titleColor")}
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#1e293b"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho da Fonte
            </label>
            <div className="flex items-center gap-3">
              <input
                {...register("titleFontSize", { valueAsNumber: true })}
                type="range"
                min="12"
                max="48"
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12">
                {watch("titleFontSize")}px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📄 Estilos do Resumo
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor do Resumo
            </label>
            <div className="flex gap-2">
              <input
                {...register("excerptColor")}
                type="color"
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                {...register("excerptColor")}
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#64748b"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho da Fonte
            </label>
            <div className="flex items-center gap-3">
              <input
                {...register("excerptFontSize", { valueAsNumber: true })}
                type="range"
                min="10"
                max="24"
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12">
                {watch("excerptFontSize")}px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎨 Fundo do Card
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor de Fundo
            </label>
            <div className="flex gap-2">
              <input
                {...register("bgColor")}
                type="color"
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                {...register("bgColor")}
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacidade
            </label>
            <div className="flex items-center gap-3">
              <input
                {...register("bgOpacity", { valueAsNumber: true })}
                type="range"
                min="0"
                max="100"
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12">
                {watch("bgOpacity")}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="bg-indigo-50 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🔘 Botão Call-to-Action
          </h3>

          <div className="flex items-center gap-3">
            <Label.Root
              htmlFor="show-button"
              className="text-sm font-medium text-gray-700"
            >
              Exibir Botão
            </Label.Root>
            <Switch.Root
              id="show-button"
              checked={!!showButton}
              onCheckedChange={(checked: boolean) =>
                setValue("showButton", checked)
              }
              className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-indigo-600 transition"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>
        </div>

        {showButton && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto do Botão
              </label>
              <input
                {...register("buttonText")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ver mais"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor de Fundo
                </label>
                <div className="flex gap-2">
                  <input
                    {...register("buttonBgColor")}
                    type="color"
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    {...register("buttonBgColor")}
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor do Texto
                </label>
                <div className="flex gap-2">
                  <input
                    {...register("buttonTextColor")}
                    type="color"
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    {...register("buttonTextColor")}
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho da Fonte
                </label>
                <div className="flex items-center gap-3">
                  <input
                    {...register("buttonFontSize", { valueAsNumber: true })}
                    type="range"
                    min="10"
                    max="24"
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {watch("buttonFontSize")}px
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arredondamento
                </label>
                <div className="flex items-center gap-3">
                  <input
                    {...register("buttonBorderRadius", { valueAsNumber: true })}
                    type="range"
                    min="0"
                    max="50"
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {watch("buttonBorderRadius")}px
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ⚡ Presets Rápidos
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setValue("titleColor", "#1e293b");
              setValue("excerptColor", "#64748b");
              setValue("bgColor", "#ffffff");
              setValue("bgOpacity", 100);
              setValue("buttonBgColor", "#3b82f6");
              setValue("buttonTextColor", "#ffffff");
            }}
            className="px-4 py-3 bg-white border-2 border-blue-500 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
          >
            🔵 Padrão
          </button>

          <button
            type="button"
            onClick={() => {
              setValue("titleColor", "#ffffff");
              setValue("excerptColor", "#e2e8f0");
              setValue("bgColor", "#1e293b");
              setValue("bgOpacity", 90);
              setValue("buttonBgColor", "#eab308");
              setValue("buttonTextColor", "#000000");
            }}
            className="px-4 py-3 bg-slate-800 border-2 border-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
          >
            🌙 Dark
          </button>

          <button
            type="button"
            onClick={() => {
              setValue("titleColor", "#991b1b");
              setValue("excerptColor", "#7f1d1d");
              setValue("bgColor", "#fef2f2");
              setValue("bgOpacity", 100);
              setValue("buttonBgColor", "#dc2626");
              setValue("buttonTextColor", "#ffffff");
            }}
            className="px-4 py-3 bg-red-50 border-2 border-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            🔴 Destaque
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Upload, X, Check } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
}

export default function ImageUpload({
  onUploadComplete,
  currentImageUrl,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setIsUploading(true);

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem");
      setIsUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Arquivo deve ter menos de 5MB");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer upload");
      }

      onUploadComplete(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-indigo-600 bg-indigo-50"
            : "border-slate-300 bg-slate-50 hover:border-indigo-400"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-600 font-medium">Enviando...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-2">
            <Check size={32} className="text-green-600" />
            <p className="text-sm text-green-600 font-medium">
              Upload realizado com sucesso!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={32} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700">
                Arraste a imagem aqui ou clique para selecionar
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, GIF até 5MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <X size={16} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Current Image Preview */}
      {currentImageUrl && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">Imagem atual:</p>
          <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
            <img
              src={currentImageUrl}
              alt="Current"
              className="w-full h-32 object-cover"
              onError={() => {
                /* Handle error silently */
              }}
            />
            <p className="text-xs text-slate-500 p-2 bg-slate-50 text-center truncate">
              {currentImageUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

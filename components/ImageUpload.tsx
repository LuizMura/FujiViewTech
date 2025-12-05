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
      console.error("Upload error details:", err);
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
        className={`border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-all ${
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
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-600 font-medium">Enviando...</p>
          </div>
        ) : success ? (
          <div className="flex items-center justify-center gap-2">
            <Check size={20} className="text-green-600" />
            <p className="text-xs text-green-600 font-medium">Sucesso!</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Upload size={20} className="text-slate-400" />
            <p className="text-xs font-medium text-slate-700">
              Clique ou arraste
            </p>
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
    </div>
  );
}

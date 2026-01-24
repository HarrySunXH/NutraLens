"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, FileText } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
        handleFileSelection(file);
      }
    },
    []
  );

  const handleFileSelection = (file: File) => {
    onFileSelect(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleInputChange}
        className="hidden"
        id="file-upload"
      />

      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass-strong rounded-xl p-3 flex items-center gap-3"
          >
            {preview ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              onClick={removeFile}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            htmlFor="file-upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`block cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
            }`}
          >
            <div className="p-6 text-center">
              <div
                className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isDragging
                    ? "bg-emerald-100"
                    : "bg-gradient-to-br from-emerald-100 to-teal-100"
                }`}
              >
                {isDragging ? (
                  <Upload className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-emerald-600" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {isDragging
                  ? "Drop your file here"
                  : "Upload supplement label"}
              </p>
              <p className="text-xs text-gray-500">
                Drag & drop or click to browse (JPG, PNG, PDF)
              </p>
            </div>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
}

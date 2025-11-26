"use client";
import React, { useRef, useState } from "react";

export default function ImageReader({ value, onChange }) {
  const [preview, setPreview] = useState(value || "");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const applyFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file, url);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0] || null;
    applyFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    applyFile(file);
  };

  const clear = () => {
    setPreview("");
    setFileName("");
    onChange?.(null, "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer ${dragOver ? "border-brand bg-brand/5" : "border-gray-300 bg-gray-50"}`}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-24 object-cover rounded border"
          />
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 9 12 4.5 7.5 9M12 4.5V15" />
            </svg>
            <p className="mt-2 text-xs text-gray-600">Arrastra y suelta una imagen, o haz clic para seleccionar</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-700 truncate">
          {fileName ? fileName : (preview ? "Imagen seleccionada" : "Ningún archivo")}
        </div>
        {preview && (
          <button
            type="button"
            onClick={clear}
            className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-500"
          >
            Quitar
          </button>
        )}
      </div>
    </div>
  );
}

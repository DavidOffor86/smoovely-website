"use client";

import { useState } from "react";

export default function PhotoUploadSection({ quoteRef, photos, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 10 - photos.length;
    if (files.length > remainingSlots) {
      setError(`Maximum 10 photos allowed. You can upload ${remainingSlots} more.`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("quoteRef", quoteRef);

        const res = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          onChange([
            ...photos,
            {
              id: Date.now().toString() + Math.random(),
              fileName: data.fileName,
              fileSize: data.fileSize,
              url: data.url,
              uploadedAt: data.uploadedAt,
            },
          ]);
        }
      }
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = (id) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          Property Photos ({photos.length}/10)
        </p>
        <p className="mb-3 text-xs text-gray-500">
          Optional. Upload up to 10 photos to help our team understand your property.
        </p>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-300 py-6 px-4 text-center transition hover:border-blue-500 hover:bg-blue-50">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/heic,image/webp"
            disabled={uploading || photos.length >= 10}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-center">
            <div className="text-2xl mb-1">📸</div>
            <p className="text-sm font-medium text-blue-600">
              {uploading ? "Uploading..." : "Click to upload photos"}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, HEIC, WEBP • Max 5MB each
            </p>
          </div>
        </label>

        {error && (
          <div className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700">Uploaded Photos</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={photo.url}
                  alt={photo.fileName}
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-1 right-1 rounded bg-red-600 text-white p-1 opacity-0 transition group-hover:opacity-100"
                  aria-label="Delete photo"
                >
                  ✕
                </button>
                <p className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-1 py-0.5 text-xs text-white">
                  {photo.fileName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

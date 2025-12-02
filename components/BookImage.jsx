// components/BookImage.jsx
"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/api";

export default function BookImage({ src, alt, width = 200, height = 300, className = "" }) {
  const [error, setError] = useState(false);
  
  const imageUrl = getImageUrl(src);

  if (error || !imageUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center rounded ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-gray-400 text-sm">No Cover</span>
      </div>
    );
  }

  return (
    // ⭐ GUNAKAN <img> biasa, BUKAN Next.js <Image>
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={alt || "Book cover"}
      className={className}
      onError={() => {
        console.error(`❌ Failed to load image: ${imageUrl}`);
        setError(true);
      }}
      onLoad={() => console.log(`✅ Image loaded: ${imageUrl}`)}
      style={{ width: `${width}px`, height: `${height}px`, objectFit: "cover" }}
    />
  );
}
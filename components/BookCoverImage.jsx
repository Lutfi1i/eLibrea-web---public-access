"use client";

import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/api";

export default function BookCoverImage({ cover, alt, width = 250, height = 350, className = "" }) {
  const [imageError, setImageError] = useState(false);
  
  const coverUrl = cover ? getImageUrl(cover) : null;
  const defaultImage = "/Book-Untitled-cover.png";

  if (!coverUrl || imageError) {
    return (
      <Image
        src={defaultImage}
        alt={alt || "Default cover"}
        width={width}
        height={height}
        className={`object-cover rounded shadow-lg ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={coverUrl}
      alt={alt || "Book cover"}
      className={`w-[${width}px] h-[${height}px] object-cover rounded shadow-lg ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onError={() => {
        setImageError(true);
      }}
    />
  );
}


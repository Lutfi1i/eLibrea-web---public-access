"use client";
import Image from "next/image";
import NullImage from "../public/Book-Untitled-cover.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { getImageUrl, getApiUrl } from "@/lib/api";

export default function BookCard({ id, title, cover, category, isBookmarked = false, userId, onBookmarkChange }) {
  const [marked, setMarked] = useState(isBookmarked);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMarked(isBookmarked);
  }, [isBookmarked]);
  
  const coverUrl = cover && cover.trim() !== '' ? getImageUrl(cover) : null;
  
  const imageSrc = (!coverUrl || imageError) ? NullImage : coverUrl;
  const useStaticImage = imageSrc === NullImage;

  const toggleBookmark = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking bookmark
    e.stopPropagation();
    
    // Don't allow bookmarking if no user_id
    if (!userId) {
      alert("Silakan login untuk menggunakan fitur bookmark");
      return;
    }

    const previousState = marked;
    setMarked(!marked);
    setLoading(true);

    const method = previousState ? "DELETE" : "POST";

    try {
      const res = await fetch(getApiUrl("/api/bookmark"), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, book_id: id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Revert state on error
        setMarked(previousState);
        console.error("Error toggling bookmark:", data);
      } else {
        // Notify parent component that bookmark changed
        if (onBookmarkChange) {
          onBookmarkChange(id, !previousState);
        }
      }
    } catch (error) {
      // Revert state on error
      setMarked(previousState);
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/books/${id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-[175px] h-[280px] p-3 bg-[#F9E4E4] cursor-pointer shadow-md relative"
      >
        {/* Bookmark Icon - Only show if user is logged in */}
        {userId && (
          <button
            onClick={toggleBookmark}
            disabled={loading}
            className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1.5 hover:bg-white transition disabled:opacity-50"
          >
            <Bookmark
              size={16}
              className={marked ? "fill-red-500 text-red-500" : "text-gray-600"}
            />
          </button>
        )}

        {/* Cover buku */}
        <div className="w-full h-[200px] bg-gray-300 flex items-center justify-center relative overflow-hidden">
          {useStaticImage ? (
            // ✅ Untuk image lokal (NullImage), pakai Next.js <Image>
            <Image
              src={imageSrc}
              alt={title || "Book cover"}
              width={135}
              height={200}
              className="w-full h-full object-cover"
              priority={false}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={title || "Book cover"}
              className="w-full h-full object-cover"
              onError={() => {
                console.error(`Failed to load image: ${imageSrc}`);
                setImageError(true);
              }}
              onLoad={() => console.log(`Image loaded: ${imageSrc}`)}
            />
          )}
        </div>

        {/* Judul Buku */}
        <p className="mt-3 font-medium text-[14px] text-black truncate">
          {title || "Untitled"}
        </p>

        {/* Kategori (optional) */}
        {category && (
          <p className="text-xs text-gray-600 truncate">
            {category}
          </p>
        )}
      </motion.div>
    </Link>
  );
}
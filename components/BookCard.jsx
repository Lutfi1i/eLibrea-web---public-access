"use client";
import Image from "next/image";
import NullImage from "../public/Book-Untitled-cover.png";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";


export default function BookCard({ id, title, cover, category, isBookmarked }) {
  const [marked, setMarked] = useState(isBookmarked);
  const [imageError, setImageError] = useState(false);
  
  // Determine which image to use
  const imageSrc = (!cover || cover.trim() === '' || imageError) ? NullImage : cover;

  const toggleBookmark = async () => {
    setMarked(!marked);

    const method = marked ? "DELETE" : "POST";

    await fetch("/api/bookmark", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book_id: id }),
    });
  };

  return (
    <Link href={`/books/${id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-[175px] h-[280px] p-3 bg-[#F9E4E4] cursor-pointer"
      >


        {/* Cover buku */}
        <div className="w-[135px] h-[200px] bg-gray-300 flex items-center justify-center relative">
          <Image
            src={imageSrc || bookPicture}
            alt={title || "Book cover"}
            width={135}
            height={200}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Judul Buku */}
        <p className="mt-3 font-medium text-[14px] text-black truncate">{title}</p>
      </motion.div>
    </Link>
  );
}

import Image from "next/image";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import BookCard from "@/components/BookCard";
import { databuku } from "../../api/books/route";

async function getBooks() {
  try {
    const books = await databuku();
    return Array.isArray(books) ? books : [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default async function Page() {
  const books = await getBooks();

  const newBooks = books.slice(-8); 
  const releasedBooks = books.slice(0, 8);

  return (
    <div className="p-4">

      <div className="flex gap-4 overflow-x-auto pb-4">
        {["Matematika", "Kimia", "Filsafat", "Fisika", "Matematika Terapan"].map(
          (item) => (
            <button
              key={item}
              className="px-6 py-2 border rounded-full hover:bg-neutral-100 transition whitespace-nowrap"
            >
              {item}
            </button>
          )
        )}
      </div>
      <div className="grid grid-cols-8 gap-6 mt-6">
        {newBooks.map((buku) => (
          <BookCard
            key={buku.id}
            id={buku.id}
            title={buku.judul}
            cover={buku.cover_picture}
            category={buku.kategori}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-14 mb-6">
        Baru ditambahin nih
      </h2>

      <div className="grid grid-cols-8 gap-6">
        {releasedBooks.map((buku) => (
          <BookCard
            key={buku.id}
            id={buku.id}
            title={buku.judul}
            cover={buku.cover_picture}
            category={buku.kategori}
          />
        ))}
      </div>

    </div>
  );
}

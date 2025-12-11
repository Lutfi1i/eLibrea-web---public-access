"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookCard from "@/components/BookCard";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";

async function searchBooks(keyword) {
  if (!keyword || keyword.trim() === "") {
    return [];
  }

  try {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    const res = await fetch(getApiUrl(`/api/buku/search/${encodedKeyword}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Search failed:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
        if (Array.isArray(data)) {
      return data;
    }
    if (data.success && data.data) {
      return data.data;
    }
    if (data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const keyword = searchParams.get("q") || "";
  const [searchKeyword, setSearchKeyword] = useState(keyword);

  useEffect(() => {
    async function loadBookmarks() {
      if (!session?.user?.id) {
        setBookmarkedIds([]);
        return;
      }

      try {
        const res = await fetch(
          getApiUrl(`/api/bookmark/user/${session.user.id}/ids`),
          { cache: "no-store" }
        );

        if (res.ok) {
          const data = await res.json();
          setBookmarkedIds(data.success ? data.data : []);
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    }

    loadBookmarks();
  }, [session?.user?.id]);

  useEffect(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    async function performSearch() {
      if (!keyword) {
        setBooks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const results = await searchBooks(keyword);
      setBooks(results);
      setLoading(false);
    }

    performSearch();
  }, [keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleBookmarkChange = (bookId, isBookmarked) => {
    if (isBookmarked) {
      setBookmarkedIds((prev) => [...prev, bookId]);
    } else {
      setBookmarkedIds((prev) => prev.filter((id) => id !== bookId));
    }
  };

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {keyword && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {loading ? (
                "Mencari..."
              ) : (
                <>
                  Hasil pencarian untuk &quot;<span className="text-red-500">{keyword}</span>&quot;
                  {books.length > 0 && (
                    <span className="text-gray-500 text-base ml-2">
                      ({books.length} buku ditemukan)
                    </span>
                  )}
                </>
              )}
            </h2>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">Sedang mencari...</div>
          </div>
        )}

        {!loading && keyword && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍?</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Coba gunakan kata kunci yang berbeda atau periksa ejaan kata kunci
              Anda.
            </p>
          </div>
        )}

        {!keyword && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Masukkan kata kunci pencarian
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Gunakan kolom pencarian di atas untuk mencari buku berdasarkan
              judul atau penulis.
            </p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.judul}
                cover={book.cover_picture}
                category={book.kategori}
                isBookmarked={bookmarkedIds.includes(book.id)}
                userId={session?.user?.id}
                onBookmarkChange={handleBookmarkChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


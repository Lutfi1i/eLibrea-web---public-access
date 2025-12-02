"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import BookCard from "@/components/BookCard";
import { getApiUrl } from "@/lib/api";

async function getBooks() {
  try {
    const apiUrl = getApiUrl("/api/buku");
    console.log("Fetching books from:", apiUrl);
    
    const res = await fetch(apiUrl, {
      cache: "no-store", // biar tidak ke-cache oleh next
    });

    if (!res.ok) {
      console.error("API response not OK:", res.status, res.statusText);
      throw new Error(`Gagal mengambil data: ${res.status} ${res.statusText}`);
    }

    const books = await res.json();
    console.log("Books fetched:", Array.isArray(books) ? books.length : "not an array", books);
    return Array.isArray(books) ? books : [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

async function getBookmarkIds(userId) {
  if (!userId) return [];
  
  try {
    const res = await fetch(getApiUrl(`/api/bookmark/user/${userId}/ids`), {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export default function Page() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [books, setBooks] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarkedIds([]);
      return;
    }
    try {
      const ids = await getBookmarkIds(userId);
      setBookmarkedIds(ids);
    } catch (err) {
      console.error("Error loading bookmarks:", err);
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const fetchedBooks = await getBooks();
        if (!mounted) return;
        setBooks(fetchedBooks);

        if (userId) {
          const ids = await getBookmarkIds(userId);
          if (!mounted) return;
          setBookmarkedIds(ids);
        } else {
          setBookmarkedIds([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Refresh bookmarks when page becomes visible (user navigates back)
  useEffect(() => {
    if (!userId) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadBookmarks();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh on focus (when user switches back to tab)
    window.addEventListener('focus', loadBookmarks);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadBookmarks);
    };
  }, [userId, loadBookmarks]);

  // Handle bookmark changes
  const handleBookmarkChange = (bookId, isBookmarked) => {
    if (isBookmarked) {
      // Add to bookmarkedIds
      setBookmarkedIds((prev) => {
        if (!prev.includes(bookId)) {
          return [...prev, bookId];
        }
        return prev;
      });
    } else {
      // Remove from bookmarkedIds
      setBookmarkedIds((prev) => prev.filter((id) => id !== bookId));
    }
  };

  // Create a Set for O(1) lookup
  const bookmarkedSet = useMemo(() => new Set(bookmarkedIds), [bookmarkedIds]);

  const newBooks = books.slice(-8);
  const releasedBooks = books.slice(0, 8);

  return (
    <div className="p-4">
      {/* KATEGORI */}
      <motion.div
        className="flex gap-4 overflow-x-auto pb-4"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {[
          "Matematika",
          "Kimia",
          "Filsafat",
          "Fisika",
          "Matematika Terapan"
        ].map((item, i) => (
          <motion.button
            key={item}
            className="px-6 py-2 border rounded-full hover:bg-neutral-100 transition whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.05, // stagger
            }}
          >
            {item}
          </motion.button>
        ))}
      </motion.div>

      {books.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-500 text-lg">Tidak ada buku ditemukan</p>
          <p className="text-gray-400 text-sm mt-2">
            Silakan tambahkan buku melalui halaman admin
          </p>
        </motion.div>
      ) : (
        <>
          {/* GRID BUKU PERTAMA */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6 mt-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
          >
            {newBooks.map((buku) => (
              <motion.div
                key={buku.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
              >
                <BookCard
                  id={buku.id}
                  title={buku.judul}
                  cover={buku.cover_picture}
                  category={buku.kategori}
                  userId={userId}
                  isBookmarked={bookmarkedSet.has(buku.id)}
                  onBookmarkChange={handleBookmarkChange}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* JUDUL SECTION */}
          <motion.h2
            className="text-xl font-semibold mt-14 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Baru ditambahin nih
          </motion.h2>

          {/* GRID BUKU TERBARU */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
          >
            {releasedBooks.map((buku) => (
              <motion.div
                key={buku.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
              >
                <BookCard
                  id={buku.id}
                  title={buku.judul}
                  cover={buku.cover_picture}
                  category={buku.kategori}
                  userId={userId}
                  isBookmarked={bookmarkedSet.has(buku.id)}
                  onBookmarkChange={handleBookmarkChange}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

import Image from "next/image";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getApiUrl } from "@/lib/api";
import Link from "next/link";
import BookCard from "@/components/BookCard";

async function getBookmarks(userId) {
  if (!userId) return [];

  try {
    const res = await fetch(getApiUrl(`/api/bookmark/user/${userId}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch bookmarks:", res.status);
      return [];
    }

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export default async function BookmarkPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mt-4">
          Silakan login terlebih dahulu
        </h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Anda harus login untuk melihat bookmark Anda.
        </p>
      </div>
    );
  }

  const bookmarks = await getBookmarks(userId);

  const isEmpty = !bookmarks || bookmarks.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Bookmark Saya</h1>

      {/* Kondisi jika tidak ada bookmark */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Image
            src="/tao1.png"
            width={180}
            height={180}
            alt="Empty Bookmark"
            className="opacity-80"
          />
          <h2 className="text-xl font-semibold mt-4">Belum ada bookmark</h2>
          <p className="text-gray-500 mt-2 max-w-md">
            Kamu belum menandai buku apapun. Mulai tambahkan buku ke bookmark
            untuk meminjamnya nanti.
          </p>
        </div>
      )}

      {/* Jika ada bookmark */}
      {!isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-2">
          {bookmarks.map((book) => (
            <div
              key={book.id}
            > <Link
                href={`/books/${book.id}`}
              ><BookCard
                id={book.id}
                title={book.judul}
                cover={book.cover_picture}
                category={book.kategori}
                userId={userId}
              /></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

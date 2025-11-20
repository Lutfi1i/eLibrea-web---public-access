import Image from "next/image";

async function getBookmarks() {
}

export default async function BookmarkPage() {
  const bookmarks = await getBookmarks();

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
            Kamu belum menandai buku apapun.  
            Mulai tambahkan buku ke bookmark untuk membacanya nanti.
          </p>
        </div>
      )}

      {/* Jika ada bookmark */}
      {!isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition"
            >
              <Image
                src={book.cover || "/Book-Untitled-cover.png"}
                alt={book.judul}
                width={300}
                height={450}
                className="w-full h-[300px] object-cover rounded-md"
              />

              <h3 className="text-lg font-semibold mt-3">{book.judul}</h3>

              <p className="text-sm text-gray-600">
                {book.penulis || "Penulis tidak diketahui"}
              </p>

              <a
                href={`/books/${book.id}`}
                className="mt-3 inline-block px-4 py-2 bg-[#B2333C] text-white rounded-md hover:bg-[#8d1f27] transition"
              >
                Lihat Buku
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

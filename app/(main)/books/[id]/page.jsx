import connection from "@/lib/database";
import Image from "next/image";

async function getBook(id) {
  if (!id) return null;

  const [rows] = await connection.execute(
    "SELECT * FROM buku WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}

export default async function page({ params }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) return <p>Buku tidak ditemukan</p>;

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="w-full bg-[#FFEEED] p-8 flex gap-10 items-start">
        
        {/* COVER */}
        <div className="min-w-[150px] p-1 rounded">
          <Image
            src={book.cover_picture || "/Book-Untitled-cover.png"}
            alt={book.judul}
            width={250}
            height={350}
            className="object-cover rounded"
          />
        </div>

        {/* INFO BUKU */}
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold mb-1">
            {book.judul || "Judul Buku"}
          </h1>

          <p className="text-sm text-gray-700 mb-4">
            {book.penulis || "Penulis tidak diketahui"}
          </p>

          <button className="w-[120px] bg-[#B8394D] hover:bg-[#a02f40] text-white px-4 py-2 shadow-sm transition">
            Pinjam
          </button>
        </div>
      </div>
      <div className="mt-8 px-4 flex flex-col gap-4">
        <p className="text-lg">
          Tersedia?:{" "}
          <span className="text-green-600 font-semibold">
            YA 8/23
          </span>
        </p>

        <p className="text-lg">
          ISBN : {book.ISBN || "Tidak tersedia"}
        </p>

        <p className="text-lg">
          Penerbit : {book.penerbit || "Tidak diketahui"}
        </p>

        <div className="mt-4 flex gap-3">
          <span className="font-semibold">Deskripsi :</span>
          <p className="text-gray-700">
            {book.deskripsi || "Belum ada deskripsi untuk buku ini"}
          </p>
        </div>
      </div>
    </div>
  );
}

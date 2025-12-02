import Image from "next/image";
import { Bookmark, Languages } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import BookCard from "@/components/BookCard";
import Link from "next/link";

async function getBook(id) {
  if (!id) return null;

  try {
    const url = getApiUrl(`/api/buku/${id}`);
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}


export default async function page({ params }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Image
          src="/tao1.png"
          width={180}
          height={180}
          alt="Empty Bookmark"
          className="opacity-80"
        />
        <h2 className="text-xl font-semibold mt-4">Buku Tidak Ditemukan</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Cek kesalahan dalam URL maupun ID, jika tidak ada tunggu perilisan ya!
        </p>
        <h2 className="text-xl font-semibold mt-4">BOOK ID: {id}</h2>
      </div>
    );

  return (
    <div className="w-full flex flex-col pb-20">
      {/* ================= HEADER ================= */}
      <div className="w-full bg-[#F7F3F3] px-10 py-8 flex flex-col md:flex-row gap-10 items-start relative">
        {/* LEFT: COVER */}
        <div className="w-[210px] h-[310px] bg-white shadow-sm border rounded-lg flex items-center justify-center p-2">
          <BookCoverImage
            cover={book.cover_picture}
            alt={book.judul}
            width={230}
            height={300}
          />
        </div>

        {/* MIDDLE: BOOK INFO */}
        <div className="flex flex-col flex-1 pt-2">
          <h1 className="text-[22px] font-semibold leading-tight">
            {book.judul}
          </h1>

          <p className="text-[14px] text-neutral-700 mt-1">{book.penulis}</p>

          <p className="text-[14px] font-semibold mt-0.5">
            {book.tahun_terbit || "Tidak, belum diketahui"}
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-3 mt-5">
            <Link href={`/borrow/${id}`}>
              <button className="bg-[#B41A1A] text-white px-10 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#9e1717] transition">
                Pinjam
              </button>
            </Link>

            <button className="w-9 h-9 rounded-lg bg-[#B41A1A] flex items-center justify-center shadow-sm hover:bg-[#a92a2a] transition">
              <Bookmark size={20} color="white" />
            </button>
          </div>
        </div>

        {/* RIGHT: CATEGORY + BAHASA + EKSAMPLAR */}
        <div className="flex flex-col items-end gap-3 ml-auto md:items-end">
          {/* Category Box */}
          <Link
            href={`/kategori/${book.kategori || "pelajaran"}`}
            className="bg-linear-to-r from-[#BFAEAE] to-[#D7CECE] px-7 py-6 rounded-xl shadow-sm text-white hover:opacity-90 transition select-none w-[220px] text-right"
          >
            <p className="text-xs opacity-90 text-left">Lihat lainnya di kategori</p>
            <h2 className="text-[22px] font-bold -mt-1 text-left">{book.kategori} &nbsp; →</h2>
          </Link>

          {/* Bahasa + Eksamplar */}
          <div className="flex items-center gap-3 mt-1 text-[15px] text-neutral-700">
            <Languages size={24} />
            <span>{book.bahasa || "Tidak, belum diketahui"}</span>
            <span className="ml-4">Eksamplar: {book.jumlah_halaman || "Tidak, belum diketahui"}</span>
          </div>
        </div>
      </div>
      {/* ================= INFO ================= */}
      <div className="mt-14 px-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT INFO */}
        <div className="text-[15px] flex flex-col gap-3">
          <p>
            Tersedia?:{" "}
            <span className="text-green-700 font-semibold">
              YA ({book.stok || "0"})
            </span>
          </p>

          <p>ISBN: {book.ISBN || "Tidak tersedia"}</p>

          <p>Penerbit: {book.penerbit || "Tidak diketahui"}</p>
        </div>

        {/* RIGHT DESC */}
        <div>
          <p className="font-semibold text-[15px] mb-1">Deskripsi :</p>
          <p className="text-neutral-700 text-[14px] leading-relaxed">
            {book.deskripsi || "Belum ada deskripsi untuk buku ini"}
          </p>
        </div>
      </div>

      {/* ================= RELATED BOOKS ================= */}
      <div className="mt-20 px-10">
        <h2 className="text-xl font-semibold mb-5">Buku lainnya</h2>

        <div className="flex gap-6 pb-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num}>
              <BookCard
                id={num}
                title="Matematika Terapan"
                cover=""
                category="Pelajaran"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

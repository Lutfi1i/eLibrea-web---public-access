"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getApiUrl, getImageUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import { ChevronLeft, ChevronDown } from "lucide-react";

function Page() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const id = params?.id;
  const [days, setDays] = useState(1);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching book with ID:", id);
        const res = await fetch(getApiUrl(`/api/buku/${id}`), {
          cache: "no-store",
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
          console.error("Failed to fetch book, status:", res.status);
          setBook(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Book data received:", data);
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSelect = (e) => {
    setDays(Number(e.target.value));
  };

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = async () => {
    if (!session?.user?.id) {
      alert("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (!book || !id) {
      alert("Data buku tidak valid");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(getApiUrl("/api/peminjaman"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.user.id,
          book_id: Number(id),
          lama_pinjam: days,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Gagal membuat peminjaman");
        setSubmitting(false);
        return;
      }

      // Redirect ke halaman status peminjaman
      router.push(`/borrow/status/${data.data.id}`);
    } catch (error) {
      console.error("Error creating peminjaman:", error);
      alert("Terjadi kesalahan saat membuat peminjaman");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <p className="text-gray-500">Memuat data buku...</p>
      </div>
    );
  }

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
        <h2 className="text-xl font-semibold mt-4">Peminjaman tidak valid</h2>
        <p className="text-gray-500 mt-2 max-w-md">Ulangi Peminjaman</p>
        <h2 className="text-xl font-semibold mt-4">BOOK ID: {id}</h2>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-linear-to-t from-[#CF9DA7] to-white p-8">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="fixed left-20 top-20 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Book Image */}
      <div className="mt-10">
        <BookCoverImage
          cover={book.cover_picture}
          alt={book.judul || "Cover Buku"}
          width={160}
          height={240}
          className="w-40 h-auto rounded shadow"
        />
      </div>

      {/* Title */}
      <h2 className="text-center text-xl font-semibold mt-6 max-w-md">
        {book.judul}
      </h2>
      <p className="text-gray-600 mt-1">Buku Tersedia</p>

      {/* Label */}
      <p className="mt-10 text-lg">Pinjam Selama?</p>

      {/* Input Dropdown */}
      <div className="flex items-center gap-3 mt-4">
        <div className="relative">
          <select
            value={days}
            onChange={handleSelect}
            className="appearance-none w-40 text-center text-2xl font-semibold px-4 py-3 rounded-xl bg-white shadow border"
          >
            {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-2xl font-semibold">Hari</span>
      </div>

      {/* Rules */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* Maksimal lama peminjaman 2 minggu</p>
        <p>* Minimal meminjam selama 1 hari</p>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="mt-10 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white w-60 py-3 rounded-xl text-lg shadow transition"
      >
        {submitting ? "Memproses..." : "Konfirmasi"}
      </button>
    </div>
  );
}

export default Page;
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getApiUrl, getImageUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import { ChevronLeft, Clock, CheckCircle2, XCircle, MoreVertical } from "lucide-react";

function PeminjamanStatusPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const peminjamanId = params?.id;
  
  const [peminjaman, setPeminjaman] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeminjaman = async () => {
      if (!peminjamanId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(getApiUrl(`/api/peminjaman/${peminjamanId}`), {
          cache: "no-store",
        });

        if (!res.ok) {
          setPeminjaman(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setPeminjaman(data.data);
        }
      } catch (error) {
        console.error("Error fetching peminjaman:", error);
        setPeminjaman(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPeminjaman();
  }, [peminjamanId]);

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <p className="text-gray-500">Memuat data peminjaman...</p>
      </div>
    );
  }

  if (!peminjaman) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
      <Image
        src="/tao1.png"
        width={180}
        height={180}
        alt="Empty Bookmark"
        className="opacity-80"
      />
      <h2 className="text-xl font-semibold mt-4">Peminjaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Cek kesalahan dalam URL maupun ID, jika tidak ada laporkan!
      </p>
      <h2 className="text-xl font-semibold mt-4">Error 404 NOT FOUND</h2>
    </div>
    );
  }

  const status = peminjaman.status;
  const verificationCode = peminjaman.verification_code || "";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#CF9DA7] to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={handleBack}
          className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center gap-4">
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-6 pb-20">
        {/* Book Cover */}
        <div className="mt-8">
          <BookCoverImage
            cover={peminjaman.cover_picture}
            alt={peminjaman.judul || "Cover Buku"}
            width={200}
            height={300}
            className="shadow-lg"
          />
        </div>

        {/* Book Title */}
        <h2 className="text-center text-xl font-semibold mt-6 max-w-md">
          {peminjaman.judul}
        </h2>

        {/* Date */}
        <p className="text-gray-600 mt-2">
          {formatDate(peminjaman.created_at)}
        </p>

        {/* Status Section */}
        <div className="mt-8 flex flex-col items-center">
          {/* Status Message */}
          <h3 className="text-2xl font-bold mb-6">
            {status === "waiting" && "Pengajuan Peminjaman Berhasil"}
            {status === "accepted" && "Pengajuan disetujui"}
            {status === "rejected" && "Pengajuan ditolak"}
            {(status === "borrowed" || status === "returned") && "Status Peminjaman"}
          </h3>

          {/* Status Icon */}
          <div className="mb-6">
            {status === "waiting" && (
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <Clock size={40} className="text-white" />
              </div>
            )}
            {status === "accepted" && (
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-white" />
              </div>
            )}
            {status === "rejected" && (
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <XCircle size={40} className="text-white" />
              </div>
            )}
            {(status === "borrowed" || status === "returned") && (
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-white" />
              </div>
            )}
          </div>

          {/* Verification Code (for accepted/borrowed) */}
          {(status === "accepted" || status === "borrowed") && verificationCode && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-4 text-center">
                Kode Verifikasi
              </p>
              <div className="flex gap-3 justify-center">
                {verificationCode.split("").map((digit, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-3xl font-bold shadow-md"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center max-w-xs px-4">
                Simpan kode ini untuk mengambil buku
              </p>
            </div>
          )}

          {/* Rejection Reason (for rejected) */}
          {status === "rejected" && peminjaman.alasan_reject && (
            <div className="mt-4 max-w-md">
              <p className="text-center text-gray-700 bg-white/80 p-4 rounded-lg shadow-md">
                {peminjaman.alasan_reject}
              </p>
            </div>
          )}

          {/* Additional Info */}
          {status === "waiting" && (
            <p className="text-sm text-gray-600 mt-4 text-center max-w-xs">
              Permintaan Anda sedang menunggu persetujuan dari petugas
            </p>
          )}

          {status === "accepted" && (
            <div className="mt-6 text-center max-w-md">
              <p className="text-sm text-gray-600 mb-2">
                Tanggal Pinjam: {formatDate(peminjaman.tanggal_pinjam)}
              </p>
              <p className="text-sm text-gray-600">
                Tanggal Kembali: {formatDate(peminjaman.tanggal_kembali)}
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Silakan ambil buku di perpustakaan dengan menunjukkan kode verifikasi
              </p>
            </div>
          )}

          {status === "borrowed" && (
            <div className="mt-6 text-center max-w-md">
              <p className="text-sm text-gray-600 mb-2">
                Tanggal Kembali: {formatDate(peminjaman.tanggal_kembali)}
              </p>
              <p className="text-xs text-orange-600 font-semibold">
                {new Date(peminjaman.tanggal_kembali) < new Date()
                  ? "Buku sudah melewati tanggal kembali!"
                  : "Jangan lupa kembalikan sebelum tanggal kembali"}
              </p>
            </div>
          )}
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-300/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default PeminjamanStatusPage;


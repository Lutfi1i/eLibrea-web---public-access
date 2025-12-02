"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, BookOpen } from "lucide-react";

export default function PeminjamanPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, waiting, accepted, borrowed

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    loadPeminjaman();
  }, [session, filter]);

  const loadPeminjaman = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      let url = getApiUrl(`/api/peminjaman/user/${session.user.id}`);
      
      if (filter !== "all") {
        url = getApiUrl(`/api/peminjaman/user/${session.user.id}/status/${filter}`);
      }

      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Failed to fetch peminjaman");
        setPeminjaman([]);
        return;
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPeminjaman(data.data);
      } else {
        setPeminjaman([]);
      }
    } catch (error) {
      console.error("Error loading peminjaman:", error);
      setPeminjaman([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      waiting: (
        <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-2 w-fit">
          <Clock size={14} />
          Menunggu Persetujuan
        </span>
      ),
      accepted: (
        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 flex items-center gap-2 w-fit">
          <CheckCircle size={14} />
          Disetujui
        </span>
      ),
      borrowed: (
        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 flex items-center gap-2 w-fit">
          <BookOpen size={14} />
          Sedang Dipinjam
        </span>
      ),
      rejected: (
        <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 flex items-center gap-2 w-fit">
          <XCircle size={14} />
          Ditolak
        </span>
      ),
    };
    return badges[status] || <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">{status}</span>;
  };

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mt-4">Silakan login terlebih dahulu</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Anda harus login untuk melihat riwayat peminjaman.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Riwayat Peminjaman</h1>
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Filter peminjaman berdasarkan status (exclude returned dan rejected)
  const filteredPeminjaman = peminjaman.filter(
    (p) => p.status !== "returned" && (filter === "all" || p.status === filter)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Riwayat Peminjaman</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium transition ${
            filter === "all"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter("waiting")}
          className={`px-4 py-2 font-medium transition ${
            filter === "waiting"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Menunggu
        </button>
        <button
          onClick={() => setFilter("accepted")}
          className={`px-4 py-2 font-medium transition ${
            filter === "accepted"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Disetujui
        </button>
        <button
          onClick={() => setFilter("borrowed")}
          className={`px-4 py-2 font-medium transition ${
            filter === "borrowed"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Sedang Dipinjam
        </button>
      </div>

      {filteredPeminjaman.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada peminjaman</p>
          <p className="text-gray-400 text-sm mt-2">
            {filter === "all"
              ? "Anda belum pernah meminjam buku"
              : `Tidak ada peminjaman dengan status ${filter}`}
          </p>
          <Link
            href="/home"
            className="mt-4 inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Jelajahi Buku
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeminjaman.map((p) => (
            <Link
              key={p.id}
              href={`/borrow/status/${p.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <BookCoverImage
                    cover={p.cover_picture}
                    alt={p.judul || "Book cover"}
                    width={80}
                    height={120}
                    className="rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate mb-2">{p.judul}</h3>
                  <p className="text-sm text-gray-600 mb-3">{p.penulis}</p>
                  {getStatusBadge(p.status)}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Lama Pinjam:</span> {p.lama_pinjam} hari
                </p>
                {p.tanggal_pinjam && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tanggal Pinjam:</span> {formatDate(p.tanggal_pinjam)}
                  </p>
                )}
                {p.tanggal_kembali && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Batas Kembali:</span> {formatDate(p.tanggal_kembali)}
                  </p>
                )}
                {p.status === "rejected" && p.alasan_reject && (
                  <p className="text-sm text-red-600 mt-2">
                    <span className="font-medium">Alasan:</span> {p.alasan_reject}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-3">
                  Diajukan: {formatDate(p.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


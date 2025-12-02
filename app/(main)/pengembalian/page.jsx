"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import Link from "next/link";
import { CheckCircle, Calendar } from "lucide-react";

export default function PengembalianPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [pengembalian, setPengembalian] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    loadPengembalian();
  }, [session]);

  const loadPengembalian = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const res = await fetch(
        getApiUrl(`/api/peminjaman/user/${session.user.id}/status/returned`),
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch pengembalian");
        setPengembalian([]);
        return;
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPengembalian(data.data);
      } else {
        setPengembalian([]);
      }
    } catch (error) {
      console.error("Error loading pengembalian:", error);
      setPengembalian([]);
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

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mt-4">Silakan login terlebih dahulu</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Anda harus login untuk melihat riwayat pengembalian.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Riwayat Pengembalian</h1>
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Riwayat Pengembalian</h1>
      </div>

      {pengembalian.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Belum ada pengembalian</p>
          <p className="text-gray-400 text-sm mt-2">
            Anda belum pernah mengembalikan buku
          </p>
          <Link
            href="/peminjaman"
            className="mt-4 inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Lihat Peminjaman
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pengembalian.map((p) => (
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
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 flex items-center gap-2 w-fit">
                    <CheckCircle size={14} />
                    Dikembalikan
                  </span>
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
                {p.tanggal_dikembalikan && (
                  <p className="text-sm text-green-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Dikembalikan: {formatDate(p.tanggal_dikembalikan)}
                    </span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


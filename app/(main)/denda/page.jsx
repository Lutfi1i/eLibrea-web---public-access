"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import Link from "next/link";
import { AlertTriangle, Calendar, CheckCircle } from "lucide-react";

export default function DendaPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [denda, setDenda] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    loadDenda();
  }, [session]);

  const loadDenda = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      // Get semua peminjaman user untuk cek yang overdue
      const res = await fetch(
        getApiUrl(`/api/peminjaman/user/${session.user.id}/status/overdue`),
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch denda");
        setDenda([]);
        return;
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Filter yang overdue (status borrowed dan tanggal_kembali sudah lewat)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const overdueBooks = data.data.filter((p) => {
          if (p.status !== "borrowed") return false;
          if (!p.tanggal_kembali) return false;
          
          const dueDate = new Date(p.tanggal_kembali);
          dueDate.setHours(0, 0, 0, 0);
          
          return dueDate < today;
        });

        // Calculate denda (misalnya Rp 5.000 per hari)
        const dendaPerHari = 5000;
        const dendaWithCalculation = overdueBooks.map((p) => {
          const dueDate = new Date(p.tanggal_kembali);
          dueDate.setHours(0, 0, 0, 0);
          const diffTime = today - dueDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const totalDenda = diffDays * dendaPerHari;

          return {
            ...p,
            hariTerlambat: diffDays,
            totalDenda: totalDenda,
          };
        });

        setDenda(dendaWithCalculation);
      } else {
        setDenda([]);
      }
    } catch (error) {
      console.error("Error loading denda:", error);
      setDenda([]);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const totalDenda = denda.reduce((sum, d) => sum + d.totalDenda, 0);

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mt-4">Silakan login terlebih dahulu</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Anda harus login untuk melihat denda.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Denda</h1>
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Denda</h1>
        {totalDenda > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4">
            <p className="text-sm text-gray-600">Total Denda</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDenda)}</p>
          </div>
        )}
      </div>

      {denda.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada denda</p>
          <p className="text-gray-400 text-sm mt-2">
            Semua buku sudah dikembalikan tepat waktu
          </p>
        </div>
      ) : (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-yellow-800">Peringatan Denda</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Anda memiliki {denda.length} buku yang terlambat dikembalikan. 
                  Denda akan terus bertambah setiap hari. Segera kembalikan buku untuk menghindari denda yang lebih besar.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {denda.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-red-500"
              >
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <BookCoverImage
                      cover={d.cover_picture}
                      alt={d.judul || "Book cover"}
                      width={80}
                      height={120}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate mb-2">{d.judul}</h3>
                    <p className="text-sm text-gray-600 mb-3">{d.penulis}</p>
                    <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 flex items-center gap-2 w-fit">
                      <AlertTriangle size={14} />
                      Terlambat {d.hariTerlambat} hari
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  {d.tanggal_kembali && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium flex items-center gap-1">
                        <Calendar size={14} />
                        Batas Kembali:
                      </span>{" "}
                      <span className="text-red-600 font-medium">{formatDate(d.tanggal_kembali)}</span>
                    </p>
                  )}
                  <div className="bg-red-50 rounded-lg p-3 mt-3">
                    <p className="text-xs text-gray-600 mb-1">Denda</p>
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(d.totalDenda)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(5000)} × {d.hariTerlambat} hari
                    </p>
                  </div>
                  <Link
                    href={`/borrow/status/${d.id}`}
                    className="mt-4 inline-block w-full text-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import defaultNullImage from "@/public/Book-Untitled-cover.png";
import { getImageUrl, getApiUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

export default function PeminjamanPage() {
  const { data: session } = useSession();
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadPeminjaman = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl("/api/peminjaman/waiting/all"), {
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

  useEffect(() => {
    loadPeminjaman();
    // Refresh setiap 30 detik untuk update real-time
    const interval = setInterval(loadPeminjaman, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (peminjamanId) => {
    if (!session?.user?.id) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    if (!confirm("Yakin ingin menyetujui peminjaman ini?")) return;

    try {
      setProcessing(true);
      const res = await fetch(getApiUrl(`/api/peminjaman/${peminjamanId}/approve`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petugas_id: session.user.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`Peminjaman disetujui! Kode verifikasi: ${data.data.verification_code}`);
        loadPeminjaman(); // Refresh list
      } else {
        alert(data.message || "Gagal menyetujui peminjaman");
      }
    } catch (error) {
      console.error("Error approving peminjaman:", error);
      alert("Terjadi kesalahan saat menyetujui peminjaman");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPeminjaman) return;
    if (!rejectReason.trim()) {
      alert("Silakan masukkan alasan penolakan");
      return;
    }

    if (!session?.user?.id) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(
        getApiUrl(`/api/peminjaman/${selectedPeminjaman.id}/reject`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            petugas_id: session.user.id,
            alasan: rejectReason,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Peminjaman ditolak");
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedPeminjaman(null);
        loadPeminjaman(); // Refresh list
      } else {
        alert(data.message || "Gagal menolak peminjaman");
      }
    } catch (error) {
      console.error("Error rejecting peminjaman:", error);
      alert("Terjadi kesalahan saat menolak peminjaman");
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setShowRejectModal(true);
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
        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock size={12} />
          Menunggu
        </span>
      ),
      accepted: (
        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle size={12} />
          Disetujui
        </span>
      ),
      rejected: (
        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle size={12} />
          Ditolak
        </span>
      ),
    };
    return badges[status] || <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{status}</span>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Memuat data peminjaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Peminjaman</h1>
          <p className="text-sm text-gray-500 mt-1">
            {peminjaman.length} peminjaman menunggu persetujuan
          </p>
        </div>
      </div>

      {peminjaman.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada peminjaman yang menunggu</p>
          <p className="text-gray-400 text-sm mt-2">
            Semua peminjaman sudah diproses
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peminjaman.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              {/* Book Cover & Info */}
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
                  <h3 className="font-semibold text-lg truncate">{p.judul}</h3>
                  <p className="text-sm text-gray-600">{p.penulis}</p>
                  {getStatusBadge(p.status)}
                </div>
              </div>

              {/* User Info */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Peminjam:</span> {p.name || p.username}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Email:</span> {p.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Lama Pinjam:</span> {p.lama_pinjam} hari
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Diajukan: {formatDate(p.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleApprove(p.id)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Setujui
                </button>
                <button
                  onClick={() => openRejectModal(p)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle size={16} />
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPeminjaman && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Tolak Peminjaman</h2>
            <p className="text-sm text-gray-600 mb-2">
              Buku: <span className="font-medium">{selectedPeminjaman.judul}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Peminjam: <span className="font-medium">{selectedPeminjaman.name || selectedPeminjaman.username}</span>
            </p>
            <label className="block text-sm font-medium mb-2">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedPeminjaman(null);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Memproses..." : "Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


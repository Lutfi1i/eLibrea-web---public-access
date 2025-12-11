"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import defaultNullImage from "@/public/Book-Untitled-cover.png";
import { getImageUrl, getApiUrl } from "@/lib/api";
import BookCoverImage from "@/components/BookCoverImage";
import { CheckCircle, XCircle, Clock, Eye, BookOpen, Key } from "lucide-react";

export default function PeminjamanPage() {
  const { data: session } = useSession();
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("waiting"); // waiting, accepted, borrowed
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [kondisiBuku, setKondisiBuku] = useState("baik");
  const [catatan, setCatatan] = useState("");

  const loadPeminjaman = async () => {
    try {
      setLoading(true);
      let url;
      
      if (filter === "waiting") {
        url = getApiUrl("/api/peminjaman/waiting/all");
      } else {
        url = getApiUrl(`/api/peminjaman/status/${filter}`);
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

  useEffect(() => {
    loadPeminjaman();
    // Refresh setiap 30 detik untuk update real-time
    const interval = setInterval(loadPeminjaman, 30000);
    return () => clearInterval(interval);
  }, [filter]);

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
        alert(`Peminjaman disetujui! Harap Verifikasi dengan kode yang dimiliki users`);
        loadPeminjaman();
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
        loadPeminjaman(); 
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

  const handleBorrow = async () => {
    if (!selectedPeminjaman) return;
    if (!verificationCode.trim()) {
      alert("Silakan masukkan kode verifikasi");
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(
        getApiUrl(`/api/peminjaman/${selectedPeminjaman.id}/borrow-with-code`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_code: verificationCode.trim(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Berhasil, Siswa telah meminjam buku");
        setShowBorrowModal(false);
        setVerificationCode("");
        setSelectedPeminjaman(null);
        loadPeminjaman(); 
      } else {
        alert(data.message || "Gagal mengubah status peminjaman");
      }
    } catch (error) {
      console.error("Error borrowing:", error);
      alert("Terjadi kesalahan saat mengubah status peminjaman");
    } finally {
      setProcessing(false);
    }
  };

  const openReturnModal = (peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setKondisiBuku("baik");
    setCatatan("");
    setShowReturnModal(true);
  };

  const handleReturn = async () => {
    if (!selectedPeminjaman || !session?.user?.id) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(
        getApiUrl(`/api/peminjaman/${selectedPeminjaman.id}/mark-returned`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            petugas_id: Number(session.user.id),
            kondisi_buku: kondisiBuku,
            catatan: catatan.trim() || null,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Buku berhasil ditandai sebagai dikembalikan");
        setShowReturnModal(false);
        setKondisiBuku("baik");
        setCatatan("");
        setSelectedPeminjaman(null);
        loadPeminjaman(); 
      } else {
        const errorMsg = data.error || data.message || "Gagal menandai buku sebagai dikembalikan";
        alert(`Error: ${errorMsg}`);
        console.error("Return error response:", data);
      }
    } catch (error) {
      console.error("Error returning book:", error);
      alert(`Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setShowRejectModal(true);
  };

  const openBorrowModal = (peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setShowBorrowModal(true);
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
      borrowed: (
        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 flex items-center gap-1">
          <BookOpen size={12} />
          Sedang Dipinjam
        </span>
      ),
      rejected: (
        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle size={12} />
          Ditolak
        </span>
      ),
      returned: (
        <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800 flex items-center gap-1">
          <CheckCircle size={12} />
          Dikembalikan
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
            {peminjaman.length} peminjaman dengan status {filter}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b mb-6">
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
        <button
          onClick={() => setFilter("returned")}
          className={`px-4 py-2 font-medium transition ${
            filter === "returned"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Dikembalikan
        </button>
      </div>

      {peminjaman.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            {filter === "waiting"
              ? "Tidak ada peminjaman yang menunggu"
              : `Tidak ada peminjaman dengan status ${filter}`}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {filter === "waiting"
              ? "Semua peminjaman sudah diproses"
              : "Belum ada peminjaman dengan status ini"}
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
                <div className="shrink-0">
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
                {p.tanggal_pinjam && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Tanggal Pinjam:</span> {formatDate(p.tanggal_pinjam)}
                  </p>
                )}
                {p.tanggal_kembali && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Batas Kembali:</span> {formatDate(p.tanggal_kembali)}
                  </p>
                )}
                {p.tanggal_dikembalikan && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    <span className="font-medium">Tanggal Dikembalikan:</span> {formatDate(p.tanggal_dikembalikan)}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Diajukan: {formatDate(p.created_at)}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                {filter === "waiting" && (
                  <>
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
                  </>
                )}
                {filter === "accepted" && (
                  <button
                    onClick={() => openBorrowModal(p)}
                    disabled={processing}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Key size={16} />
                    Tandai Dipinjam
                  </button>
                )}
                {filter === "borrowed" && (
                  <button
                    onClick={() => openReturnModal(p)}
                    disabled={processing}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Tandai Dikembalikan
                  </button>
                )}
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

      {showReturnModal && selectedPeminjaman && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Pengembalian Buku</h2>
            <p className="text-sm text-gray-600 mb-2">
              Buku: <span className="font-medium">{selectedPeminjaman.judul}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Peminjam: <span className="font-medium">{selectedPeminjaman.name || selectedPeminjaman.username}</span>
            </p>
            
            <label className="block text-sm font-medium mb-2">
              Kondisi Buku <span className="text-red-500">*</span>
            </label>
            <select
              value={kondisiBuku}
              onChange={(e) => setKondisiBuku(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            >
              <option value="baik">Baik</option>
              <option value="rusak_ringan">Rusak Ringan</option>
              <option value="rusak_berat">Rusak Berat</option>
              <option value="hilang">Hilang</option>
            </select>

            <label className="block text-sm font-medium mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Masukkan catatan pengembalian..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setKondisiBuku("baik");
                  setCatatan("");
                  setSelectedPeminjaman(null);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleReturn}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Memproses..." : "Konfirmasi Pengembalian"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBorrowModal && selectedPeminjaman && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Tandai Buku Dipinjam</h2>
            <p className="text-sm text-gray-600 mb-2">
              Buku: <span className="font-medium">{selectedPeminjaman.judul}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Peminjam: <span className="font-medium">{selectedPeminjaman.name || selectedPeminjaman.username}</span>
            </p>
            <label className="block text-sm font-medium mb-2">
              Masukkan Kode Verifikasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Masukkan kode verifikasi..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              maxLength={4}
            />
            <p className="text-xs text-gray-500 mb-4">
              Masukkan kode verifikasi 4 digit yang diberikan saat menyetujui peminjaman
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowBorrowModal(false);
                  setVerificationCode("");
                  setSelectedPeminjaman(null);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleBorrow}
                disabled={processing || !verificationCode.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Memproses..." : "Tandai Dipinjam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

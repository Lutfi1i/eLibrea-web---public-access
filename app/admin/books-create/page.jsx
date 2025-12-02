"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export default function AddBookPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 5MB");
      return;
    }

    // Validasi tipe file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Tipe file tidak valid! Gunakan: jpg, jpeg, png, gif, atau webp");
      return;
    }

    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("judul", e.target.judul.value);
      formData.append("penulis", e.target.penulis.value);
      formData.append("tahun_terbit", e.target.tahun_terbit.value);
      formData.append("jumlah_halaman", e.target.jumlah_halaman.value);
      formData.append("ISBN", e.target.ISBN.value);
      formData.append("kategori", e.target.kategori.value);
      formData.append("stok", e.target.stok.value);
      formData.append("bahasa", e.target.bahasa.value);
      formData.append("penerbit", e.target.penerbit.value);
      formData.append("deskripsi", e.target.deskripsi.value);

      // ⭐ PENTING: Backend Elysia menggunakan nama field "cover_picture"
      if (coverFile) {
        formData.append("cover_picture", coverFile);
      }

      // Debug: Cek isi FormData sebelum dikirim
      console.log('📤 Sending FormData:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const res = await fetch(getApiUrl("/api/buku"), {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (res.ok && data.success) {
        alert("✅ Buku berhasil ditambahkan!");
        
        // Reset form
        e.target.reset();
        setPreview(null);
        setCoverFile(null);
        
        // Redirect ke halaman list
        router.push("/admin/books-lists");
      } else {
        const errorMsg = data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        console.error("Error creating book:", errorMsg, data);
        alert(`❌ Gagal menambah buku: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Terjadi kesalahan saat menambah buku");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL saat component unmount
  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      setCoverFile(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Tambah Buku Baru</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Fields */}
        <div className="space-y-5">
          <div>
            <Label htmlFor="judul">Judul Buku *</Label>
            <Input 
              id="judul"
              name="judul" 
              placeholder="Masukkan judul buku" 
              required 
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="penulis">Penulis *</Label>
            <Input 
              id="penulis"
              name="penulis" 
              placeholder="Nama penulis" 
              required 
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="tahun_terbit">Tahun Terbit *</Label>
            <Input
              id="tahun_terbit"
              type="number"
              name="tahun_terbit"
              placeholder="2024"
              min="1000"
              max="9999"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="jumlah_halaman">Jumlah Halaman *</Label>
            <Input
              id="jumlah_halaman"
              type="number"
              name="jumlah_halaman"
              placeholder="Ketik jumlah halaman"
              min="1"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="ISBN">ISBN *</Label>
            <Input 
              id="ISBN"
              name="ISBN" 
              placeholder="978-1234-5678" 
              required 
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="kategori">Kategori *</Label>
            <Input
              id="kategori"
              name="kategori"
              placeholder="Novel, Pelajaran, Sejarah..."
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="stok">Stok gudang *</Label>
            <Input
              id="stok"
              name="stok"
              placeholder="..."
               min="1000"
              max="9999"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="bahasa">Bahasa *</Label>
            <Input
              id="bahasa"
              name="bahasa"
              placeholder="Indonesia, Inggris, Jerman..."
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="penerbit">Penerbit *</Label>
            <Input
              id="penerbit"
              name="penerbit"
              placeholder="PT Graha Ardimeta..."
              required
              disabled={loading}
            />
          </div>
            <div>
            <Label htmlFor="deskripsi">deskripsi *</Label>
            <Input
              id="deskripsi"
              name="deskripsi"
              placeholder="..."
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-5">
          <div>
            <Label htmlFor="cover">Cover Buku (Opsional)</Label>
            <Input 
              id="cover"
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
              onChange={handleImage}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: JPG, PNG, GIF, WEBP. Max: 5MB
            </p>

            {preview ? (
              <div className="mt-4 relative">
                <Image
                  src={preview}
                  width={200}
                  height={300}
                  alt="Preview cover buku"
                  className="rounded shadow-lg object-cover"
                  style={{ width: "200px", height: "300px" }}
                />
                <button
                  type="button"
                  onClick={handleCancel}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="mt-4 w-[200px] h-[300px] bg-gray-200 flex items-center justify-center text-sm rounded border-2 border-dashed border-gray-300">
                <span className="text-gray-400">Preview Cover</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Menambahkan..." : "Tambah Buku"}
            </Button>
            
            {preview && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Hapus Cover
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { getApiUrl, getImageUrl } from "@/lib/api";
import defaultNullImage from "@/public/Book-Untitled-cover.png";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id;

  const [book, setBook] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch book data
  useEffect(() => {
    const loadBook = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/buku/${bookId}`));
        if (res.ok) {
          const data = await res.json();
          setBook(data);
          if (data.cover_picture) {
            setPreview(getImageUrl(data.cover_picture));
          }
        } else {
          alert("Buku tidak ditemukan");
          router.push("/admin/books-lists");
        }
      } catch (error) {
        console.error("Error loading book:", error);
        alert("Gagal memuat data buku");
        router.push("/admin/books-lists");
      } finally {
        setFetching(false);
      }
    };

    if (bookId) {
      loadBook();
    }
  }, [bookId, router]);

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

  const handleCancelImage = () => {
    if (preview && coverFile) {
      URL.revokeObjectURL(preview);
      setPreview(book?.cover_picture ? getImageUrl(book.cover_picture) : null);
      setCoverFile(null);
    }
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

      // Jika ada file cover baru, tambahkan ke FormData
      if (coverFile) {
        formData.append("cover_picture", coverFile);
      } else if (book?.cover_picture) {
        // Jika tidak ada file baru tapi ada cover lama, kirim path yang ada
        formData.append("cover_picture", book.cover_picture);
      }

      const res = await fetch(getApiUrl(`/api/buku/${bookId}`), {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Buku berhasil diupdate!");
        router.push("/admin/books-lists");
      } else {
        const errorMsg = data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        console.error("Error updating book:", errorMsg, data);
        alert(`❌ Gagal mengupdate buku: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Terjadi kesalahan saat mengupdate buku");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center">Memuat data buku...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center text-red-500">Buku tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Edit Buku</h1>

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
              defaultValue={book.judul}
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
              defaultValue={book.penulis}
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
              defaultValue={book.tahun_terbit}
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
              defaultValue={book.jumlah_halaman}
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
              defaultValue={book.ISBN}
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
              defaultValue={book.kategori}
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
              Format: JPG, PNG, GIF, WEBP. Max: 5MB. Kosongkan jika tidak ingin mengubah cover.
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
                  onError={(e) => {
                    e.target.src = defaultNullImage.src;
                  }}
                />
                {coverFile && (
                  <button
                    type="button"
                    onClick={handleCancelImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 w-[200px] h-[300px] bg-gray-200 flex items-center justify-center text-sm rounded border-2 border-dashed border-gray-300">
                <span className="text-gray-400">No Cover</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Mengupdate..." : "Simpan Perubahan"}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/books-lists")}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}


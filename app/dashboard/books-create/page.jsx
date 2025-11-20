"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function AddBookPage() {
  const [preview, setPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", e.target.judul.value);
    formData.append("penulis", e.target.penulis.value);
    formData.append("tahun_terbit", e.target.tahun_terbit.value);
    formData.append("jumlah_halaman", e.target.jumlah_halaman.value);
    formData.append("ISBN", e.target.ISBN.value);
    formData.append("kategori", e.target.kategori.value);

    if (coverFile) {
      formData.append("cover", coverFile);
    }

    const res = await fetch("/api/admin/books", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Buku berhasil ditambahkan!");
    } else {
      alert("Gagal menambah buku");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold mb-6">Tambah Buku Baru</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        encType="multipart/form-data"
      >
        {/* Left Fields */}
        <div className="space-y-5">
          <div>
            <Label>Judul Buku</Label>
            <Input name="judul" placeholder="Masukkan judul buku" required />
          </div>

          <div>
            <Label>Penulis</Label>
            <Input name="penulis" placeholder="Nama penulis" required />
          </div>

          <div>
            <Label>Tahun Terbit</Label>
            <Input
              type="number"
              name="tahun_terbit"
              placeholder="2020"
              required
            />
          </div>

          <div>
            <Label>Jumlah Halaman</Label>
            <Input
              type="number"
              name="jumlah_halaman"
              placeholder="Ketik jumlah halaman"
              required
            />
          </div>

          <div>
            <Label>ISBN</Label>
            <Input name="ISBN" placeholder="Contoh: 978-1234-5678" required />
          </div>

          <div>
            <Label>Kategori</Label>
            <Input
              name="kategori"
              placeholder="Novel, Pelajaran, Sejarah..."
              required
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-5">
          <div>
            <Label>Cover Buku</Label>
            <Input type="file" accept="image/*" onChange={handleImage} />

            {preview ? (
              <Image
                src={preview}
                width={200}
                height={300}
                alt="Preview"
                className="mt-4 rounded shadow"
              />
            ) : (
              <div className="mt-4 w-[200px] h-[300px] bg-gray-200 flex items-center justify-center text-sm rounded">
                Preview
              </div>
            )}
          </div>

          <Button type="submit" className="w-full py-3 text-lg font-semibold">
            Tambah Buku
          </Button>
        </div>
      </form>
    </div>
  );
}

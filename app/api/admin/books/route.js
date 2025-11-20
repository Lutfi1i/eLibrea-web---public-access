import { NextResponse } from "next/server";
import connection from "@/lib/database";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const judul = formData.get("judul");
    const penulis = formData.get("penulis");
    const tahun_terbit = formData.get("tahun_terbit");
    const jumlah_halaman = formData.get("jumlah_halaman");
    const ISBN = formData.get("ISBN");
    const kategori = formData.get("kategori");

    const cover = formData.get("cover");
    let imagePath = null;

    if (cover) {
      const bytes = await cover.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "covers");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = Date.now() + "-" + cover.name;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      imagePath = "/covers/" + fileName;
    }

    await connection.execute(
      `INSERT INTO buku (judul, penulis, tahun_terbit, jumlah_halaman, ISBN, cover_picture, kategori)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        judul,
        penulis,
        tahun_terbit,
        jumlah_halaman,
        ISBN,
        imagePath,
        kategori,
      ]
    );

    return NextResponse.json({ message: "Buku berhasil ditambahkan" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

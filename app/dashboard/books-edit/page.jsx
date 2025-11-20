import { query } from "@/lib/query";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- SERVER ACTION: UPDATE BOOK ---
async function updateBook(formData) {
  "use server";

  const id = formData.get("id");
  const judul = formData.get("judul");
  const penulis = formData.get("penulis");
  const tahun = formData.get("tahun_terbit");
  const halaman = formData.get("jumlah_halaman");
  const isbn = formData.get("isbn");

  await query(
    `UPDATE Buku SET judul=?, penulis=?, tahun_terbit=?, jumlah_halaman=?, ISBN=? WHERE id=?`,
    [judul, penulis, tahun, halaman, isbn, id]
  );

  revalidatePath("/books-list");
  redirect("/books-list");
}

// --- PAGE COMPONENT ---
export default async function page({ params }) {
  const { id } = params;

  const buku = await query(`SELECT * FROM Buku WHERE id = ?`, [id]);

  if (!buku || buku.length === 0) {
    return <div className="p-4">Buku tidak ditemukan.</div>;
  }

  const data = buku[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Buku</h1>

      <form action={updateBook} className="max-w-md space-y-4">
        <input type="hidden" name="id" defaultValue={data.id} />

        <div>
          <label className="block font-semibold">Judul</label>
          <input
            type="text"
            name="judul"
            defaultValue={data.judul}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Penulis</label>
          <input
            type="text"
            name="penulis"
            defaultValue={data.penulis}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Tahun Terbit</label>
          <input
            type="number"
            name="tahun_terbit"
            defaultValue={data.tahun_terbit}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Jumlah Halaman</label>
          <input
            type="number"
            name="jumlah_halaman"
            defaultValue={data.jumlah_halaman}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">ISBN</label>
          <input
            type="text"
            name="isbn"
            defaultValue={data.ISBN}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

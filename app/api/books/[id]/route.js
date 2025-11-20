import connection from "@/lib/database";
import { NextResponse } from "next/server";

export async function DELETE(id) {
try {
    await connection.execute(
    `DELETE FROM buku WHERE id = ?`, 
    [id]
    )
    revalidatePath('/books-lists')
    return { success: true, message: 'Barang berhasil dihapus!' }

} catch (error) {
  return NextResponse.json({ message: "Buku dihapus" });
    }
}

import connection from "@/lib/database";
import { NextResponse } from "next/server";

export async function databuku() {
    const [rows] = await connection.query(
        'SELECT * FROM buku'
    );

    return rows;
}

export async function GET() {
  try {
    const [rows] = await connection.query("SELECT * FROM Buku ");
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

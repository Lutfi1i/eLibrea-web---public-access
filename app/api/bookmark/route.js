import { getServerSession } from "next-auth";
import connection from "@/lib/database";

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { book_id } = await req.json();

  await connection.execute(
    "INSERT IGNORE INTO bookmark (user_id, book_id) VALUES (?, ?)",
    [session.user.id, book_id]
  );

  return Response.json({ success: true });
}

export async function DELETE(req) {
    const session = await getServerSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
    const { book_id } = await req.json();
  
    await connection.execute(
      "DELETE FROM bookmark WHERE user_id = ? AND book_id = ?",
      [session.user.id, book_id]
    );
  
    return Response.json({ success: true });
  }
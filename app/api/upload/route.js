// Pastikan route handler ini berjalan di runtime Node (bukan edge)
export const runtime = "nodejs";
// Paksa route dinamis agar tidak diprerender saat build
export const dynamic = "force-dynamic";

import { writeFile } from 'fs/promises';
import path from 'path';
import connection from '@/lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file');
  const userId = formData.get('userId');

  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);
  await writeFile(filepath, buffer);

  // Simpan path di database
  const [result] = await connection.execute(
    'UPDATE pengguna SET profile_picture = ? WHERE id = ?',
    [`/uploads/${filename}`, userId]
  );

  return Response.json({ message: 'Upload success', filePath: `/uploads/${filename}` });
}

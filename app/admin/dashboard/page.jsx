import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getApiUrl, getImageUrl } from "@/lib/api";

async function fetchData(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch ${url}:`, res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }
    if (data.success && data.data) {
      return data.data;
    }
    if (data.data) {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

export default async function AdminDashboard() {
  const sessionLogin = await getServerSession(authOptions);
  const user = sessionLogin?.user;

  // Fetch data from multiple endpoints
  const [booksData, usersData, borrowData, populerBooksData] = await Promise.all([
    fetchData(getApiUrl("/api/buku")),
    fetchData(getApiUrl("/api/pengguna")),
    fetchData(getApiUrl("/api/peminjaman/all")),
    fetchData(getApiUrl("/api/buku"))
  ]);

  // Ensure data is arrays
  const books = Array.isArray(booksData) ? booksData : [];
  const users = Array.isArray(usersData) ? usersData : [];
  const borrows = Array.isArray(borrowData) ? borrowData : [];
  const popularBooks = Array.isArray(populerBooksData) ? populerBooksData : [];

  // Calculate statistics
  const totalBuku = books.length;
  const totalPengguna = users.length;
  
  // Filter peminjaman hari ini
  const today = new Date().toISOString().split('T')[0];
  const bukuDipinjamHariIni = borrows.filter(item => {
    if (!item.tanggal_pinjam) return false;
    const dateStr = typeof item.tanggal_pinjam === 'string' 
      ? item.tanggal_pinjam.split('T')[0]
      : new Date(item.tanggal_pinjam).toISOString().split('T')[0];
    return dateStr === today;
  }).length;

  // Calculate total denda bulan ini (if denda field exists)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const totalDendaBulanIni = borrows.reduce((sum, item) => {
    if (!item.tanggal_pinjam) return sum;
    const borrowDate = new Date(item.tanggal_pinjam);
    if (borrowDate.getMonth() === currentMonth && borrowDate.getFullYear() === currentYear) {
      // Calculate denda if overdue (example: 5000 per day)
      if (item.status === 'overdue' || item.status === 'borrowed') {
        const returnDate = item.tanggal_kembali ? new Date(item.tanggal_kembali) : new Date();
        const daysOverdue = Math.max(0, Math.floor((new Date() - returnDate) / (1000 * 60 * 60 * 24)));
        return sum + (daysOverdue * 5000);
      }
    }
    return sum;
  }, 0);

  // Get peminjaman aktif (status: 'waiting' or 'accepted' or 'borrowed')
  const peminjamanAktif = borrows.filter(item => 
    item.status === 'waiting' || item.status === 'accepted' || item.status === 'borrowed'
  ).slice(0, 5);

  // Get aktivitas terakhir (5 terakhir)
  const aktivitasTerakhir = borrows.slice(0, 5);

  // Get buku populer (sort by how many times borrowed)
  const bukuPopuler = popularBooks
    .map(book => {
      const borrowCount = borrows.filter(b => b.book_id === book.id).length;
      return { ...book, jumlah_dipinjam: borrowCount };
    })
    .sort((a, b) => (b.jumlah_dipinjam || 0) - (a.jumlah_dipinjam || 0))
    .slice(0, 3);

  // Prepare chart data (last 30 days)
  const chartData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = borrows.filter(item => {
      if (!item.tanggal_pinjam) return false;
      const itemDateStr = typeof item.tanggal_pinjam === 'string' 
        ? item.tanggal_pinjam.split('T')[0]
        : new Date(item.tanggal_pinjam).toISOString().split('T')[0];
      return itemDateStr === dateStr;
    }).length;
    
    chartData.push({
      date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      count
    });
  }

  return (
    <div className="bg-linear-to-b w-full from-white to-gray-100 text-slate-900">
      <main className="flex-1 p-8">
        
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Buku" value={totalBuku.toLocaleString('id-ID')} />
          <StatCard title="Buku Dipinjam Hari Ini" value={bukuDipinjamHariIni.toString()} accent />
          <StatCard title="Total Pengguna" value={totalPengguna.toLocaleString('id-ID')} />
          <StatCard title="Total Denda Bulan Ini" value={`Rp ${totalDendaBulanIni.toLocaleString('id-ID')}`} />
        </section>

        {/* Charts + Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Grafik Peminjaman (30 hari)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 flex items-end justify-between gap-1 px-2">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-red-500 rounded-t hover:bg-red-600 transition-colors"
                      style={{ 
                        height: `${Math.max(item.count * 10, 4)}px`,
                        minHeight: '4px'
                      }}
                      title={`${item.date}: ${item.count} peminjaman`}
                    />
                    {idx % 5 === 0 && (
                      <span className="text-[9px] text-slate-400 rotate-45 origin-left mt-2">
                        {item.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {aktivitasTerakhir.length > 0 ? (
                  aktivitasTerakhir.map((item, idx) => {
                    const statusColor = 
                      item.status === 'accepted' ? 'bg-emerald-600' :
                      item.status === 'waiting' ? 'bg-yellow-500' :
                      item.status === 'returned' ? 'bg-blue-600' :
                      item.status === 'borrowed' ? 'bg-blue-500' :
                      item.status === 'rejected' ? 'bg-red-600' :
                      'bg-gray-500';
                    
                    const statusText = 
                      item.status === 'accepted' ? 'disetujui' :
                      item.status === 'waiting' ? 'menunggu persetujuan' :
                      item.status === 'returned' ? 'dikembalikan' :
                      item.status === 'borrowed' ? 'sedang dipinjam' :
                      item.status === 'rejected' ? 'ditolak' :
                      item.status || 'tidak diketahui';

                    const timeAgo = getTimeAgo(item.tanggal_pinjam);

                    return (
                      <li key={item.id || idx} className="flex items-start gap-3">
                        <div className={`w-2 h-2 ${statusColor} rounded-full mt-2`} />
                        <div>
                          <div className="font-medium">
                            {item.name || item.username || 'User'} - {item.judul || 'Buku'} ({statusText})
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.tanggal_pinjam ? new Date(item.tanggal_pinjam).toLocaleString('id-ID') : 'N/A'} — {timeAgo}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-sm text-slate-400 text-center py-4">
                    Belum ada aktivitas
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Buku Populer + Peminjaman Aktif */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Buku Populer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {bukuPopuler.length > 0 ? (
                  bukuPopuler.map((book, idx) => (
                    <div key={book.id || idx} className="space-y-2 text-center">
                      <div className="w-full h-40 bg-gray-200 rounded-md shadow-sm overflow-hidden">
                        {book.cover_picture ? (
                          <img 
                            src={getImageUrl(book.cover_picture)} 
                            alt={book.judul}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            📚
                          </div>
                        )}
                      </div>
                      <div className="font-semibold text-sm line-clamp-2">
                        {book.judul || 'Judul Buku'}
                      </div>
                      <div className="text-xs text-slate-500">
                        Dipinjam {book.jumlah_dipinjam || 0}x
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-slate-400 py-8">
                    Belum ada data buku populer
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Peminjaman Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500 text-xs border-b">
                    <tr>
                      <th className="pb-2">Nama</th>
                      <th className="pb-2">Judul Buku</th>
                      <th className="pb-2">Tanggal Pinjam</th>
                      <th className="pb-2">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {peminjamanAktif.length > 0 ? (
                      peminjamanAktif.map((item, idx) => (
                        <tr key={item.id || idx} className="border-b">
                          <td className="py-3">{item.name || item.username || 'N/A'}</td>
                          <td className="py-3 line-clamp-1">{item.judul || 'N/A'}</td>
                          <td className="py-3">
                            {item.tanggal_pinjam ? new Date(item.tanggal_pinjam).toLocaleDateString('id-ID') : 'N/A'}
                          </td>
                          <td className="py-3">
                            {item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-400">
                          Tidak ada peminjaman aktif
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </section>
      </main>
    </div>
  );
}

/* Helper function */
function getTimeAgo(dateString) {
  if (!dateString) return 'Baru saja';
  
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return past.toLocaleDateString('id-ID');
}

/* Small Reusable Component */
function StatCard({ title, value, accent }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{title}</div>
            <div
              className={`text-2xl font-extrabold ${
                accent ? "text-red-600" : "text-slate-900"
              }`}
            >
              {value}
            </div>
          </div>

          <div className="text-2xl text-slate-300">📚</div>
        </div>
      </CardContent>
    </Card>
  );
}
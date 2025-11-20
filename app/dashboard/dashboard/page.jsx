import React from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Kamu bisa ganti dengan gambar avatar kamu
const AVATAR_IMG = "/default-avatar.png";

export default async function AdminDashboard() {
    const sessionLogin = await getServerSession(authOptions)
    const user = sessionLogin?.user
  
  return (
    <div className="bg-linear-to-b w-full from-white to-gray-100 text-slate-900">

      <main className="flex-1 p-8">
        
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Buku" value="1.238" />
          <StatCard title="Buku Dipinjam Hari Ini" value="73" accent />
          <StatCard title="Total Pengguna" value="4.512" />
          <StatCard title="Total Denda Bulan Ini" value="Rp 3.450.000" />
        </section>

        {/* Charts + Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Grafik Peminjaman (30 hari)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 flex items-center justify-center text-slate-400">
                [Grafik Line / Bar - Integrasikan Recharts / Chart.js]
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Lutfi meminjam &quot;Bumi&quot;</div>
                    <div className="text-xs text-slate-500">
                      10:45 — 2 hari lalu
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">
                      Salsa mengembalikan &quot;IPA Kelas 8&quot;
                    </div>
                    <div className="text-xs text-slate-500">
                      09:12 — 1 hari lalu
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">
                      Denda ditambahkan untuk user #122
                    </div>
                    <div className="text-xs text-slate-500">Kemarin</div>
                  </div>
                </li>
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
                {[1,2,3].map((i) => (
                  <div key={i} className="space-y-2 text-center">
                    <div className="w-full h-40 bg-gray-200 rounded-md shadow-sm" />
                    <div className="font-semibold">Judul Buku Populer</div>
                    <div className="text-xs text-slate-500">Dipinjam 152x</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Peminjaman Aktif</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <tr className="border-b">
                    <td className="py-3">Lutfi</td>
                    <td className="py-3">Bumi</td>
                    <td className="py-3">2025-11-15</td>
                    <td className="py-3">2025-11-22</td>
                  </tr>
                  <tr>
                    <td className="py-3">Salsa</td>
                    <td className="py-3">IPA Kelas 8</td>
                    <td className="py-3">2025-11-13</td>
                    <td className="py-3">2025-11-20</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

        </section>
      </main>
    </div>
  );
}

/* Small Reusable Component */
function StatCard({ title, value, accent }) {
  return (
    <Card>
      <CardContent>
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

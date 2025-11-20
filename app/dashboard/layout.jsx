import AdminSidebar from './components/adminSidebar';
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default async function MainLayout({ children }) {

  const sessionLogin = await getServerSession(authOptions)
  const user = sessionLogin?.user

      return (
    <div className="flex h-screen w-full overflow-hidde">      
      <AdminSidebar />
      <div className="flex flex-1 p-4 flex-col">
         {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Dashboard Admin</h1>
            <p className="text-sm text-slate-500">
              Ringkasan aktivitas & statistik sistem
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Cari buku, pengguna, atau transaksi..."
              className="w-[420px]"
            />
            <Button variant="ghost" className="px-3 py-2">
              <Bell />
            </Button>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profile_picture} alt="avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
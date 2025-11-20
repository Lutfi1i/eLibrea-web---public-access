import { Search, MoreVertical } from "lucide-react";
import Image from "next/image";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function SearchBar() {
    const sessionLogin = await getServerSession(authOptions)
    const user = sessionLogin?.user
  
    console.log(sessionLogin)
  return (
    <div className="flex items-center justify-end px-4 py-2 ">
      {/* Search Input */}
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full max-w-md">
        <Search className="text-red-400 w-4 h-4 mr-2" />
        <input
          type="text"
          placeholder='Cari Buku "UTBK 2025"'
          className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-red-400 w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-4">
        {/* Avatar */}
      <Link href="/profile">
        <Image
          src={user.profile_picture}
          width={8}
          height={8}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        </Link>
        </div>
    </div>
  );
}

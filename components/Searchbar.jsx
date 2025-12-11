"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");

  const user = session?.user;
  const profilePicture = user?.profile_picture
    ?(user.profile_picture)
    : "/elib-default-profile-picture.png";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchKeyword.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-end px-4 py-2 ">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full max-w-md">
        <Search className="text-red-400 w-4 h-4 mr-2" />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Cari Buku "UTBK 2025"'
          className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-red-400 w-full"
        />
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-4">
        {/* Avatar */}
        {user && (
          <Link href="/profile">
            <Image
              src={profilePicture}
              width={32}
              height={32}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

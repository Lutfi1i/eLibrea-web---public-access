"use client"
import React, { useState } from "react";
import { Home, Bookmark, Settings, History, Book, ClockAlert } from "lucide-react";
import Logo from '../public/Logo1-librea.png';
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`h-screen bg-white shadow-lg flex flex-col justify-between transition-all duration-300 rounded-r-2xl
        ${isExpanded ? "w-56" : "w-16"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Top Section */}
      <div>
        <div className="flex flex-col items-center gap-4 py-4">
          <Image
            src={Logo}
            label="eLibrea"
            alt="Logo"
            className={`transition-all duration-300 ${isExpanded ? "w-8" : "w-8"}`}
          />
        </div>

        <nav className="flex flex-col gap-4 mt-4">

        <Link href="/">
          <SidebarItem
            icon={<Home size={20} />}
            label="Home"
            href="home"
            active={pathname.startsWith("/home")}
            expanded={isExpanded}
            />
        </Link>

        <Link href="/bookmark">
          <SidebarItem
            icon={<Bookmark size={20} />}
            label="Bookmark"
            active={pathname.startsWith("/bookmark")}
            expanded={isExpanded}
            />
        </Link>

        <Link href="/peminjaman">
          <SidebarItem
            icon={<Book size={20} />}
            label="Peminjaman"
            active={pathname.startsWith("/peminjaman")}
            expanded={isExpanded}
            />
        </Link>

        <Link href="/pengembalian">
          <SidebarItem
            icon={<History size={20} />}
            label="Pengembalian"
            active={pathname.startsWith("/pengembalian")}
            expanded={isExpanded}
            />
        </Link>

        <Link href="/denda">
          <SidebarItem
            icon={<ClockAlert size={20} />}
            label="Denda"
            active={pathname.startsWith("/denda")}
            expanded={isExpanded}
            />
        </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mb-4">
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          expanded={isExpanded}
        />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, expanded }) {
  return (
    <div
      className={`flex items-center cursor-pointer transition-colors px-4 py-2 rounded-lg mx-2
        ${active ? "text-red-500 font-bold" : "text-gray-500 hover:text-red-500"}`}
    >
      {icon}
      {expanded && (
        <span
          className={`ml-3 text-sm transition-opacity ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

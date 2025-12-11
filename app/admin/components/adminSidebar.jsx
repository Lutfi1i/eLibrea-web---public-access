"use client";
import React, { useState } from "react";
import { Home, Settings, UserCog, Users, BookPlus, BookDown, BookCopy } from "lucide-react";
import Logo from "@/public/Logo1-librea.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Cek apakah user adalah admin
  const isAdmin = session?.user?.role === "admin";

  return (
    <div
      className={`h-screen bg-white shadow-lg flex flex-col justify-between transition-all duration-300 rounded-r-2xl
        ${isExpanded ? "w-56" : "w-16"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Top */}
      <div>
        <div className="flex flex-col items-center py-4">
          <Image
            src={Logo}
            alt="Logo"
            className="w-8"
          />
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            href="/admin"
            active={pathname === "/admin/dashboard" || pathname === "/admin"}
            expanded={isExpanded}
            onClick={() => router.push("/admin/dashboard")}
          />

          <SidebarItem
            icon={<BookPlus size={20} />}
            label="Tambah Buku"
            href="/admin/books-create"
            active={pathname.startsWith("/admin/books-create")}
            expanded={isExpanded}
            onClick={() => router.push("/admin/books-create")}
          />

          <SidebarItem
            icon={<BookDown size={20} />}
            label="Peminjaman"
            href="/admin/peminjaman"
            active={pathname.startsWith("/admin/peminjaman") || pathname.startsWith("/admin/books-borrow")}
            expanded={isExpanded}
            onClick={() => router.push("/admin/peminjaman")}
          />
          <div className=" h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50"></div>

          <SidebarItem
            label="Master Data"
            expanded={isExpanded}
          />

          <SidebarItem
            icon={<BookCopy size={20} />}
            label="Buku"
            href="/admin/books-lists"
            active={pathname.startsWith("/admin/books-lists") || pathname.startsWith("/admin/books-edit")}
            expanded={isExpanded}
            onClick={() => router.push("/admin/books-lists")}
          />

          {/* Hanya tampilkan menu Petugas jika role adalah admin */}
          {isAdmin && (
            <SidebarItem
              icon={<UserCog size={20} />}
              label="Petugas"
              href="/admin/petugas-lists"
              active={pathname.startsWith("/admin/petugas-lists")}
              expanded={isExpanded}
              onClick={() => router.push("/admin/petugas-lists")}
            />
          )}

          {/* Hanya tampilkan menu Pengguna jika role adalah admin */}
          {isAdmin && (
            <SidebarItem
              icon={<Users size={20} />}
              label="Pengguna"
              href="/admin/pengguna-lists"
              active={pathname.startsWith("/admin/pengguna-lists")}
              expanded={isExpanded}
              onClick={() => router.push("/admin/pengguna-lists")}
            />
          )}

        </nav>
      </div>

      {/* Bottom */}
      <div className="mb-4">
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          href="/dashboard/settings"
          active={pathname.startsWith("/dashboard/settings")}
          expanded={isExpanded}
          onClick={() => router.push("/dashboard/settings")}
        />

        <SidebarItem
          image={session?.user?.profile_picture}
          label={session?.user?.name}
          sublabel={session?.user?.email}
          expanded={isExpanded}
        />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, expanded, image, sublabel, onClick }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`flex items-center px-4 py-2 mx-2 rounded-lg cursor-pointer transition-colors
      ${active ? "text-red-500 bg-red-100" : "text-gray-600 hover:text-red-500 hover:bg-gray-100"}
      ${!label ? "pointer-events-none" : ""}
      `}
    >
      {image ? (
        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-300 shrink-0">
          {!imageError ? (
            <Image
              src={image}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-300 text-xs font-medium text-gray-600">
              {label?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ) : (
        icon
      )}

      {expanded && (
        <div className="ml-3 flex flex-col">
          <span className="text-sm font-medium">{label}</span>
          {sublabel && (
            <span className="text-xs text-gray-500">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
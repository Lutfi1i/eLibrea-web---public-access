"use client"
import React, { useState } from "react";
import { Home, Bookmark, Settings } from "lucide-react";
import Logo from '../public/Logo1-librea.png';
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

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
            expanded={isExpanded}
            className={`transition-all duration-300 ${isExpanded ? "w-8" : "w-8"}`}
          />
        </div>

        <nav className="flex flex-col gap-4 mt-4">

        <a href="home">
          <SidebarItem
            icon={<Home size={20} />}
            label="Home"
            href="home"
            active={pathname.startsWith("/home")}
            expanded={isExpanded}
            onclick={() => router.push("/home")}
            />
        </a>

        <a href="bookmark">
          <SidebarItem
            icon={<Bookmark size={20} />}
            label="Bookmark"
            active={pathname.startsWith("/bookmark")}
            expanded={isExpanded}
            onclick={() => router.push("/bookmark")}
            />
        </a>
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
      onclick={onclick}
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

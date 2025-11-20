"use client";

import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-red-400 rounded-sm text-white font-bold h-10 w-20 hover:bg-red-500 transition"
    >
      Log Out
    </button>
  );
}

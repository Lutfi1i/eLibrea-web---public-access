import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token; 
    
    // Redirect authenticated users dari halaman publik ke /home
    if (
      token && 
      (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    // Cek akses ke area admin
    if (pathname.startsWith("/admin")) {
      const role = token?.role;
      
      // Jika bukan admin atau petugas, redirect ke 404
      if (role !== "admin" && role !== "petugas") {
        return NextResponse.redirect(new URL("/404", req.url));
      }
      
      // Jika petugas mencoba akses /admin/users, redirect ke 404
      if (role === "petugas" && pathname.startsWith("/admin/petugas-lists")) {
        return NextResponse.redirect(new URL("/404", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // tetap izinkan masuk middleware
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/books-create/:path*",
    "/login",
    "/register",
    "/",
  ],
};
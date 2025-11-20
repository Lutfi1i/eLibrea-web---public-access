import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token; 
    if (
      token && 
      (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    if (
      (pathname.startsWith("/dashboard") || pathname.startsWith("/books-create")) &&
      token?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/404", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // tetap izinkan masuk middleware
    },
  }
);

// =============================
// 3. Routes yang dilindungi
// =============================
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/books-create/:path*",
    "/login",
    "/register",
    "/",
  ],
};

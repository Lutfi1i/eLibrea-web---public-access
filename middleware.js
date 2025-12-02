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
      (pathname.startsWith("/admin")) &&
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


export const config = {
  matcher: [
    "/admin/:path*",
    "/books-create/:path*",
    "/login",
    "/register",
    "/",
  ],
};

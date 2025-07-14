import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchTableById } from "./app/api/crud";

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const userId = req.auth?.user?.id;
  const token = req.auth?.token;
  const userType = req.auth?.user?.userType?.toLowerCase();

  console.log("Middleware check:");
  console.log("userId:", userId);
  console.log("token:", token);
  console.log("userType:", userType);
  console.log("pathname:", pathname);

  const isAuthPage = pathname === "/login" || pathname === "/signin";
  const isAdminPage = pathname.startsWith("/admin");

  // 🔐 If NOT authenticated and trying to access a protected page
  if (!req.auth && !isAuthPage) {
    console.log("Not authenticated, redirecting to /signin");
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 Prevent logged-in users from visiting /login or /signin
  if (req.auth && isAuthPage) {
    console.log("Already authenticated, redirecting to home");
    return NextResponse.redirect(new URL("/", req.url)); // or redirect to "/dashboard"
  }

  // 🔐 Admin routes access control
  if (isAdminPage && userType !== "admin" && userType !== "instructor") {
    console.log("Unauthorized access to admin route");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 📌 Virtual table validation
  if (pathname.includes("/virtual-table/")) {
    const segments = pathname.split("/");
    const roomId = segments[segments.length - 1] || segments[segments.length - 2];

    if (roomId) {
      console.log("Checking virtual table for ID:", roomId);
      try {
        const data = await fetchTableById(roomId, token);
        if (!data) {
          console.log("Invalid table, redirecting");
          return NextResponse.redirect(new URL("/table-discovery/invalid-table", req.url));
        }
      } catch (err) {
        console.error("Error fetching table:", err);
        return NextResponse.redirect(new URL("/table-discovery/invalid-table", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/login",
    "/signin",
    "/table-discovery",
    "/calendar-schedule",
    "/dashboard",
    "/everyone",
    "/everyone/:path*",
    "/chat",
    "/virtual-table",
    "/virtual-table/:path*",
    "/profile",
    "/profile/edit",
    "/profile/edit/info",
    "/profile/edit/picture",
    "/profile/course-selection",
    "/admin/settings/:path*",
    "/admin/dashboard/:path*",
  ],
};

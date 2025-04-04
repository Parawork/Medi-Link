import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SessionUser } from "@/lib/types";
import { requireUser } from "./lib/requireUser";

// Define the protected routes and their allowed roles
const protectedRoutes = [
  {
    path: "/dashboardNew/patient",
    roles: ["PATIENT"],
  },
  {
    path: "/dashboardNew/pharmacy",
    roles: ["PHARMACY"],
  },
  {
    path: "/profile",
    roles: ["PATIENT", "PHARMACY"], // Both roles can access
  },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // 1. Check if the user is trying to access a protected route
    const protectedRoute = protectedRoutes.find((route) =>
      pathname.startsWith(route.path)
    );

    // 2. If it's not a protected route, continue
    if (!protectedRoute) {
      return NextResponse.next();
    }

    // 3. Use your existing requireUser function
    const user = await requireUser();

    // 4. Check if user has the required role
    const hasRequiredRole = protectedRoute.roles.includes(user.role);

    if (!hasRequiredRole) {
      // Redirect to unauthorized or home page
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 5. If everything is fine, continue
    return NextResponse.next();
  } catch (error) {
    // Handle errors from requireUser
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Fallback for unexpected errors
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     * - signup pages
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|sign-up|unauthorized).*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

// Create matchers based on the routes defined in your routeAccessMap
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log(matchers);

export default clerkMiddleware((auth, req) => {
  // Retrieve session claims from Clerk to check user roles
  const { sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role; // Use optional chaining to prevent errors if role is undefined

  if (!role) {
    // If no role is present in the session, deny access or redirect to a default page
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login or any other page
  }

  // Iterate through route matchers and check if the user has access
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      // If the role is not allowed for the route, redirect to the user’s role page
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  // Handle forwarding headers mismatch if running in GitHub Codespaces (or similar environments)
  const forwardedHost = req.headers.get("x-forwarded-host");
  const origin = req.headers.get("origin");

  // Fix the mismatch between forwarded host and origin
  if (forwardedHost && origin && forwardedHost !== origin) {
    const url = new URL(req.url);
    url.host = forwardedHost; // Override the host with the forwardedHost to avoid host mismatch errors
    return NextResponse.rewrite(url);
  }

  // Proceed to the next middleware or handler if no issues
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes, excluding Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

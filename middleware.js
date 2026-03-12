import { NextResponse } from "next/server";

const SHOPIFY_ACCOUNTS_URL = "https://accounts.setpiecesclothing.com";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Redirect all /account routes to Shopify accounts
  if (pathname.startsWith("/account")) {
    return NextResponse.redirect(SHOPIFY_ACCOUNTS_URL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/account/:path*",
};

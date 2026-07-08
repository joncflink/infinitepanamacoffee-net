import { NextRequest, NextResponse } from "next/server";

const OLD_HOSTS = new Set([
  "infinitepanamacoffee.net",
  "www.infinitepanamacoffee.net",
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (OLD_HOSTS.has(host)) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = "infinitepanamacoffee.com";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

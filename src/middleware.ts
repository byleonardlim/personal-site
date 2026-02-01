import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const method = request.method;

  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  return new NextResponse(null, { status: 405 });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

/**
 * @param {import('next/server').NextRequest} req
 */
export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Define public routes, removing '/' to be handled separately
  const publicRoutes = ['/compiler', '/login', '/auth/callback']

  // Check if the current route is public
  // This now checks for the homepage exactly OR if the path starts with another public route.
  const isPublicRoute =
    pathname === '/' || publicRoutes.some(route => pathname.startsWith(route))

  // If it's a protected route and the user isn't logged in, redirect
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
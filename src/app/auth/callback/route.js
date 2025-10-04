import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    // Exchange the temporary code for a user session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect the user back to the home page after login
  return NextResponse.redirect(requestUrl.origin)
}
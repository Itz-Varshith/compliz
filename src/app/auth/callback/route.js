// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export async function GET(request) {
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get('code')

//   if (code) {
//     // 👇 Await cookies() before passing to Supabase
//     const cookieStore = await cookies()
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

//     // Exchange the temporary code for a user session
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   // Redirect the user back to the home page after login
//   return NextResponse.redirect(requestUrl.origin)
// }

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange code for session
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    // ✅ Sync user to backend here
    if (session?.user) {
      console.log(session.user)
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: session.user }),
      })
    }
  }

  return NextResponse.redirect(requestUrl.origin)
}

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Define a function to create a Supabase client for server-side operations
export const createClient = () =>
  createServerComponentClient({
    cookies: cookies,
  })
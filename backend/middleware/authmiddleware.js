// middlewares/auth.js
import { createClient } from "@supabase/supabase-js"
import {PrismaClient} from "../generated/prisma/index.js"  // your Prisma client

const prisma=new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // use service role on backend
)

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" })
    }
  
    const token = authHeader.split(" ")[1] // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" })
    }

    // 2. Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" })
    }

    // 3. Check in your database
    let dbUser = await prisma.user.findUnique({
      where: { userEmail: user.email },
    })


    // 4. Attach to request
    req.user = dbUser
    next()
  } catch (err) {
    console.error("Auth middleware error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

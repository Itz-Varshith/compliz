"use client"

import Link from "next/link"
import { User, LogOut, LogIn, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Import the newly added components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
    router.push("/")
  }

  // Helper to get user's full name and initial
  const userName = user?.user_metadata?.full_name || user?.email || "User"
  const userInitial = userName?.charAt(0).toUpperCase() || "U"
  return (
  <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">
    {/* Logo */}
    <Link href="/" className="flex items-center space-x-1">
      <span className="text-2xl font-bold tracking-widest text-orange-500">&gt;_</span>
      <span className="text-2xl font-bold text-foreground">compliz</span>
    </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {/* Public Links */}
          <Link href="/" >
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Home
            </Button>
          </Link>
          <Link href="/compiler" >
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Compiler
            </Button>
          </Link>

          {/* Protected Links */}
          <Link href={user ? "/problem-set" : "/login"} >
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Problem Set
            </Button>
          </Link>
          <Link href={user ? "/question" : "/login"} >
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Create Question
            </Button>
          </Link>

          {/* Divider */}
          <div className="h-6 w-px bg-border/50 mx-2" />

          {/* Conditional UI: User Avatar Popover or Sign In Button */}
          {user ? (
            <Popover>
              <PopoverTrigger >
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    {/* You can add <AvatarImage src={user.user_metadata.avatar_url || "/placeholder.svg"} /> if you have it */}
                    <AvatarFallback className=" text-primary font-bold">{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end" forceMount>
                <div className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="my-2 h-px bg-border" />
                <div className="flex flex-col space-y-1">
                  <Link href="/profile" >
                    <Button variant="ghost" className="w-full justify-start gap-2 font-normal">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start gap-2 font-normal">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/login" >
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-md"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

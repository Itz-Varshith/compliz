"use client"

import Link from "next/link"
import { User, LogOut, LogIn, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

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

  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault()
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
            compliz
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {/* Home Link */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Home
            </Button>
          </Link>

          <Link href="/compiler">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Compiler
            </Button>
          </Link>

          <Link href="/problem-set" onClick={(e) => handleProtectedClick(e, "/problem-set")}>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Problem Set
            </Button>
          </Link>

          <Link href="/question" onClick={(e) => handleProtectedClick(e, "/question")}>
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

          {/* Conditional UI: Show Profile/Sign Out or Sign In */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-foreground/80 hover:text-primary hover:bg-primary/10"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login">
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

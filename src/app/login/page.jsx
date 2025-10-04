"use client"

import { Github, Chrome, Sparkles, Code2, Zap, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const supabase = createClient()

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleSignInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const sendUserDetailsToBackend = async (user) => {
    try {
      console.log("Sending data...")
      await fetch("http://localhost:5000/auth/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
        }),
      })
    } catch (error) {
      console.error("Failed to send user details:", error)
    }
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      await sendUserDetailsToBackend(session.user)
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-orange-500 to-primary rounded-2xl mb-4 shadow-2xl shadow-primary/30 animate-pulse">
            <Code2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-6xl font-black mb-3">
            <span className="bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
              compliz
            </span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Start your coding journey today</p>
        </div>

        <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">Sign in to access your coding playground</p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-foreground/90 font-medium">Access 500+ coding problems and challenges</p>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-sm text-foreground/90 font-medium">Use our powerful online compiler</p>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-foreground/90 font-medium">Track your progress and compete with others</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSignInWithGoogle}
              size="lg"
              className="w-full gap-3 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg font-semibold transition-all group"
              variant="outline"
            >
              <Chrome className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Continue with Google
              <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              onClick={handleSignInWithGitHub}
              size="lg"
              className="w-full gap-3 bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg font-semibold transition-all group"
            >
              <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Continue with GitHub
              <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium">Secure Authentication</span>
            </div>
          </div>

          {/* Terms and privacy */}
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">New to compliz? Sign in to create your account</p>
          <p className="text-xs text-muted-foreground/70">Join thousands of developers improving their skills</p>
        </div>
      </div>
    </div>
  )
}

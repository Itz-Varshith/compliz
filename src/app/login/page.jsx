"use client"

import { Github, Chrome, Sparkles, Code2, Zap, Lock, ArrowRight, Shield, Users } from "lucide-react"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="max-w-6xl w-full mx-4 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl mb-6 shadow-lg shadow-primary/20">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
                compliz
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              The ultimate platform for developers to master coding, compete with peers, and build amazing projects.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-slate-900">500+ Challenges</h3>
                <p className="text-slate-600 text-sm">From beginner to expert level problems</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all">
                <Zap className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-slate-900">Live Compiler</h3>
                <p className="text-slate-600 text-sm">Run code in 10+ languages instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-slate-900">Global Community</h3>
                <p className="text-slate-600 text-sm">Connect with thousands of developers</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span>OAuth Protected</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl mb-4 shadow-lg shadow-primary/20">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
                compliz
              </span>
            </h1>
            <p className="text-slate-600 text-sm">Your coding journey starts here</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-8 lg:p-10 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Welcome</h2>
              <p className="text-slate-600">Choose your preferred sign-in method</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSignInWithGoogle}
                size="lg"
                className="w-full gap-3 bg-white  text-gray-900 border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg hover:scale-[1.02] font-semibold transition-all duration-200 group h-14"
                variant="outline"
              >
                <Chrome className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span className="flex-1 text-left">Continue with Google</span>
                <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>

              <Button
                onClick={handleSignInWithGitHub}
                size="lg"
                className="w-full gap-3 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-900 hover:border-slate-800 shadow-md hover:shadow-lg hover:scale-[1.02] font-semibold transition-all duration-200 group h-14"
              >
                <Github className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span className="flex-1 text-left">Continue with GitHub</span>
                <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-500 font-semibold tracking-wider">
                  Secure Authentication
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/10 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">What you'll get:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Unlimited access to all coding challenges</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Progress tracking & personalized dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Join competitions & win achievements</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 leading-relaxed pt-2">
              By signing in, you agree to our{" "}
              <span className="text-primary hover:text-primary/80 cursor-pointer underline underline-offset-2">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-primary hover:text-primary/80 cursor-pointer underline underline-offset-2">
                Privacy Policy
              </span>
            </p>
          </div>

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-slate-600">
              New to compliz?{" "}
              <span className="text-primary font-semibold">Create your account instantly</span>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <span>✓ No credit card required</span>
              <span>✓ Free forever</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
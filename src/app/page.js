import { Button } from "@/components/ui/button"
import { Code2, Zap, Trophy, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          {/* Brand Name with unique font */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
              compliz
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-6 text-balance">
            Your All-in-One Coding Platform
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-balance">
            Master algorithms, practice problems, and compile code online. Everything you need to level up your coding
            skills in one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 shadow-lg shadow-primary/20"
              asChild
            >
              <Link href="/problems">Start Practicing</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/50 text-foreground hover:bg-primary/10 font-semibold text-lg px-8 py-6 bg-transparent"
              asChild
            >
              <Link href="/compiler">Try Compiler</Link>
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Practice Problems</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Solve curated coding challenges from easy to expert level
              </p>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Online Compiler</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Write and run code instantly in multiple programming languages
              </p>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Track Progress</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor your growth with detailed analytics and achievements
              </p>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Join Community</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with developers and share solutions worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card/30 border-y border-border/50 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground font-medium">Coding Problems</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</div>
            <div className="text-muted-foreground font-medium">Programming Languages</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground font-medium">Online Compiler Access</div>
          </div>
        </div>
      </section>
    </div>
  )
}

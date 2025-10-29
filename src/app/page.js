"use client";

import { Button } from "@/components/ui/button";
import {
  Code2,
  Zap,
  Trophy,
  Users,
  Sparkles,
  ChevronRight,
  Award,
  Target,
  Rocket,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Github, Instagram } from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleStartPracticing = (e) => {
    e.preventDefault();
    if (user) {
      router.push("/problem-set");
    } else {
      router.push("/login");
    }
  };
  const handleShowProgress = (e) => {
    e.preventDefault();
    if (user) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };
  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (user) {
      router.push("/question");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-white font-mono">
      {/* Hero Section */}
      <section className="relative px-4 pt-10 pb-15 overflow-hidden bg-orange-500/7">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 -z-10">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,102,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,102,0,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

          {/* Glowing orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />

          <div className="absolute top-1/4 left-10 text-orange-500/5 text-6xl font-bold">
            &lt;/&gt;
          </div>
          <div className="absolute bottom-1/4 right-10 text-orange-500/5 text-6xl font-bold">
            {}
          </div>
          <div className="absolute top-1/2 left-1/3 text-orange-500/5 text-4xl font-bold">
            [ ]
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-widest mb-4">
              <span className="text-orange-500">&gt;_</span>
              <span className="text-gray-900 ml-2">compliz</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
              <span className="text-orange-500/70 text-sm tracking-wider">
                ONLINE CODING PLATFORM
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-orange-500 to-transparent" />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-wide">
              <span className="text-orange-500">{"//"}</span> Elevate Your
              Coding Journey
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto tracking-wide">
              A comprehensive platform designed for developers who aspire to
              master algorithms, solve complex problems, and build their skills
              with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                onClick={handleStartPracticing}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base px-10 py-6 rounded-none border-2 border-orange-500 hover:border-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all group tracking-wider"
              >
                <Terminal className="mr-2 h-5 w-5" />
                START_PRACTICING( )
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:border-orange-600 font-semibold text-base px-10 py-6 rounded-none bg-white transition-all tracking-wider"
                asChild
              >
                <Link href="/compiler">TRY_COMPILER( )</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 bg-orange-50/30 border-y-2 border-orange-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-wide">
              <span className="text-orange-500">const</span> features = [ ]
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto tracking-wide">
              Powerful tools and resources crafted to accelerate your learning
              and growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={handleStartPracticing}
              className="group relative bg-white border-2 border-orange-500/20 rounded-none p-8 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
            >
              <div className="absolute top-2 right-2 text-orange-500/20 text-xs font-bold">
                01
              </div>
              <div className="relative">
                <div className="w-14 h-14 bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-300">
                  <Code2 className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900 tracking-wide">
                  Practice_Problems
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Curated coding challenges ranging from beginner to expert
                  level
                </p>
              </div>
            </div>

            <div className="group relative bg-white border-2 border-orange-500/20 rounded-none p-8 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
              <Link href="/compiler">
                <div className="absolute top-2 right-2 text-orange-500/20 text-xs font-bold">
                  02
                </div>
                <div className="relative">
                  <div className="w-14 h-14 bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-300">
                    <Zap className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-gray-900 tracking-wide">
                    Online_Compiler
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Execute code instantly across multiple programming languages
                  </p>
                </div>
              </Link>
            </div>

            <div
              onClick={handleShowProgress}
              className="group relative bg-white border-2 border-orange-500/20 rounded-none p-8 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
            >
              <div className="absolute top-2 right-2 text-orange-500/20 text-xs font-bold">
                03
              </div>
              <div className="relative">
                <div className="w-14 h-14 bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-300">
                  <Trophy className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900 tracking-wide">
                  Track_Progress
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Detailed analytics and achievements to monitor your growth
                </p>
              </div>
            </div>

            <div
              onClick={handleCreateQuestion}
              className="group relative bg-white border-2 border-orange-500/20 rounded-none p-8 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
            >
              <div className="absolute top-2 right-2 text-orange-500/20 text-xs font-bold">
                04
              </div>
              <div className="relative">
                <div className="w-14 h-14 bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-300">
                  <Users className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900 tracking-wide">
                  Create_Questions
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Create your own questions on compliz
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-wide break-words">
              <span className="text-orange-500">if</span>{" "}
              (looking_for_excellence){" "}
              <span className="text-orange-500">{"{"}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 border-2 border-orange-500/10 bg-orange-50/20 hover:border-orange-500/30 hover:bg-orange-50/40 transition-all">
              <div className="w-16 h-16 bg-white border-2 border-orange-500/30 flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="font-bold text-xl text-gray-900 tracking-wide">
                Focused_Learning
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Structured curriculum designed to build strong fundamentals and
                advanced skills
              </p>
            </div>

            <div className="text-center space-y-4 p-8 border-2 border-orange-500/10 bg-orange-50/20 hover:border-orange-500/30 hover:bg-orange-50/40 transition-all">
              <div className="w-16 h-16 bg-white border-2 border-orange-500/30 flex items-center justify-center mx-auto">
                <Rocket className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="font-bold text-xl text-gray-900 tracking-wide">
                Fast_Execution
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Lightning-fast compiler with instant feedback on your code
              </p>
            </div>

            <div className="text-center space-y-4 p-8 border-2 border-orange-500/10 bg-orange-50/20 hover:border-orange-500/30 hover:bg-orange-50/40 transition-all">
              <div className="w-16 h-16 bg-white border-2 border-orange-500/30 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="font-bold text-xl text-gray-900 tracking-wide">
                Quality_Content
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Industry-standard problems curated by experienced developers
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">
              <span className="text-orange-500">{"}"}</span>
            </h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t-2 border-primary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-7">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Column 1: Branding & Motto */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-widest flex items-center">
                <span className="text-primary">&gt;_</span>
                <span className="text-white ml-2">compliz</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed pr-4">
                A comprehensive platform designed for developers who aspire to
                master algorithms, solve complex problems, and build their
                skills with confidence.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-4">
              <p className="text-sm text-slate-500 font-semibold tracking-wider">
                {"//"} NAVIGATE
              </p>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="hover:text-primary transition-colors duration-200 w-fit"
                >
                  Home
                </Link>
                <Link
                  href="/compiler"
                  className="hover:text-primary transition-colors duration-200 w-fit"
                >
                  Compiler
                </Link>
                <Link
                  href="/problem-set"
                  className="hover:text-primary transition-colors duration-200 w-fit"
                >
                  Problem Set
                </Link>
                <Link
                  href="/profile"
                  className="hover:text-primary transition-colors duration-200 w-fit"
                >
                  My Profile
                </Link>
              </nav>
            </div>

            {/* Column 3: Connect & Socials */}
            <div className="space-y-4">
              <p className="text-sm text-slate-500 font-semibold tracking-wider">
                {"// CONNECT"}
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-primary transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-primary transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Credits */}
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} compliz. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <span className="font-semibold tracking-wider">
                {"// MADE_BY"}
              </span>
              <div className="flex items-center gap-2 text-slate-300 font-bold tracking-wide">
                <span className="hover:text-primary transition-colors cursor-default">
                  VARSHITH
                </span>
                <span className="text-primary">&&</span>
                <span className="hover:text-primary transition-colors cursor-default">
                  HARSHITH
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

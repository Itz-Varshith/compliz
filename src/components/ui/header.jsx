"use client";

import Link from "next/link";
import { User, LogOut, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.refresh();
    router.push("/");
  };

  const userName = user?.user_metadata?.full_name || user?.email || "User";
  const userInitial = userName?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-2xl font-bold tracking-widest text-orange-500">
            &gt;_
          </span>
          <span className="text-2xl font-bold text-foreground">compliz</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Public Links */}
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

          {/* Protected Links */}
          <Link href={user ? "/problem-set" : "/login"}>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Problem Set
            </Button>
          </Link>
          <Link href={user ? "/question" : "/login"}>
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
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarFallback className="text-primary font-bold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end" forceMount>
                <div className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="my-2 h-px bg-border" />
                <div className="flex flex-col space-y-1">
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full justify-start gap-2 font-normal"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <Avatar className="h-8 w-8 border-2 border-primary/50">
              <AvatarFallback className="text-primary font-bold text-xs">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {user && (
                  <div className="pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/50">
                        <AvatarFallback className="text-primary font-bold">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">
                          {userName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      Home
                    </Button>
                  </Link>
                  <Link href="/compiler" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      Compiler
                    </Button>
                  </Link>
                  <Link
                    href={user ? "/problem-set" : "/login"}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      Problem Set
                    </Button>
                  </Link>
                  <Link
                    href={user ? "/question" : "/login"}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      Create Question
                    </Button>
                  </Link>
                </div>

                <div className="h-px bg-border my-2" />

                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 font-normal"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-md">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

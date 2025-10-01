"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
            compliz
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/question"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Create Question
          </Link>
          <Link
            href="/problem-set"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Problem Set
          </Link>
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
        </nav>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthStatus } from "./AuthStatus"; // Import AuthStatus
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Grifyn
          </Link>
          <span className="text-xl">✨</span>
          <span className="hidden md:inline-block h-6 w-px bg-border/60 mx-2" />
          <span className="text-sm text-muted-foreground hidden md:inline-block font-medium">
            The Modern Piggy Bank
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <AuthStatus />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
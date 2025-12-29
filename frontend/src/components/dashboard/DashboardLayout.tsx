"use client";

import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Users } from "lucide-react";
import { AuthStatus } from "../AuthStatus";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated users, or show a message
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-muted-foreground">
        Please sign in to access your dashboard.
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern for the whole dashboard or just main area? Let's put it on the main area to avoid sidebar conflict or make it global */}
      
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4 flex flex-col z-20">
        <div className="mb-8">
          <Link to="/" className="text-2xl font-bold text-sidebar-primary">
            Grifyn <span className="text-sidebar-accent-foreground">✨</span>
          </Link>
        </div>
        <nav className="flex-grow space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname.startsWith("/dashboard/my-children") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            asChild
          >
            <Link to="/dashboard/my-children">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                My Children
              </span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname.startsWith("/dashboard/settings") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            asChild
          >
            <Link to="/dashboard/settings">
              <span className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </span>
            </Link>
          </Button>
        </nav>
        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-grid-small-black/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
        <div className="flex justify-end mb-4">
          <AuthStatus /> {/* Display user info/dropdown */}
        </div>
        <Outlet /> {/* Renders nested routes */}
      </main>
    </div>
  );
};

export default DashboardLayout;
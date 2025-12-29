import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background/50 border-t border-border/60 py-12 mt-auto backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
              Grifyn
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left leading-relaxed">
              The modern way to celebrate and save. Helping families build a brighter future, one gift at a time.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start gap-3">
             <h4 className="font-semibold text-sm tracking-wider uppercase text-foreground/80">Platform</h4>
             <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
             <Link to="/sign-up" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Get Started
            </Link>
          </div>

           <div className="flex flex-col items-center md:items-start gap-3">
             <h4 className="font-semibold text-sm tracking-wider uppercase text-foreground/80">Legal</h4>
            {/* Add placeholders for Privacy and Terms if pages don't exist yet */}
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              Privacy Policy
            </span>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              Terms of Service
            </span>
             <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              Cookie Policy
            </span>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Grifyn. All rights reserved.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders could go here */}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
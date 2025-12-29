"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { InstantBuilder } from "@/components/InstantBuilder";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background Image & Gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background overflow-hidden">
         {/* Background Image */}
         <div
           className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop")' }}
         />
         
         {/* Gradient Overlay for blending */}
         <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background" />

         {/* Decorative Gradients */}
         <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[100px] pointer-events-none" />
         <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[100px] pointer-events-none" />
      </div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Hero Content */}
            <div className="flex flex-col text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 w-fit mx-auto lg:mx-0">
                  ✨ The Modern Piggy Bank
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1]">
                  The Modern Way to <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Celebrate & Save</span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Grifyn turns traditional gifting into meaningful contributions.
                Build college funds, support passions, and create unforgettable memories.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button size="lg" className="text-lg px-8 py-7 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                  <Link to="/sign-up">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-7 bg-background/50 backdrop-blur-sm hover:bg-background/80" asChild>
                  <Link to="/how-it-works">
                    How it Works
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center text-[10px] overflow-hidden`}>
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*123}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Join thousands of parents building a brighter future.</p>
              </div>
            </div>

            {/* Right Column: Instant Builder / Visual */}
            <div className="w-full max-w-md mx-auto lg:max-w-full bg-card/80 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 p-6 md:p-8 relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200/50 rounded-full blur-3xl -z-10 animate-pulse" />
               <div className="mb-6 text-center lg:text-left">
                  <h3 className="text-lg font-semibold mb-2">Try it out instantly</h3>
                  <p className="text-sm text-muted-foreground">See how easy it is to create your child's registry.</p>
               </div>
               <InstantBuilder />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
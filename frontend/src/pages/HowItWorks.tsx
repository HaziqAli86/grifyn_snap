"use client";

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DollarSign, BookOpen, Gift, Share2, Activity } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />
      </div>
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">How Grifyn Works</h1>
          <p className="text-xl text-muted-foreground">
            Simplify gift-giving and focus on what truly matters for your child.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">1</AvatarFallback>
              </Avatar>
              <CardTitle>Create Child Profile</CardTitle>
            </CardHeader>
            <CardContent>
              Start by setting up a profile for each child, including their name, age, and interests. This helps gift-givers understand their passions.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">2</AvatarFallback>
              </Avatar>
              <CardTitle>Add Meaningful Gifts</CardTitle> {/* Corrected this line */}
            </CardHeader>
            <CardContent>
              Choose from Cash Funds (for savings or big goals), 529 Plan contributions (for education), or specific Physical Gifts (from any online store).
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">3</AvatarFallback>
              </Avatar>
              <CardTitle>Share Your Registry</CardTitle>
            </CardHeader>
            <CardContent>
              Generate a unique, shareable link for each child's registry. Easily send it to friends and family for birthdays, holidays, or any celebration.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">4</AvatarFallback>
              </Avatar>
              <CardTitle>Gift-Givers Pledge</CardTitle>
            </CardHeader>
            <CardContent>
              Loved ones can visit the link, see your child's wishes, and easily pledge a contribution or claim a physical gift. No payments are processed on Grifyn.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">5</AvatarFallback>
              </Avatar>
              <CardTitle>Track Activity</CardTitle>
            </CardHeader>
            <CardContent>
              Keep track of all pledges and claims in your real-time activity feed. Mark gifts as "fulfilled" or "received" once they're complete.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">6</AvatarFallback>
              </Avatar>
              <CardTitle>Reduce Clutter, Grow Dreams</CardTitle>
            </CardHeader>
            <CardContent>
              By guiding gift choices, you help reduce unwanted items and ensure gifts contribute to your child's long-term happiness and development.
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-8">
          <Button asChild size="lg">
            <Link to="/">Get Started with Grifyn</Link>
          </Button>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HowItWorks;
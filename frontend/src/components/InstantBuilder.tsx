"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChildSetupForm } from "./child/ChildSetupForm";
import { GiftTypeSelector } from "./gifts/GiftTypeSelector";
import { GiftEntryForm } from "./gifts/GiftEntryForm";
import { RegistryCreatedView } from "./registry/RegistryCreatedView";
import { Child, Gift, GiftType } from "@/types/grifyn";
import { useRegistry } from "@/context/RegistryContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const InstantBuilder = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [child, setChild] = useState<Child | null>(null);
  const [firstGift, setFirstGift] = useState<Gift | null>(null);
  const [selectedGiftType, setSelectedGiftType] = useState<GiftType | null>(null);
  const { addChild, addGift } = useRegistry();
  const navigate = useNavigate();

  const handleChildSubmit = async (childData: Omit<Child, 'id' | 'createdAt' | 'lastModifiedAt' | 'userId'>) => {
    const newChild = await addChild(childData);
    if (newChild) {
      setChild(newChild);
      setStep(2);
    }
  };

  const handleGiftTypeSelect = (type: GiftType) => {
    setSelectedGiftType(type);
    setStep(3);
  };

  const handleGiftSubmit = async (giftData: Omit<Gift, 'id' | 'childId' | 'createdAt' | 'lastModifiedAt' | 'sortOrder' | 'pledgedAmount' | 'claimedCount' | 'type'>) => {
    if (!child || !selectedGiftType) return;

    const newGift = await addGift(child.id, giftData, selectedGiftType);
    if (newGift) {
      setFirstGift(newGift);
      setStep(4);
    }
  };

  const resetBuilder = () => {
    setStep(1);
    setChild(null);
    setFirstGift(null);
    setSelectedGiftType(null);
    navigate("/dashboard/my-children"); // Redirect to dashboard after adding more gifts
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Create Your First Registry</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <Button asChild>
            <Link to="/sign-up">Sign Up</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">
          {step === 1 && "Set up your child's profile"}
          {step === 2 && "Choose your first gift type"}
          {step === 3 && `Add a ${selectedGiftType === 'fund' ? 'Cash Fund' : selectedGiftType === '529' ? '529 Plan Link' : 'Physical Gift'}`}
          {step === 4 && "Your Registry is Ready!"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && <ChildSetupForm onSubmit={handleChildSubmit} />}
        {step === 2 && <GiftTypeSelector onSelect={handleGiftTypeSelect} />}
        {step === 3 && selectedGiftType && (
          <GiftEntryForm giftType={selectedGiftType} onSubmit={handleGiftSubmit} />
        )}
        {step === 4 && child && firstGift && (
          <RegistryCreatedView child={child} gift={firstGift} onAddMoreGifts={resetBuilder} />
        )}
      </CardContent>
    </Card>
  );
};
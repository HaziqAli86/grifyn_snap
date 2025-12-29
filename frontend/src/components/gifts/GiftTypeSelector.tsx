"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GiftType } from "@/types/grifyn";
import { DollarSign, BookOpen, Gift as GiftIcon } from "lucide-react";

interface GiftTypeSelectorProps {
  onSelect: (type: GiftType) => void;
}

export const GiftTypeSelector = ({ onSelect }: GiftTypeSelectorProps) => {
  const [selectedType, setSelectedType] = useState<GiftType | null>(null);

  const giftOptions = [
    {
      type: "fund",
      label: "Cash Fund",
      description: "For savings, big purchases, or future dreams.",
      icon: DollarSign,
    },
    {
      type: "529",
      label: "529 Contribution Link",
      description: "Direct contributions to an education savings plan.",
      icon: BookOpen,
    },
    {
      type: "physical",
      label: "Physical Gift",
      description: "Specific items from a store or online retailer.",
      icon: GiftIcon,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup
        onValueChange={(value: GiftType) => setSelectedType(value)}
        className="grid gap-4"
      >
        {giftOptions.map((option) => (
          <Label
            key={option.type}
            htmlFor={option.type}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <RadioGroupItem id={option.type} value={option.type} className="sr-only" />
            <option.icon className="mb-3 h-6 w-6 text-primary" />
            <span className="block w-full text-center font-semibold">{option.label}</span>
            <span className="block w-full text-center text-sm text-muted-foreground mt-1">
              {option.description}
            </span>
          </Label>
        ))}
      </RadioGroup>
      <Button type="submit" className="w-full" disabled={!selectedType}>
        Add Gift →
      </Button>
    </form>
  );
};
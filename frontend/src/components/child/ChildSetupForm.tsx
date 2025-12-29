"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, X } from "lucide-react";
import { Child } from "@/types/grifyn";
import { cn } from "@/lib/utils";

interface ChildSetupFormProps {
  onSubmit: (childData: Omit<Child, 'id' | 'createdAt' | 'lastModifiedAt' | 'userId'>) => void;
}

export const ChildSetupForm = ({ onSubmit }: ChildSetupFormProps) => {
  const [name, setName] = useState("");
  const [birthdayOrAge, setBirthdayOrAge] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [currentInterest, setCurrentInterest] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Child's Name is required.";
    if (!birthdayOrAge.trim()) newErrors.birthdayOrAge = "Birthday or Age is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentInterest.trim() !== "") {
      e.preventDefault();
      if (interests.length < 10) { // Max 10 tags per child
        setInterests((prev) => [...prev, currentInterest.trim()]);
        setCurrentInterest("");
      } else {
        // Optionally show a toast or error message
      }
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests((prev) => prev.filter((interest) => interest !== interestToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name, birthday_or_age: birthdayOrAge, photo_url: photoUrl || undefined, interests });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={photoUrl} alt="Child Photo" />
          <AvatarFallback className="bg-muted text-muted-foreground text-4xl">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <Label htmlFor="photoUrl" className="sr-only">Photo URL</Label>
          <Input
            id="photoUrl"
            placeholder="Optional: Photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="text-center"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name">Child's Name</Label>
        <Input
          id="name"
          placeholder="e.g., Leo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          className={cn(errors.name && "border-destructive")}
        />
        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="birthdayOrAge">Birthday or Age</Label>
        <Input
          id="birthdayOrAge"
          placeholder="e.g., 5th Birthday or 3 years old"
          value={birthdayOrAge}
          onChange={(e) => {
            setBirthdayOrAge(e.target.value);
            setErrors((prev) => ({ ...prev, birthdayOrAge: "" }));
          }}
          className={cn(errors.birthdayOrAge && "border-destructive")}
        />
        {errors.birthdayOrAge && <p className="text-destructive text-sm mt-1">{errors.birthdayOrAge}</p>}
      </div>

      <div>
        <Label htmlFor="interests">Interests (Press Enter to add, max 10)</Label>
        <Input
          id="interests"
          placeholder="e.g., Dinosaurs, Reading, Art"
          value={currentInterest}
          onChange={(e) => setCurrentInterest(e.target.value)}
          onKeyDown={handleAddInterest}
          disabled={interests.length >= 10}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              {interest}
              <X
                className="ml-2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveInterest(interest)}
              />
            </span>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Next → Choose a Gift
      </Button>
    </form>
  );
};
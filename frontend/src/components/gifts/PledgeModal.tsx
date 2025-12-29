"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, GiftType } from "@/types/grifyn";
import { useRegistry } from "@/context/RegistryContext";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "@/utils/toast";

interface PledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  gift: Gift;
  childName: string;
}

export const PledgeModal = ({ isOpen, onClose, gift, childName }: PledgeModalProps) => {
  const { addPledge } = useRegistry();
  const [giverName, setGiverName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setGiverName("");
      setAmount("");
      setNote("");
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!giverName.trim()) newErrors.giverName = "Your name is required.";

    if (gift.type === "fund") {
      if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
        newErrors.amount = "Amount must be a positive number.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        addPledge(gift.childId, gift.id, {
          giver_name: giverName,
          amount: gift.type === "fund" ? (amount ? parseFloat(amount) : undefined) : undefined,
          note: note || undefined,
        });
        showSuccess(`Thank you, ${giverName}! Your pledge for ${gift.title} has been recorded.`);
        onClose();
      } catch (error) {
        showError("Failed to record pledge. Please try again.");
        console.error("Pledge submission error:", error);
      }
    }
  };

  const handleExternalLink = () => {
    if (gift.type === "fund" && gift.external_payment_url) {
      window.open(gift.external_payment_url, "_blank");
    } else if (gift.type === "529" && gift.contribution_url) {
      window.open(gift.contribution_url, "_blank");
    }
    // For physical gifts, the pledge is recorded, and then the user can proceed to buy externally.
    // The modal will close after pledge is recorded.
  };

  const isFundOr529 = gift.type === "fund" || gift.type === "529";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isFundOr529 ? `Contribute to ${gift.title}` : `Claim ${gift.title}`}
          </DialogTitle>
          <DialogDescription>
            Help {childName} achieve their dreams!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="giverName">Your Name</Label>
            <Input
              id="giverName"
              placeholder="e.g., Aunt Carol"
              value={giverName}
              onChange={(e) => {
                setGiverName(e.target.value);
                setErrors((prev) => ({ ...prev, giverName: "" }));
              }}
              className={cn(errors.giverName && "border-destructive")}
            />
            {errors.giverName && <p className="text-destructive text-sm mt-1">{errors.giverName}</p>}
          </div>

          {gift.type === "fund" && (
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (optional)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 50.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, amount: "" }));
                }}
                className={cn(errors.amount && "border-destructive")}
              />
              {errors.amount && <p className="text-destructive text-sm mt-1">{errors.amount}</p>}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="note">Optional Note</Label>
            <Textarea
              id="note"
              placeholder="Happy birthday, Leo!"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={250}
            />
            <p className="text-xs text-muted-foreground text-right">{note.length}/250</p>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              {isFundOr529 ? "Pledge & Go to Link" : "Claim Gift"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Child, Gift } from "@/types/grifyn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, DollarSign, BookOpen, Gift as GiftIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { showSuccess } from "@/utils/toast";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";

interface RegistryCreatedViewProps {
  child: Child;
  gift: Gift;
  onAddMoreGifts: () => void;
}

export const RegistryCreatedView = ({ child, gift, onAddMoreGifts }: RegistryCreatedViewProps) => {
  const registryUrl = `${window.location.origin}/registry/${child.id}`; // Mock URL

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(registryUrl);
    showSuccess("Registry URL copied to clipboard!");
  };

  const renderGiftCardContent = (gift: Gift) => {
    switch (gift.type) {
      case "fund":
        return (
          <div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Cash Fund</span>
            </div>
            <p className="text-lg font-semibold mt-2">{gift.title}</p>
            {gift.target_amount && (
              <p className="text-sm text-muted-foreground">Target: ${gift.target_amount.toFixed(2)}</p>
            )}
            <p className="text-sm text-muted-foreground">Pledged: ${gift.pledged_amount?.toFixed(2) || "0.00"}</p>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <a href={gift.external_payment_url} target="_blank" rel="noopener noreferrer">
                Contribute →
              </a>
            </Button>
          </div>
        );
      case "529":
        return (
          <div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">529 Plan</span>
            </div>
            <p className="text-lg font-semibold mt-2">{gift.plan_name}</p>
            <p className="text-sm text-muted-foreground">{gift.title}</p>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <a href={gift.contribution_url} target="_blank" rel="noopener noreferrer">
                Contribute →
              </a>
            </Button>
          </div>
        );
      case "physical":
        return (
          <div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <GiftIcon className="h-4 w-4" />
              <span className="text-sm">Physical Gift</span>
            </div>
            {gift.image_url && (
              <img src={gift.image_url} alt={gift.title} className="w-full h-24 object-contain my-2 rounded-md" />
            )}
            <p className="text-lg font-semibold mt-2">{gift.title}</p>
            <p className="text-sm text-muted-foreground">
              {gift.merchant} - ${gift.price?.toFixed(2) || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">Quantity: {gift.quantity} (Claimed: {gift.claimed_count || 0})</p>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <a href={gift.product_url} target="_blank" rel="noopener noreferrer">
                I'll buy this →
              </a>
            </Button>
          </div>
        );
      default:
        // Defensive: This case should ideally not be hit if gift.type is always valid.
        // Returning a div instead of null to satisfy React.Children.only if it's strict.
        console.error("Unexpected gift type in RegistryCreatedView:", gift.type);
        return <div>Error: Unknown Gift Type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Congratulations!</h2>
        <p className="text-muted-foreground">Your registry for {child.name} is live.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={child.photo_url} alt={`${child.name}'s Photo`} />
            <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
              {child.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{child.name}</CardTitle>
            <CardDescription>{child.birthday_or_age}</CardDescription>
            {child.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {child.interests.map((interest, index) => (
                  <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Your First Gift:</h3>
          <Card className="p-4 border-2 border-primary/20">
            {renderGiftCardContent(gift)}
          </Card>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="registry-url" className="text-base font-semibold">Share this link with friends & family:</Label>
        <div className="flex w-full items-center space-x-2 mt-2">
          <Input id="registry-url" value={registryUrl} readOnly className="flex-grow" />
          <Button type="button" size="sm" onClick={handleCopyUrl}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={onAddMoreGifts} className="w-full">
          Add More Gifts →
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/dashboard/child/${child.id}`}>Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};
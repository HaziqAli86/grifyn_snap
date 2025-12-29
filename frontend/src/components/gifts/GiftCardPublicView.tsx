"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, GiftType } from "@/types/grifyn";
import { DollarSign, BookOpen, Gift as GiftIcon } from "lucide-react";
import { PledgeModal } from "./PledgeModal";
import { Progress } from "@/components/ui/progress"; // Import Progress component

interface GiftCardPublicViewProps {
  gift: Gift;
  childName: string;
}

export const GiftCardPublicView = ({ gift, childName }: GiftCardPublicViewProps) => {
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);

  const renderIcon = (type: GiftType) => {
    switch (type) {
      case "fund":
        return <DollarSign className="h-5 w-5 text-primary" />;
      case "529":
        return <BookOpen className="h-5 w-5 text-primary" />;
      case "physical":
        return <GiftIcon className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  const renderGiftDetails = (gift: Gift) => {
    switch (gift.type) {
      case "fund":
        const pledgedPercentage = gift.target_amount ? ((gift.pledged_amount || 0) / gift.target_amount) * 100 : 0;
        return (
          <>
            <p className="text-lg font-semibold">{gift.title}</p>
            {gift.target_amount && (
              <p className="text-sm text-muted-foreground">Target: ${gift.target_amount.toFixed(2)}</p>
            )}
            <p className="text-sm text-muted-foreground">Pledged: ${gift.pledged_amount?.toFixed(2) || "0.00"}</p>
            {gift.target_amount && (
              <Progress value={pledgedPercentage} className="w-full mt-2" />
            )}
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{gift.description}</p>
          </>
        );
      case "529":
        return (
          <>
            <p className="text-lg font-semibold">{gift.plan_name}</p>
            <p className="text-sm text-muted-foreground">{gift.title}</p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{gift.description}</p>
          </>
        );
      case "physical":
        return (
          <>
            {gift.image_url && (
              <img src={gift.image_url} alt={gift.title} className="w-full h-24 object-contain mb-2 rounded-md" />
            )}
            <p className="text-lg font-semibold">{gift.title}</p>
            <p className="text-sm text-muted-foreground">
              {gift.merchant} - ${gift.price?.toFixed(2) || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">Quantity: {gift.quantity} (Claimed: {gift.claimed_count || 0})</p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{gift.description}</p>
          </>
        );
      default:
        return null;
    }
  };

  const isClaimed = gift.type === "physical" && gift.claimed_count && gift.quantity && gift.claimed_count >= gift.quantity;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {renderIcon(gift.type)}
          <span className="text-sm font-medium capitalize">{gift.type === 'fund' ? 'Cash Fund' : gift.type === '529' ? '529 Plan' : 'Physical Gift'}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {renderGiftDetails(gift)}
      </CardContent>
      <div className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => setIsPledgeModalOpen(true)}
          disabled={isClaimed}
        >
          {isClaimed ? "Claimed" : gift.type === "physical" ? "I'll buy this" : "Contribute"}
        </Button>
      </div>
      <PledgeModal
        isOpen={isPledgeModalOpen}
        onClose={() => setIsPledgeModalOpen(false)}
        gift={gift}
        childName={childName}
      />
    </Card>
  );
};
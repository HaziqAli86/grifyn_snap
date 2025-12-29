"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Gift, GiftType } from "@/types/grifyn";
import { DollarSign, BookOpen, Gift as GiftIcon, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useRegistry } from "@/context/RegistryContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GiftCardParentViewProps {
  gift: Gift;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (giftId: string) => void;
  onMoveDown: (giftId: string) => void;
}

export const GiftCardParentView = ({ gift, isFirst, isLast, onMoveUp, onMoveDown }: GiftCardParentViewProps) => {
  const { deleteGift } = useRegistry();

  const handleDelete = () => {
    deleteGift(gift.id);
  };

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
        return (
          <>
            <p className="text-lg font-semibold">{gift.title}</p>
            {gift.target_amount && (
              <p className="text-sm text-muted-foreground">Target: ${gift.target_amount.toFixed(2)}</p>
            )}
            <p className="text-sm text-muted-foreground">Pledged: ${gift.pledged_amount?.toFixed(2) || "0.00"}</p>
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

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {renderIcon(gift.type)}
          <span className="text-sm font-medium capitalize">{gift.type}</span>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onMoveUp(gift.id)} disabled={isFirst}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onMoveDown(gift.id)} disabled={isLast}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Link
            to={`/dashboard/gift/${gift.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Edit className="h-4 w-4" />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the gift "{gift.title}" and all associated pledges.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {renderGiftDetails(gift)}
      </CardContent>
    </Card>
  );
};
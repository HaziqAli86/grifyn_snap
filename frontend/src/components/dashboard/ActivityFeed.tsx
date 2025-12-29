"use client";

import React from "react";
import { useRegistry } from "@/context/RegistryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, DollarSign, Gift as GiftIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PledgeStatus } from "@/types/grifyn";
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
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  childId: string;
}

export const ActivityFeed = ({ childId }: ActivityFeedProps) => {
  const { getPledgesByChildId, getGiftById, updatePledgeStatus } = useRegistry();
  const pledges = getPledgesByChildId(childId);

  const handleUpdateStatus = (pledgeId: string, newStatus: PledgeStatus) => {
    updatePledgeStatus(pledgeId, newStatus);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Activity Feed</h2>
      {pledges.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>No activity yet. Share your registry to start seeing pledges!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pledges.map((pledge) => {
            const gift = getGiftById(pledge.giftId);
            if (!gift) return null; // Should not happen if data integrity is maintained

            const isPending = pledge.status === "pending";
            const isFulfilled = pledge.status === "fulfilled";
            const isReceived = pledge.status === "received";

            return (
              <Card key={pledge.id} className="p-4 flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {gift.type === "fund" || gift.type === "529" ? (
                    <DollarSign className="h-6 w-6 text-primary" />
                  ) : (
                    <GiftIcon className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">
                    <span className="text-primary">{pledge.giver_name}</span>{" "}
                    {gift.type === "fund" && pledge.amount && `pledged $${pledge.amount.toFixed(2)} `}
                    {gift.type === "529" && `pledged a contribution `}
                    {gift.type === "physical" && `claimed `}
                    to{" "}
                    <span className="font-semibold">{gift.title}</span>
                  </p>
                  {pledge.note && (
                    <p className="text-sm text-muted-foreground mt-1">"{pledge.note}"</p>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(pledge.createdAt), { addSuffix: true })}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isPending && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        (isFulfilled || isReceived) && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      )}
                    >
                      {pledge.status === "pending" && "Pending"}
                      {pledge.status === "fulfilled" && "Fulfilled"}
                      {pledge.status === "received" && "Received"}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {isPending && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <span> {/* Wrap icon and text in a span */}
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {gift.type === "fund" || gift.type === "529" ? "Mark Fulfilled" : "Mark Received"}
                          </span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to mark this pledge as{" "}
                            <span className="font-semibold">
                              {gift.type === "fund" || gift.type === "529" ? "Fulfilled" : "Received"}
                            </span>
                            ? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleUpdateStatus(
                                pledge.id,
                                gift.type === "fund" || gift.type === "529" ? "fulfilled" : "received"
                              )
                            }
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
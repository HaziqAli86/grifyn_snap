"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegistry } from "@/context/RegistryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ThankYouManagerPage = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { getChildById, getPledgesByChildId, getGiftById, updatePledgeThankedStatus } = useRegistry();

  const child = childId ? getChildById(childId) : undefined;
  const pledges = childId ? getPledgesByChildId(childId) : [];

  if (!child) {
    return (
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold">Child Not Found</h1>
        <p className="text-muted-foreground">The child profile you are looking for does not exist or you do not have access.</p>
        <Button className="mt-4" onClick={() => navigate("/dashboard/my-children")}>
          Back to My Children
        </Button>
      </div>
    );
  }

  const handleToggleThanked = (pledgeId: string, thanked: boolean) => {
    updatePledgeThankedStatus(pledgeId, thanked);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/child/${child.id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Thank You Manager for {child.name}</h1>
      </div>

      {pledges.length === 0 ? (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl">No Pledges Yet!</CardTitle>
            <CardDescription>Once friends and family pledge gifts, you can track your thank-yous here.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pledges.map((pledge) => {
            const gift = getGiftById(pledge.giftId);
            if (!gift) return null;

            return (
              <Card key={pledge.id} className="p-4 flex items-center justify-between">
                <div className="flex-grow space-y-1">
                  <p className="font-semibold text-lg">{pledge.giver_name}</p>
                  <p className="text-muted-foreground text-sm">
                    {gift.type === "fund" && pledge.amount && `Pledged $${pledge.amount.toFixed(2)} to `}
                    {gift.type === "529" && `Pledged to `}
                    {gift.type === "physical" && `Claimed `}
                    <span className="font-medium">{gift.title}</span>
                  </p>
                  {pledge.note && (
                    <p className="text-xs text-muted-foreground italic">"{pledge.note}"</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(pledge.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`thanked-${pledge.id}`}
                    checked={pledge.thanked}
                    onCheckedChange={(checked) => handleToggleThanked(pledge.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={`thanked-${pledge.id}`}
                    className={cn(
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      pledge.thanked ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    {pledge.thanked ? "Thanked" : "Mark as Thanked"}
                  </Label>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThankYouManagerPage;
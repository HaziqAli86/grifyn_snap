"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegistry } from "@/context/RegistryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GiftTypeSelector } from "@/components/gifts/GiftTypeSelector";
import { GiftEntryForm } from "@/components/gifts/GiftEntryForm";
import { Gift, GiftType } from "@/types/grifyn";

const AddGiftPage = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { getChildById, addGift } = useRegistry();

  const [selectedGiftType, setSelectedGiftType] = useState<GiftType | null>(null);

  const child = childId ? getChildById(childId) : undefined;

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

  const handleGiftTypeSelect = (type: GiftType) => {
    setSelectedGiftType(type);
  };

  const handleGiftSubmit = (giftData: Omit<Gift, 'id' | 'childId' | 'createdAt' | 'lastModifiedAt' | 'sortOrder' | 'pledgedAmount' | 'claimedCount' | 'type'>) => {
    if (childId && selectedGiftType) {
      addGift(childId, giftData, selectedGiftType);
      navigate(`/dashboard/child/${childId}`); // Redirect back to child's dashboard
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/child/${child.id}`);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {selectedGiftType ? `Add a ${selectedGiftType === 'fund' ? 'Cash Fund' : selectedGiftType === '529' ? '529 Plan Link' : 'Physical Gift'} for ${child.name}` : `Choose a Gift Type for ${child.name}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedGiftType ? (
            <GiftTypeSelector onSelect={handleGiftTypeSelect} />
          ) : (
            <GiftEntryForm giftType={selectedGiftType} onSubmit={handleGiftSubmit} />
          )}
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddGiftPage;
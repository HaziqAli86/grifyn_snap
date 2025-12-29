"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegistry } from "@/context/RegistryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditGiftForm } from "@/components/gifts/EditGiftForm";
import { Gift } from "@/types/grifyn";
import { Button } from "@/components/ui/button";

const EditGiftPage = () => {
  const { giftId } = useParams<{ giftId: string }>();
  const navigate = useNavigate();
  const { getGiftById, updateGift } = useRegistry();

  const gift = giftId ? getGiftById(giftId) : undefined;

  if (!gift) {
    return (
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold">Gift Not Found</h1>
        <p className="text-muted-foreground">The gift you are looking for does not exist or you do not have access.</p>
        <Button className="mt-4" onClick={() => navigate("/dashboard/my-children")}>
          Back to My Children
        </Button>
      </div>
    );
  }

  const handleSubmit = (updatedData: Partial<Omit<Gift, 'id' | 'childId' | 'createdAt' | 'lastModifiedAt' | 'sortOrder' | 'pledged_amount' | 'claimed_count' | 'type'>>) => {
    if (giftId) {
      updateGift(giftId, updatedData);
      navigate(`/dashboard/child/${gift.childId}`); // Redirect back to child's dashboard
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/child/${gift.childId}`); // Redirect back to child's dashboard
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Edit {gift.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditGiftForm
            initialGiftData={gift}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditGiftPage;
"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegistry } from "@/context/RegistryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditChildForm } from "@/components/child/EditChildForm";
import { Child } from "@/types/grifyn";

const EditChildPage = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { getChildById, updateChild } = useRegistry();

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

  const handleSubmit = (updatedData: Partial<Omit<Child, 'id' | 'createdAt' | 'lastModifiedAt' | 'userId'>>) => {
    if (childId) {
      updateChild(childId, updatedData);
      navigate(`/dashboard/child/${childId}`); // Redirect back to child's dashboard
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/child/${childId}`); // Redirect back to child's dashboard
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Edit {child.name}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <EditChildForm
            initialChildData={child}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditChildPage;
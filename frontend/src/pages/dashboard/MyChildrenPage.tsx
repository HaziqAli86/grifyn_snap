"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegistry } from "@/context/RegistryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { ChildCard } from "@/components/child/ChildCard";
import { AddRegistryByUrlModal } from "@/components/dashboard/AddRegistryByUrlModal";
import { Child } from "@/types/grifyn";

const MyChildrenPage = () => {
  const { children, savedRegistryIds, getPublicChildById } = useRegistry();
  const navigate = useNavigate();
  const [savedChildren, setSavedChildren] = React.useState<Child[]>([]);

  React.useEffect(() => {
    const fetchSaved = async () => {
        const promises = savedRegistryIds.map(id => getPublicChildById(id));
        const results = await Promise.all(promises);
        setSavedChildren(results.filter((c): c is Child => !!c));
    };
    if (savedRegistryIds.length > 0) {
        fetchSaved();
    } else {
        setSavedChildren([]);
    }
  }, [savedRegistryIds, getPublicChildById]);

  const handleAddChild = () => {
    navigate("/"); // Redirect to the InstantBuilder on the homepage
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Children</h1>
        <Button onClick={handleAddChild}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Child
        </Button>
      </div>

      {children.length === 0 ? (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl">No children added yet!</CardTitle>
            <CardDescription>Start by creating a profile for your first child.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAddChild}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Child Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}

      {/* Saved Registries Section */}
      <div className="space-y-6 pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-muted-foreground">Saved Registries</h2>
          <AddRegistryByUrlModal />
        </div>

        {savedChildren.length === 0 ? (
          <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
            <p>You haven't saved any other registries yet.</p>
            <p className="text-sm">Click "Add by Link" to follow a friend's registry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedChildren.map((child) => (
              <ChildCard key={child.id} child={child} isSavedRegistry={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChildrenPage;
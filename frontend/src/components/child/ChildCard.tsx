"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Child } from "@/types/grifyn";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, XCircle } from "lucide-react";
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

interface ChildCardProps {
  child: Child;
  isSavedRegistry?: boolean;
}

export const ChildCard = ({ child, isSavedRegistry = false }: ChildCardProps) => {
  const { deleteChild, unsaveRegistry } = useRegistry();

  const handleDelete = async () => {
    await deleteChild(child.id);
  };

  const handleUnsave = () => {
    unsaveRegistry(child.id);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="w-16 h-16">
          <AvatarImage src={child.photo_url} alt={`${child.name}'s Photo`} />
          <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
            {child.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{child.name}</CardTitle>
          <CardDescription>{child.birthday_or_age}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {child.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {child.interests.map((interest, index) => (
              <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <div className="flex justify-end p-4 pt-0 space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={isSavedRegistry ? `/registry/${child.id}` : `/dashboard/child/${child.id}`}>
             {isSavedRegistry ? "View Public Registry" : "View Registry"}
          </Link>
        </Button>
        
        {!isSavedRegistry ? (
          <>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/dashboard/child/${child.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
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
                    This action cannot be undone. This will permanently delete {child.name}'s profile and all associated gifts and pledges.
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
          </>
        ) : (
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted">
                  <XCircle className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Saved Registry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove {child.name}'s registry from your dashboard. You can add it again later using the link.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUnsave}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        )}
      </div>
    </Card>
  );
};
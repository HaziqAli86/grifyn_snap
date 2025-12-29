"use client";

import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRegistry } from "@/context/RegistryContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, PlusCircle, Share2, Trash2, HeartHandshake } from "lucide-react"; // Import HeartHandshake icon
import { GiftCardParentView } from "@/components/gifts/GiftCardParentView";
import { showSuccess } from "@/utils/toast";
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
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

const ChildDashboardPage = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { getChildById, getGiftsByChildId, deleteChild, updateGiftOrder } = useRegistry();

  const child = childId ? getChildById(childId) : undefined;
  const gifts = childId ? getGiftsByChildId(childId) : []; // Already sorted by sortOrder

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

  const handleCopyShareUrl = () => {
    // Use environment variable for public URL if set, otherwise fallback to current origin
    const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
    const publicRegistryUrl = `${baseUrl}/registry/${child.id}`;
    navigator.clipboard.writeText(publicRegistryUrl);
    showSuccess("Public registry URL copied to clipboard!");
  };

  const handleDeleteChild = async () => {
    if (child) {
      await deleteChild(child.id);
      navigate("/dashboard/my-children"); // Redirect after deletion
    }
  };

  const handleMoveGift = (giftId: string, direction: 'up' | 'down') => {
    const currentGiftIndex = gifts.findIndex(g => g.id === giftId);
    if (currentGiftIndex === -1) return;

    const newGiftsOrder = [...gifts];
    const [movedGift] = newGiftsOrder.splice(currentGiftIndex, 1);

    if (direction === 'up' && currentGiftIndex > 0) {
      newGiftsOrder.splice(currentGiftIndex - 1, 0, movedGift);
    } else if (direction === 'down' && currentGiftIndex < gifts.length - 1) {
      newGiftsOrder.splice(currentGiftIndex + 1, 0, movedGift);
    } else {
      return; // Cannot move further up or down
    }

    const orderedGiftIds = newGiftsOrder.map(g => g.id);
    updateGiftOrder(child.id, orderedGiftIds);
  };

  return (
    <div className="space-y-8">
      {/* Child Profile Header */}
      <Card className="p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage src={child.photo_url} alt={`${child.name}'s Photo`} />
          <AvatarFallback className="bg-muted text-muted-foreground text-4xl md:text-5xl">
            {child.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-4xl font-bold text-primary">{child.name}</h1>
          <p className="text-xl text-muted-foreground">{child.birthday_or_age}</p>
          {child.interests.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
              {child.interests.map((interest, index) => (
                <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleCopyShareUrl}>
            <Share2 className="mr-2 h-4 w-4" /> Share Registry
          </Button>
          <Link
            to={`/dashboard/child/${child.id}/edit`}
            className={buttonVariants({ variant: "outline" })}
          >
            <span>
              <Edit className="mr-2 h-4 w-4" /> Edit Child
            </span>
          </Link>
          {/* New button for Thank You Manager */}
          <Link
            to={`/dashboard/child/${child.id}/thank-you`}
            className={buttonVariants({ variant: "outline" })}
          >
            <span>
              <HeartHandshake className="mr-2 h-4 w-4" /> Thank You Manager
            </span>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <span> {/* Wrap icon and text in a span */}
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Child
                </span>
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
                <AlertDialogAction onClick={handleDeleteChild} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* Gifts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gifts for {child.name}</h2>
          <Link
            to={`/dashboard/child/${child.id}/add-gift`}
            className={buttonVariants({ variant: "default" })}
          >
            <span>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Gift
            </span>
          </Link>
        </div>

        {gifts.length === 0 ? (
          <Card className="text-center p-8">
            <CardHeader>
              <CardTitle className="text-xl">No gifts added yet!</CardTitle>
              <CardDescription>Start by adding a cash fund, 529 plan, or physical gift.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to={`/dashboard/child/${child.id}/add-gift`}
                className={buttonVariants({ variant: "default" })}
              >
                <span>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add First Gift
                </span>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift, index) => (
              <GiftCardParentView
                key={gift.id}
                gift={gift}
                isFirst={index === 0}
                isLast={index === gifts.length - 1}
                onMoveUp={(id) => handleMoveGift(id, 'up')}
                onMoveDown={(id) => handleMoveGift(id, 'down')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Activity Feed Section */}
      <ActivityFeed childId={child.id} />
    </div>
  );
};

export default ChildDashboardPage;
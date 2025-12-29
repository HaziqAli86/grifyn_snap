"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useRegistry } from "@/context/RegistryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GiftCardPublicView } from "@/components/gifts/GiftCardPublicView";
import { MadeWithDyad } from "@/components/made-with-dyad";

const PublicRegistryPage = () => {
  const { childId } = useParams<{ childId: string }>();
  const { getPublicChildById, getPublicGiftsByChildId, saveRegistry, savedRegistryIds } = useRegistry();
  const [child, setChild] = React.useState<any | undefined>(undefined);
  const [gifts, setGifts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (childId) {
        setLoading(true);
        try {
          const fetchedChild = await getPublicChildById(childId);
          setChild(fetchedChild);
          if (fetchedChild) {
            const fetchedGifts = await getPublicGiftsByChildId(childId);
            setGifts(fetchedGifts);
          }
        } catch (error) {
          console.error("Error fetching public registry:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [childId, getPublicChildById, getPublicGiftsByChildId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading registry...</div>;
  }

  if (!child) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Registry Not Found</CardTitle>
            <CardDescription>The registry you are looking for does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/">Return to Grifyn Home</Link>
            </Button>
          </CardContent>
        </Card>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />
      </div>
      <header className="p-4 bg-background/95 backdrop-blur border-b border-border text-center relative z-10">
        <Link to="/" className="text-2xl font-bold text-primary">
          Grifyn <span className="text-accent-foreground">✨</span>
        </Link>
      </header>
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8 relative z-10">
        {/* Child Profile Header */}
        <Card className="p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage src={child.photo_url} alt={`${child.name}'s Photo`} />
            <AvatarFallback className="bg-muted text-muted-foreground text-4xl md:text-5xl">
              {child.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl font-bold text-primary">
              {child.name}'s Registry
            </h1>
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
        </Card>

        <div className="flex justify-center">
             <Button
                variant="outline"
                onClick={() => childId && saveRegistry(childId)}
                disabled={childId ? savedRegistryIds.includes(childId) : false}
             >
                {childId && savedRegistryIds.includes(childId) ? "Registry Saved" : "Save to My Dashboard"}
             </Button>
        </div>

        {/* Gifts Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center md:text-left">Gifts for {child.name}</h2>
          {gifts.length === 0 ? (
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle className="text-xl">No gifts added yet!</CardTitle>
                <CardDescription>Check back later, or contact the parent for more details.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map((gift) => (
                <GiftCardPublicView key={gift.id} gift={gift} childName={child.name} />
              ))}
            </div>
          )}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default PublicRegistryPage;
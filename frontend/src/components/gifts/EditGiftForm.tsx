"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, GiftType } from "@/types/grifyn";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

interface EditGiftFormProps {
  initialGiftData: Gift;
  onSubmit: (giftData: Partial<Omit<Gift, 'id' | 'childId' | 'createdAt' | 'lastModifiedAt' | 'sortOrder' | 'pledged_amount' | 'claimed_count' | 'type'>>) => void;
  onCancel: () => void;
}

export const EditGiftForm = ({ initialGiftData, onSubmit, onCancel }: EditGiftFormProps) => {
  const [title, setTitle] = useState(initialGiftData.title);
  const [description, setDescription] = useState(initialGiftData.description);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cash Fund specific
  const [targetAmount, setTargetAmount] = useState<string>(initialGiftData.target_amount?.toString() || "");
  const [externalPaymentUrl, setExternalPaymentUrl] = useState(initialGiftData.external_payment_url || "");

  // 529 Plan specific
  const [planName, setPlanName] = useState(initialGiftData.plan_name || "");
  const [contributionUrl, setContributionUrl] = useState(initialGiftData.contribution_url || "");

  // Physical Gift specific
  const [productUrl, setProductUrl] = useState(initialGiftData.product_url || "");
  const [imageUrl, setImageUrl] = useState(initialGiftData.image_url || "");
  const [merchant, setMerchant] = useState(initialGiftData.merchant || "");
  const [price, setPrice] = useState<string>(initialGiftData.price?.toString() || "");
  const [quantity, setQuantity] = useState<string>(initialGiftData.quantity?.toString() || "1");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedTitle, setScrapedTitle] = useState("");
  const [scrapedImageUrl, setScrapedImageUrl] = useState("");
  const [scrapedMerchant, setScrapedMerchant] = useState("");
  const [scrapedPrice, setScrapedPrice] = useState<string>("");

  useEffect(() => {
    // Reset form fields when initialGiftData changes (e.g., navigating between different gifts)
    setTitle(initialGiftData.title);
    setDescription(initialGiftData.description);
    setTargetAmount(initialGiftData.target_amount?.toString() || "");
    setExternalPaymentUrl(initialGiftData.external_payment_url || "");
    setPlanName(initialGiftData.plan_name || "");
    setContributionUrl(initialGiftData.contribution_url || "");
    setProductUrl(initialGiftData.product_url || "");
    setImageUrl(initialGiftData.image_url || "");
    setMerchant(initialGiftData.merchant || "");
    setPrice(initialGiftData.price?.toString() || "");
    setQuantity(initialGiftData.quantity?.toString() || "1");
    setErrors({});
    setIsScraping(false);
    setScrapedTitle("");
    setScrapedImageUrl("");
    setScrapedMerchant("");
    setScrapedPrice("");
  }, [initialGiftData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (description.length > 500) newErrors.description = "Description cannot exceed 500 characters.";

    if (initialGiftData.type === "fund") {
      if (!externalPaymentUrl.trim()) newErrors.externalPaymentUrl = "External Payment Link is required.";
      if (targetAmount && (isNaN(parseFloat(targetAmount)) || parseFloat(targetAmount) <= 0)) {
        newErrors.targetAmount = "Target Amount must be a positive number.";
      }
    } else if (initialGiftData.type === "529") {
      if (!planName.trim()) newErrors.planName = "Plan Name is required.";
      if (!contributionUrl.trim()) newErrors.contributionUrl = "529 Contribution URL is required.";
    } else if (initialGiftData.type === "physical") {
      if (!productUrl.trim()) newErrors.productUrl = "Product URL is required.";
      if (!quantity.trim() || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
        newErrors.quantity = "Quantity must be a positive integer.";
      }
      if (price && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
        newErrors.price = "Price must be a positive number.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const baseGiftData = { title, description };
      let specificGiftData: any = {};

      if (initialGiftData.type === "fund") {
        specificGiftData = {
          target_amount: targetAmount ? parseFloat(targetAmount) : undefined,
          external_payment_url: externalPaymentUrl,
        };
      } else if (initialGiftData.type === "529") {
        specificGiftData = {
          plan_name: planName,
          contribution_url: contributionUrl,
        };
      } else if (initialGiftData.type === "physical") {
        specificGiftData = {
          product_url: productUrl,
          image_url: imageUrl || scrapedImageUrl, // Use manual if present, else scraped
          merchant: merchant || scrapedMerchant, // Use manual if present, else scraped
          price: price ? parseFloat(price) : (scrapedPrice ? parseFloat(scrapedPrice) : undefined), // Use manual if present, else scraped
          quantity: parseInt(quantity),
        };
      }
      onSubmit({ ...baseGiftData, ...specificGiftData });
    }
  };

  // Simulated auto-scrape functionality
  const handleProductUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProductUrl(url);
    setErrors((prev) => ({ ...prev, productUrl: "" }));

    // Reset scraped data and manual overrides
    setScrapedTitle("");
    setScrapedImageUrl("");
    setScrapedMerchant("");
    setScrapedPrice("");
    setTitle(initialGiftData.title); // Reset manual title to initial
    setImageUrl(initialGiftData.image_url || ""); // Reset manual image to initial
    setMerchant(initialGiftData.merchant || ""); // Reset manual merchant to initial
    setPrice(initialGiftData.price?.toString() || ""); // Reset manual price to initial

    if (url.trim() === "") {
      setIsScraping(false);
      return;
    }

    setIsScraping(true);
    setTimeout(() => {
      if (url.includes("amazon.com")) {
        setScrapedTitle("Amazon Product (Scraped)");
        setScrapedImageUrl("https://via.placeholder.com/150/0000FF/FFFFFF?text=Amazon");
        setScrapedMerchant("Amazon");
        setScrapedPrice("29.99");
        setTitle("Amazon Product (Scraped)"); // Pre-fill title
        setPrice("29.99"); // Pre-fill price
      } else if (url.includes("target.com")) {
        setScrapedTitle("Target Product (Scraped)");
        setScrapedImageUrl("https://via.placeholder.com/150/FF0000/FFFFFF?text=Target");
        setScrapedMerchant("Target");
        setScrapedPrice("19.99");
        setTitle("Target Product (Scraped)"); // Pre-fill title
        setPrice("19.99"); // Pre-fill price
      } else {
        // Simulate scrape failure or no match
        setScrapedTitle("Could not scrape product details.");
        setScrapedImageUrl("");
        setScrapedMerchant("");
        setScrapedPrice("");
      }
      setIsScraping(false);
    }, 1500); // Simulate network delay
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Gift Title</Label>
        <Input
          id="title"
          placeholder="e.g., College Fund, New Bike, Art Supplies"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors((prev) => ({ ...prev, title: "" }));
          }}
          className={cn(errors.title && "border-destructive")}
        />
        {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="description">Why this matters (optional)</Label>
        <Textarea
          id="description"
          placeholder="e.g., To help Leo save for his future education..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors((prev) => ({ ...prev, description: "" }));
          }}
          maxLength={500}
        />
        {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
        <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
      </div>

      {initialGiftData.type === "fund" && (
        <>
          <div>
            <Label htmlFor="targetAmount">Target Amount (optional)</Label>
            <Input
              id="targetAmount"
              type="number"
              placeholder="e.g., 500"
              value={targetAmount}
              onChange={(e) => {
                setTargetAmount(e.target.value);
                setErrors((prev) => ({ ...prev, targetAmount: "" }));
              }}
              className={cn(errors.targetAmount && "border-destructive")}
            />
            {errors.targetAmount && <p className="text-destructive text-sm mt-1">{errors.targetAmount}</p>}
          </div>
          <div>
            <Label htmlFor="externalPaymentUrl">External Payment Link</Label>
            <Input
              id="externalPaymentUrl"
              type="url"
              placeholder="e.g., paypal.me/yourfund"
              value={externalPaymentUrl}
              onChange={(e) => {
                setExternalPaymentUrl(e.target.value);
                setErrors((prev) => ({ ...prev, externalPaymentUrl: "" }));
              }}
              className={cn(errors.externalPaymentUrl && "border-destructive")}
            />
            {errors.externalPaymentUrl && <p className="text-destructive text-sm mt-1">{errors.externalPaymentUrl}</p>}
          </div>
        </>
      )}

      {initialGiftData.type === "529" && (
        <>
          <div>
            <Label htmlFor="planName">529 Plan Name</Label>
            <Input
              id="planName"
              placeholder="e.g., Fidelity 529 Plan"
              value={planName}
              onChange={(e) => {
                setPlanName(e.target.value);
                setErrors((prev) => ({ ...prev, planName: "" }));
              }}
              className={cn(errors.planName && "border-destructive")}
            />
            {errors.planName && <p className="text-destructive text-sm mt-1">{errors.planName}</p>}
          </div>
          <div>
            <Label htmlFor="contributionUrl">529 Contribution URL</Label>
            <Input
              id="contributionUrl"
              type="url"
              placeholder="e.g., fidelity.com/529/contribute"
              value={contributionUrl}
              onChange={(e) => {
                setContributionUrl(e.target.value);
                setErrors((prev) => ({ ...prev, contributionUrl: "" }));
              }}
              className={cn(errors.contributionUrl && "border-destructive")}
            />
            {errors.contributionUrl && <p className="text-destructive text-sm mt-1">{errors.contributionUrl}</p>}
          </div>
        </>
      )}

      {initialGiftData.type === "physical" && (
        <>
          <div>
            <Label htmlFor="productUrl">Product URL</Label>
            <Input
              id="productUrl"
              type="url"
              placeholder="e.g., amazon.com/product-link"
              value={productUrl}
              onChange={handleProductUrlChange}
              className={cn(errors.productUrl && "border-destructive")}
            />
            {errors.productUrl && <p className="text-destructive text-sm mt-1">{errors.productUrl}</p>}
          </div>

          {isScraping && (
            <div className="flex items-center space-x-2">
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          )}

          {!isScraping && (scrapedImageUrl || scrapedTitle) && (
            <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
              {scrapedImageUrl ? (
                <img src={scrapedImageUrl} alt="Scraped Product" className="w-16 h-16 object-contain rounded-md" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">No Image</div>
              )}
              <div>
                <p className="text-sm font-medium">{scrapedTitle}</p>
                {scrapedMerchant && scrapedPrice && (
                  <p className="text-xs text-muted-foreground">{scrapedMerchant} - ${scrapedPrice}</p>
                )}
                {!scrapedMerchant && !scrapedPrice && scrapedTitle !== "Could not scrape product details." && (
                  <p className="text-xs text-muted-foreground">Details scraped.</p>
                )}
                {scrapedTitle === "Could not scrape product details." && (
                  <p className="text-xs text-destructive">Scrape failed. Please enter details manually.</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2 border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-muted-foreground">Manual Overrides (Optional)</p>
            <div>
              <Label htmlFor="manualTitle">Manual Title</Label>
              <Input
                id="manualTitle"
                placeholder="e.g., LEGO City Police Car"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="manualImageUrl">Manual Image URL</Label>
              <Input
                id="manualImageUrl"
                placeholder="e.g., https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="manualMerchant">Manual Merchant</Label>
              <Input
                id="manualMerchant"
                placeholder="e.g., Amazon"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="manualPrice">Manual Price</Label>
              <Input
                id="manualPrice"
                type="number"
                placeholder="e.g., 29.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="e.g., 1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors((prev) => ({ ...prev, quantity: "" }));
              }}
              className={cn(errors.quantity && "border-destructive")}
            />
            {errors.quantity && <p className="text-destructive text-sm mt-1">{errors.quantity}</p>}
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};
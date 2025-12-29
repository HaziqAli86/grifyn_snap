export type GiftType = "fund" | "529" | "physical";
export type PledgeStatus = "pending" | "fulfilled" | "received";

export interface Child {
  id: string;
  userId: string; // Frontend-only: mock user ID
  name: string;
  photo_url?: string;
  birthday_or_age: string; // Can be a date string or age string
  interests: string[];
  createdAt: string;
  lastModifiedAt: string;
}

export interface Gift {
  id: string;
  childId: string;
  type: GiftType;
  title: string;
  description: string; // "Why this matters"
  sortOrder: number;
  createdAt: string;
  lastModifiedAt: string;
  // Type-specific attributes
  target_amount?: number; // For 'fund'
  pledged_amount?: number; // For 'fund'
  external_payment_url?: string; // For 'fund'

  plan_name?: string; // For '529'
  contribution_url?: string; // For '529'

  product_url?: string; // For 'physical'
  image_url?: string; // For 'physical' (scraped)
  merchant?: string; // For 'physical' (scraped)
  price?: number; // For 'physical' (scraped)
  quantity?: number; // For 'physical'
  claimed_count?: number; // For 'physical'
}

export interface Pledge {
  id: string;
  childId: string;
  giftId: string;
  giver_name: string;
  amount?: number; // For 'fund' pledges
  note?: string;
  status: PledgeStatus;
  createdAt: string;
  thanked?: boolean; // New field for thank you manager
}
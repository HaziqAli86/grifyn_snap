"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Child, Gift, Pledge, GiftType, PledgeStatus } from '@/types/grifyn';
import { useAuth } from './AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import api from '@/utils/api';

interface RegistryContextType {
  children: Child[];
  addChild: (childData: Omit<Child, 'id' | 'createdAt' | 'lastModifiedAt' | 'userId'>) => Promise<Child | null>;
  updateChild: (childId: string, childData: Partial<Omit<Child, 'id' | 'createdAt' | 'userId'>>) => Promise<void>;
  deleteChild: (childId: string) => Promise<void>;
  getGiftsByChildId: (childId: string) => Gift[];
  addGift: (childId: string, giftData: Omit<Gift, 'id' | 'childId' | 'createdAt' | 'lastModifiedAt' | 'sortOrder' | 'pledgedAmount' | 'claimedCount' | 'type'>, type: GiftType) => Promise<Gift | null>;
  updateGift: (giftId: string, giftData: Partial<Omit<Gift, 'id' | 'childId' | 'createdAt'>>) => Promise<void>;
  deleteGift: (giftId: string) => Promise<void>;
  updateGiftOrder: (childId: string, orderedGiftIds: string[]) => Promise<void>;
  getPledgesByChildId: (childId: string) => Pledge[];
  addPledge: (childId: string, giftId: string, pledgeData: Omit<Pledge, 'id' | 'childId' | 'giftId' | 'createdAt' | 'status' | 'thanked'>) => Promise<Pledge | null>;
  updatePledgeStatus: (pledgeId: string, status: PledgeStatus) => Promise<void>;
  updatePledgeThankedStatus: (pledgeId: string, thanked: boolean) => Promise<void>;
  getChildById: (childId: string) => Child | undefined;
  getGiftById: (giftId: string) => Gift | undefined;
  
  // Saved Registry Features (Local Only for now)
  savedRegistryIds: string[];
  saveRegistry: (childId: string) => Promise<boolean>;
  unsaveRegistry: (childId: string) => void;
  getPublicChildById: (childId: string) => Promise<Child | undefined>;
  getPublicGiftsByChildId: (childId: string) => Promise<Gift[]>;
  publicUpdateTrigger: number;
}

const RegistryContext = createContext<RegistryContextType | undefined>(undefined);

export const RegistryProvider = ({ children: reactChildren }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [allChildren, setAllChildren] = useState<Child[]>([]);
  const [allGifts, setAllGifts] = useState<Gift[]>([]);
  const [allPledges, setAllPledges] = useState<Pledge[]>([]);
  
  // Keep saved registries in local storage for now
  const [savedRegistryIds, setSavedRegistryIds] = useState<string[]>([]);
  const [publicUpdateTrigger, setPublicUpdateTrigger] = useState(0);

  // Load saved registries from API
  useEffect(() => {
    const fetchSavedRegistries = async () => {
        if (!user) {
            setSavedRegistryIds([]);
            return;
        }
        try {
            const response = await api.get('/users/me/saved-registries');
            setSavedRegistryIds(response.data);
        } catch (error) {
            console.error("Failed to fetch saved registries", error);
        }
    };
    fetchSavedRegistries();
  }, [user]);


  // Fetch initial data when user logs in
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setAllChildren([]);
        setAllGifts([]);
        setAllPledges([]);
        return;
      }

      try {
        // Fetch Children
        const childrenRes = await api.get('/children');
        const fetchedChildren = childrenRes.data;
        setAllChildren(fetchedChildren);

        // Fetch Gifts and Pledges for each child
        // Note: In a larger app, we might fetch these on demand or have a bulk endpoint
        let fetchedGifts: Gift[] = [];
        let fetchedPledges: Pledge[] = [];

        for (const child of fetchedChildren) {
             const [giftsRes, pledgesRes] = await Promise.all([
                 api.get(`/gifts/${child.id}`),
                 api.get(`/pledges/${child.id}`)
             ]);
             fetchedGifts = [...fetchedGifts, ...giftsRes.data];
             fetchedPledges = [...fetchedPledges, ...pledgesRes.data];
        }

        setAllGifts(fetchedGifts);
        setAllPledges(fetchedPledges);

      } catch (error) {
        console.error("Failed to fetch registry data", error);
        showError("Failed to load your registry data.");
      }
    };

    fetchData();
  }, [user]);


  const addChild = useCallback(async (childData: Omit<Child, 'id' | 'createdAt' | 'lastModifiedAt' | 'userId'>): Promise<Child | null> => {
    if (!user) {
      showError("You must be signed in to add a child.");
      return null;
    }
    try {
        const response = await api.post('/children', childData);
        const newChild = response.data;
        setAllChildren((prev) => [...prev, newChild]);
        showSuccess("Child profile created!");
        return newChild;
    } catch (e) {
        console.error(e);
        showError("Failed to create child profile.");
        return null;
    }
  }, [user]);

  const updateChild = useCallback(async (childId: string, childData: Partial<Omit<Child, 'id' | 'createdAt' | 'userId'>>) => {
    try {
        const response = await api.put(`/children/${childId}`, childData);
        const updatedChild = response.data;
        setAllChildren((prev) =>
            prev.map((child) => (child.id === childId ? updatedChild : child))
        );
        showSuccess("Child profile updated!");
    } catch (e) {
        console.error(e);
        showError("Failed to update child profile.");
    }
  }, []);

  const deleteChild = useCallback(async (childId: string) => {
    try {
        await api.delete(`/children/${childId}`);
        setAllChildren((prev) => prev.filter((child) => child.id !== childId));
        setAllGifts((prev) => prev.filter((gift) => gift.childId !== childId));
        setAllPledges((prev) => prev.filter((pledge) => pledge.childId !== childId));
        showSuccess("Child profile deleted.");
    } catch (e) {
        console.error(e);
        showError("Failed to delete child profile.");
    }
  }, []);

  const getChildById = useCallback((childId: string) => {
    return allChildren.find(child => child.id === childId);
  }, [allChildren]);

  const getGiftsByChildId = useCallback((childId: string): Gift[] => {
    return allGifts.filter((gift) => gift.childId === childId).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [allGifts]);

  const getGiftById = useCallback((giftId: string) => {
    return allGifts.find(gift => gift.id === giftId);
  }, [allGifts]);

  const addGift = useCallback(async (childId: string, giftData: Omit<Gift, 'id' | 'childId' | 'createdAt' | 'lastModifiedAt' | 'sortOrder' | 'pledgedAmount' | 'claimedCount'>, type: GiftType): Promise<Gift | null> => {
    if (!user) {
      showError("You must be signed in to add a gift.");
      return null;
    }
    
    // Prepare payload (filtering out unused fields handled by backend models if needed, 
    // but sending everything is usually fine if backend ignores extras or we are careful)
    const payload = {
        type,
        ...giftData
    };

    try {
        const response = await api.post(`/gifts/${childId}`, payload);
        const newGift = response.data;
        setAllGifts((prev) => [...prev, newGift]);
        showSuccess("Gift added to registry!");
        return newGift;
    } catch (e) {
        console.error(e);
        showError("Failed to add gift.");
        return null;
    }
  }, [user]);

  const updateGift = useCallback(async (giftId: string, giftData: Partial<Omit<Gift, 'id' | 'childId' | 'createdAt'>>) => {
    try {
        const response = await api.put(`/gifts/${giftId}`, giftData);
        const updatedGift = response.data;
        setAllGifts((prev) =>
            prev.map((gift) => (gift.id === giftId ? updatedGift : gift))
        );
        showSuccess("Gift updated!");
    } catch (e) {
        console.error(e);
        showError("Failed to update gift.");
    }
  }, []);

  const deleteGift = useCallback(async (giftId: string) => {
    try {
        await api.delete(`/gifts/${giftId}`);
        setAllGifts((prev) => prev.filter((gift) => gift.id !== giftId));
        setAllPledges((prev) => prev.filter((pledge) => pledge.giftId !== giftId));
        showSuccess("Gift deleted.");
    } catch (e) {
        console.error(e);
        showError("Failed to delete gift.");
    }
  }, []);

  const updateGiftOrder = useCallback(async (childId: string, orderedGiftIds: string[]) => {
      // Optimistic update
      setAllGifts((prev) => {
          const otherGifts = prev.filter(g => g.childId !== childId);
          const childGifts = prev.filter(g => g.childId === childId);
          
          const reorderedChildGifts = orderedGiftIds.map((id, index) => {
              const gift = childGifts.find(g => g.id === id);
              if (gift) return { ...gift, sortOrder: index };
              return undefined;
          }).filter((g): g is Gift => !!g);

          return [...otherGifts, ...reorderedChildGifts];
      });

      try {
          await api.patch(`/gifts/${childId}/reorder`, { ordered_ids: orderedGiftIds });
      } catch (e) {
          console.error(e);
          showError("Failed to save sort order.");
          // Ideally revert optimistic update here
      }
  }, []);

  const getPledgesByChildId = useCallback((childId: string): Pledge[] => {
    return allPledges.filter((pledge) => pledge.childId === childId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allPledges]);

  const addPledge = useCallback(async (childId: string, giftId: string, pledgeData: Omit<Pledge, 'id' | 'childId' | 'giftId' | 'createdAt' | 'status' | 'thanked'>): Promise<Pledge | null> => {
    try {
        const response = await api.post(`/pledges/${childId}/${giftId}`, pledgeData);
        const newPledge = response.data;
        
        // If we are the owner, update local state
        const isOwnChild = allChildren.some(c => c.id === childId);
        if (isOwnChild) {
            setAllPledges((prev) => [...prev, newPledge]);
            
            // Update gift stats locally
            setAllGifts((prev) => prev.map(gift => {
                if (gift.id === giftId) {
                    if (gift.type === 'fund' && newPledge.amount) {
                        return { ...gift, pledged_amount: (gift.pledged_amount || 0) + newPledge.amount };
                    }
                    if (gift.type === 'physical') {
                        return { ...gift, claimed_count: (gift.claimed_count || 0) + 1 };
                    }
                }
                return gift;
            }));
        } else {
             setPublicUpdateTrigger(prev => prev + 1);
        }

        showSuccess("Pledge recorded!");
        return newPledge;
    } catch (e) {
        console.error(e);
        showError("Failed to record pledge.");
        return null;
    }
  }, [allChildren]);

  const updatePledgeStatus = useCallback(async (pledgeId: string, status: PledgeStatus) => {
    try {
        const response = await api.put(`/pledges/${pledgeId}/status`, { status });
        const updatedPledge = response.data;
        setAllPledges((prev) =>
            prev.map((pledge) => (pledge.id === pledgeId ? updatedPledge : pledge))
        );
        showSuccess("Pledge status updated!");
    } catch (e) {
        console.error(e);
        showError("Failed to update pledge status.");
    }
  }, []);

  const updatePledgeThankedStatus = useCallback(async (pledgeId: string, thanked: boolean) => {
    try {
        const response = await api.put(`/pledges/${pledgeId}/thanked`, { thanked });
        const updatedPledge = response.data;
        setAllPledges((prev) =>
            prev.map((pledge) => (pledge.id === pledgeId ? updatedPledge : pledge))
        );
        showSuccess(thanked ? "Pledge marked as thanked!" : "Pledge marked as un-thanked.");
    } catch (e) {
        console.error(e);
        showError("Failed to update thanked status.");
    }
  }, []);

  // Saved Registry Logic
  const saveRegistry = useCallback(async (childId: string) => {
    if (!user) {
        showError("Please sign in to save registries.");
        return false;
    }
    if (savedRegistryIds.includes(childId)) {
      showError("You have already saved this registry.");
      return false;
    }
    
    try {
        await api.post(`/users/me/saved-registries/${childId}`);
        setSavedRegistryIds(prev => [...prev, childId]);
        showSuccess("Registry saved to your dashboard!");
        return true;
    } catch (e) {
        console.error(e);
        showError("Failed to save registry.");
        return false;
    }
  }, [user, savedRegistryIds]);

  const unsaveRegistry = useCallback(async (childId: string) => {
    if (!user) return;
    try {
        await api.delete(`/users/me/saved-registries/${childId}`);
        setSavedRegistryIds(prev => prev.filter(id => id !== childId));
        showSuccess("Registry removed from saved list.");
    } catch (e) {
        console.error(e);
        showError("Failed to remove registry.");
    }
  }, [user]);

  const getPublicChildById = useCallback(async (childId: string): Promise<Child | undefined> => {
     try {
         const response = await api.get(`/children/${childId}/public`);
         return response.data;
     } catch (e) {
         console.error(e);
         return undefined;
     }
  }, []);

  const getPublicGiftsByChildId = useCallback(async (childId: string): Promise<Gift[]> => {
      try {
          const response = await api.get(`/gifts/${childId}/public`);
          return response.data;
      } catch (e) {
          console.error(e);
          return [];
      }
  }, [publicUpdateTrigger]);

  const value = React.useMemo(
    () => ({
      children: allChildren,
      addChild,
      updateChild,
      deleteChild,
      getGiftsByChildId,
      addGift,
      updateGift,
      deleteGift,
      updateGiftOrder,
      getPledgesByChildId,
      addPledge,
      updatePledgeStatus,
      updatePledgeThankedStatus,
      getChildById,
      getGiftById,
      savedRegistryIds,
      saveRegistry,
      unsaveRegistry,
      getPublicChildById,
      getPublicGiftsByChildId,
      publicUpdateTrigger
    }),
    [
      allChildren,
      addChild,
      updateChild,
      deleteChild,
      getGiftsByChildId,
      addGift,
      updateGift,
      deleteGift,
      updateGiftOrder,
      getPledgesByChildId,
      addPledge,
      updatePledgeStatus,
      updatePledgeThankedStatus,
      getChildById,
      getGiftById,
      savedRegistryIds,
      saveRegistry,
      unsaveRegistry,
      getPublicChildById,
      getPublicGiftsByChildId,
      publicUpdateTrigger
    ]
  );

  return <RegistryContext.Provider value={value}>{reactChildren}</RegistryContext.Provider>;
};

export const useRegistry = () => {
  const context = useContext(RegistryContext);
  if (context === undefined) {
    throw new Error('useRegistry must be used within a RegistryProvider');
  }
  return context;
};
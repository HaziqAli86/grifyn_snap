from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.models.registry import Child, Gift, GiftCreate, GiftUpdate, GiftResponse, Pledge

router = APIRouter()

class ReorderRequest(BaseModel):
    ordered_ids: List[str]

@router.get("/{child_id}/public", response_model=List[GiftResponse])
async def get_public_gifts(child_id: str) -> Any:
    """
    Retrieve all gifts for a child (public access).
    """
    # Verify child exists
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    
    gifts = await Gift.find(Gift.child_id == child_id).sort("sort_order").to_list()
    return gifts

@router.get("/{child_id}", response_model=List[GiftResponse])
async def get_gifts(
    child_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve all gifts for a child (owner access).
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view these gifts")
        
    gifts = await Gift.find(Gift.child_id == child_id).sort("sort_order").to_list()
    return gifts

@router.post("/{child_id}", response_model=GiftResponse)
async def create_gift(
    child_id: str,
    gift_in: GiftCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Add a gift to a child's registry.
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to add gifts for this child")

    # Determine sort order (append to end)
    existing_count = await Gift.find(Gift.child_id == child_id).count()
    
    gift = Gift(
        child_id=child_id,
        sort_order=existing_count,
        **gift_in.dict()
    )
    await gift.insert()
    return gift

@router.put("/{gift_id}", response_model=GiftResponse)
async def update_gift(
    gift_id: str,
    gift_in: GiftUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update a gift.
    """
    gift = await Gift.get(gift_id)
    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")
    
    child = await Child.get(gift.child_id)
    if not child or child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this gift")
        
    update_data = gift_in.dict(exclude_unset=True)
    await gift.set(update_data)
    return gift

@router.delete("/{gift_id}")
async def delete_gift(
    gift_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Delete a gift and its associated pledges.
    """
    gift = await Gift.get(gift_id)
    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")
        
    child = await Child.get(gift.child_id)
    if not child or child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this gift")
        
    # Delete associated pledges
    await Pledge.find(Pledge.gift_id == gift_id).delete()
    
    await gift.delete()
    return {"message": "Gift deleted successfully"}

@router.patch("/{child_id}/reorder")
async def reorder_gifts(
    child_id: str,
    request: ReorderRequest,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update the sort order of gifts.
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to reorder gifts for this child")
        
    for index, gift_id in enumerate(request.ordered_ids):
        # Retrieve gift to ensure it belongs to this child
        gift = await Gift.get(gift_id)
        if gift and gift.child_id == child_id:
             gift.sort_order = index
             await gift.save()
             
    return {"message": "Gift order updated"}
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.models.registry import Child, Gift, Pledge, PledgeCreate, PledgeStatus, GiftType, PledgeResponse

router = APIRouter()

class PledgeStatusUpdate(BaseModel):
    status: PledgeStatus

class PledgeThankedUpdate(BaseModel):
    thanked: bool

@router.get("/{child_id}", response_model=List[PledgeResponse])
async def get_pledges(
    child_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve all pledges for a child (owner only).
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view pledges for this child")
        
    pledges = await Pledge.find(Pledge.child_id == child_id).sort("-created_at").to_list()
    return pledges

@router.post("/{child_id}/{gift_id}", response_model=PledgeResponse)
async def create_pledge(
    child_id: str,
    gift_id: str,
    pledge_in: PledgeCreate
) -> Any:
    """
    Create a pledge for a gift (Public access).
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
        
    gift = await Gift.get(gift_id)
    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")
    if gift.child_id != child_id:
        raise HTTPException(status_code=400, detail="Gift does not belong to this child")

    # Create the pledge
    pledge = Pledge(
        child_id=child_id,
        gift_id=gift_id,
        **pledge_in.dict()
    )
    await pledge.insert()

    # Update Gift stats
    if gift.type == GiftType.FUND:
        if pledge_in.amount:
            gift.pledged_amount = (gift.pledged_amount or 0.0) + pledge_in.amount
            await gift.save()
    elif gift.type == GiftType.PHYSICAL:
        gift.claimed_count = (gift.claimed_count or 0) + 1
        await gift.save()
        
    return pledge

@router.put("/{pledge_id}/status", response_model=PledgeResponse)
async def update_pledge_status(
    pledge_id: str,
    update_in: PledgeStatusUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update pledge status.
    """
    pledge = await Pledge.get(pledge_id)
    if not pledge:
        raise HTTPException(status_code=404, detail="Pledge not found")
        
    child = await Child.get(pledge.child_id)
    if not child or child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this pledge")
        
    pledge.status = update_in.status
    await pledge.save()
    return pledge

@router.put("/{pledge_id}/thanked", response_model=PledgeResponse)
async def update_pledge_thanked(
    pledge_id: str,
    update_in: PledgeThankedUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update pledge thanked status.
    """
    pledge = await Pledge.get(pledge_id)
    if not pledge:
        raise HTTPException(status_code=404, detail="Pledge not found")
        
    child = await Child.get(pledge.child_id)
    if not child or child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this pledge")
        
    pledge.thanked = update_in.thanked
    await pledge.save()
    return pledge
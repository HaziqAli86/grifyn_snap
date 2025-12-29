from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.models.user import User
from app.models.registry import Child, ChildCreate, ChildUpdate, ChildResponse, Gift, Pledge

router = APIRouter()

@router.get("/", response_model=List[ChildResponse])
async def get_children(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve all children for the current user.
    """
    children = await Child.find(Child.user_id == str(current_user.id)).to_list()
    return children

@router.post("/", response_model=ChildResponse)
async def create_child(
    child_in: ChildCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Create a new child profile.
    """
    child = Child(
        user_id=str(current_user.id),
        **child_in.dict()
    )
    await child.insert()
    return child

@router.put("/{child_id}", response_model=ChildResponse)
async def update_child(
    child_id: str,
    child_in: ChildUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update a child profile.
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this child")
    
    update_data = child_in.dict(exclude_unset=True)
    await child.set(update_data)
    return child

@router.delete("/{child_id}")
async def delete_child(
    child_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Delete a child profile and all associated data.
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if child.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this child")
    
    # Delete associated gifts and pledges
    await Gift.find(Gift.child_id == child_id).delete()
    await Pledge.find(Pledge.child_id == child_id).delete()
    
    await child.delete()
    return {"message": "Child deleted successfully"}

# Public endpoint for viewing a child (no auth required)
@router.get("/{child_id}/public", response_model=ChildResponse)
async def get_public_child(child_id: str) -> Any:
    """
    Retrieve a child profile publicly.
    """
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    return child
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.models.user import User, UserResponse
from app.models.registry import Child

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return UserResponse(id=str(current_user.id), email=current_user.email)

@router.get("/me/saved-registries", response_model=List[str])
async def get_saved_registries(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get list of saved registry IDs for the current user.
    """
    return current_user.saved_registry_ids

@router.post("/me/saved-registries/{child_id}")
async def save_registry(
    child_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Save a registry to the user's account.
    """
    # Verify registry exists
    child = await Child.get(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Registry not found")
    
    if child_id not in current_user.saved_registry_ids:
        current_user.saved_registry_ids.append(child_id)
        await current_user.save()
        
    return {"message": "Registry saved successfully", "saved_registry_ids": current_user.saved_registry_ids}

@router.delete("/me/saved-registries/{child_id}")
async def unsave_registry(
    child_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Remove a registry from the user's saved list.
    """
    if child_id in current_user.saved_registry_ids:
        current_user.saved_registry_ids.remove(child_id)
        await current_user.save()
        
    return {"message": "Registry removed from saved list", "saved_registry_ids": current_user.saved_registry_ids}
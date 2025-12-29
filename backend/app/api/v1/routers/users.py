from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.models.user import User, UserResponse, UserUpdatePassword
from app.models.registry import Child, Gift, Pledge
from app.core.security import verify_password, get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return UserResponse(id=str(current_user.id), email=current_user.email)

@router.put("/me/password")
async def update_password(
    password_data: UserUpdatePassword,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update user password.
    """
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.hashed_password = get_password_hash(password_data.new_password)
    await current_user.save()
    
    return {"message": "Password updated successfully"}

@router.delete("/me")
async def delete_user_account(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Delete user account and all associated data.
    """
    # Find all children associated with the user
    children = await Child.find(Child.user_id == str(current_user.id)).to_list()
    
    for child in children:
        child_id = str(child.id)
        # Delete all pledges associated with gifts for this child
        # This is tricky because pledges are linked to gift_id, not child_id directly in the model definition above
        # But wait, Pledge model DOES have child_id: Indexed(str)
        await Pledge.find(Pledge.child_id == child_id).delete()
        
        # Delete all gifts for this child
        await Gift.find(Gift.child_id == child_id).delete()
        
        # Delete the child
        await child.delete()
        
    # Delete the user
    await current_user.delete()
    
    return {"message": "Account and all associated data deleted successfully"}

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
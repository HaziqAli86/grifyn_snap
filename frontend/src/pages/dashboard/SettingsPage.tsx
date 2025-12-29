"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRegistry } from "@/context/RegistryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
import { showSuccess, showError } from "@/utils/toast";

const SettingsPage = () => {
  const { user, signOut, signIn } = useAuth(); // signIn is used to re-authenticate for password change
  const { children, allGifts, allPledges } = useRegistry(); // Access all data to clear on account deletion
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  const validatePasswordChange = () => {
    const newErrors: { [key: string]: string } = {};
    if (!currentPassword.trim()) newErrors.currentPassword = "Current password is required.";
    if (!newPassword.trim()) newErrors.newPassword = "New password is required.";
    else if (newPassword.length < 6) newErrors.newPassword = "New password must be at least 6 characters.";
    if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = "Passwords do not match.";
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (validatePasswordChange()) {
      // Mock re-authentication for password change
      const reAuthSuccess = await signIn(user.email, currentPassword);
      if (!reAuthSuccess) {
        setPasswordErrors((prev) => ({ ...prev, currentPassword: "Incorrect current password." }));
        return;
      }

      // Update password in mock_users
      const mockUsers = JSON.parse(localStorage.getItem('grifyn_mock_users') || '{}');
      if (mockUsers[user.email]) {
        mockUsers[user.email].password = newPassword;
        localStorage.setItem('grifyn_mock_users', JSON.stringify(mockUsers));
        showSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordErrors({});
      } else {
        showError("User not found. Please try again.");
      }
    }
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    // Clear user-specific data from localStorage
    localStorage.removeItem(`grifyn_registry_data_${user.id}`);

    // Remove user from mock_users
    const mockUsers = JSON.parse(localStorage.getItem('grifyn_mock_users') || '{}');
    delete mockUsers[user.email];
    localStorage.setItem('grifyn_mock_users', JSON.stringify(mockUsers));

    signOut(); // Sign out the user
    showSuccess("Your account and all associated data have been deleted.");
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View your account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} readOnly className="bg-muted" />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordErrors((prev) => ({ ...prev, currentPassword: "" }));
                }}
                className={cn(passwordErrors.currentPassword && "border-destructive")}
              />
              {passwordErrors.currentPassword && <p className="text-destructive text-sm mt-1">{passwordErrors.currentPassword}</p>}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                className={cn(passwordErrors.newPassword && "border-destructive")}
              />
              {passwordErrors.newPassword && <p className="text-destructive text-sm mt-1">{passwordErrors.newPassword}</p>}
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setPasswordErrors((prev) => ({ ...prev, confirmNewPassword: "" }));
                }}
                className={cn(passwordErrors.confirmNewPassword && "border-destructive")}
              />
              {passwordErrors.confirmNewPassword && <p className="text-destructive text-sm mt-1">{passwordErrors.confirmNewPassword}</p>}
            </div>
            <Button type="submit">Save New Password</Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your Grifyn account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete My Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account, all child profiles, gifts, and pledges.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
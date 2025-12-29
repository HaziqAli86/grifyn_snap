import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2 } from "lucide-react";
import { useRegistry } from "@/context/RegistryContext";
import { showError } from "@/utils/toast";

interface AddRegistryByUrlModalProps {
  onSuccess?: () => void;
}

export const AddRegistryByUrlModal = ({ onSuccess }: AddRegistryByUrlModalProps) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const { saveRegistry } = useRegistry();

  const handleSave = async () => {
    try {
      // Basic validation to extract ID from URL like ".../registry/CHILD_ID"
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      const registryIndex = pathSegments.indexOf('registry');
      
      if (registryIndex === -1 || registryIndex + 1 >= pathSegments.length) {
        showError("Invalid registry URL format.");
        return;
      }

      const childId = pathSegments[registryIndex + 1];
      
      if (!childId) {
        showError("Could not find child ID in URL.");
        return;
      }

      const success = await saveRegistry(childId);
      if (success) {
        setOpen(false);
        setUrl("");
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      showError("Please enter a valid URL.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link2 className="mr-2 h-4 w-4" />
          Add by Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Registry by Link</DialogTitle>
          <DialogDescription>
            Paste the public link shared by another parent to add their child's registry to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              placeholder="https://grifyn.app/registry/..."
              className="col-span-3"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save Registry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
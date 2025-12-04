"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SeedInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (seed: number) => void;
  isLoading?: boolean;
}

export function SeedInputDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: SeedInputDialogProps) {
  const [seed, setSeed] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const handleConfirm = () => {
    const seedValue = parseInt(seed, 10);
    
    if (isNaN(seedValue)) {
      setError("Bitte geben Sie eine gültige Zahl ein");
      return;
    }

    if (seedValue < 0) {
      setError("Der Seed muss eine positive Zahl sein");
      return;
    }

    setError("");
    onConfirm(seedValue);
    setSeed("0"); // Reset for next time
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Seed eingeben</DialogTitle>
          <DialogDescription>
            Geben Sie den Seed-Wert ein, der zur Generierung dieses Dienstplans
            verwendet wurde. Dies hilft bei der Identifizierung und Reproduzierbarkeit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="seed">Seed</Label>
            <Input
              id="seed"
              type="number"
              placeholder="0"
              value={seed}
              onChange={(e) => {
                setSeed(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Beispiel: 42, 123, 456
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Speichert..." : "Bestätigen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, Save } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoice: (choice: 'overwrite' | 'keep-monthly' | 'cancel') => void;
  employeeName: string;
}

export function GlobalWishesConflictDialog({ open, onOpenChange, onChoice, employeeName }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent >
        <DialogHeader className="pr-12">
          <DialogTitle>Konflikt mit bestehenden monatlichen Wünschen</DialogTitle>
          <DialogDescription className="whitespace-normal wrap-break-word">
            Für <strong>{employeeName}</strong> sind bereits monatliche Wünsche vorhanden. Wie möchtest du fortfahren?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="text-sm">
            <strong>1) Monatliche Wünsche löschen</strong>
            <div className="text-muted-foreground">Monatliche Wünsche für diesen Mitarbeiter werden entfernt und durch die globalen Wünsche ersetzt.</div>
          </div>

          <div className="text-sm">
            <strong>2) Monatliche Wünsche beibehalten und global ignorieren</strong>
            <div className="text-muted-foreground">Die globalen Änderungen werden gespeichert, werden aber für den aktuellen Monat nicht in die Monatsdaten übernommen.</div>
          </div>

          <div className="text-sm">
            <strong>3) Abbrechen und nicht speichern</strong>
            <div className="text-muted-foreground">Keine Änderungen werden übernommen.</div>
          </div>
        </div>

        <DialogFooter className="pt-4 flex-wrap sm:flex-nowrap justify-center gap-2">
          <Button variant="destructive" size="sm" className="min-w-0 whitespace-normal" onClick={() => { onChoice('overwrite'); onOpenChange(false); }}>
            <Check className="mr-2 h-4 w-4" /> Überschreiben
          </Button>
          <Button variant="outline" size="sm" className="min-w-0 whitespace-normal" onClick={() => { onChoice('keep-monthly'); onOpenChange(false); }}>
            <Save className="mr-2 h-4 w-4" /> Beibehalten
          </Button>
          <Button variant="outline" size="sm" className="min-w-0 whitespace-normal" onClick={() => { onChoice('cancel'); onOpenChange(false); }}>
            <X className="mr-2 h-4 w-4" /> Abbrechen
          </Button>


        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
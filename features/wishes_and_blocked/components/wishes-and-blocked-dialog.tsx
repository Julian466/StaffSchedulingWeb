'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { WishesAndBlockedForm } from './wishes-and-blocked-form';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WishesAndBlockedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: WishesAndBlockedEmployee;
  onSubmit: (data: Omit<WishesAndBlockedEmployee, 'key'>) => void;
  isSubmitting?: boolean;
}

export function WishesAndBlockedDialog({
  open,
  onOpenChange,
  employee,
  onSubmit,
  isSubmitting,
}: WishesAndBlockedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[50vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Mitarbeiter bearbeiten' : 'Neuer Eintrag'}
          </DialogTitle>
          <DialogDescription>
            {employee 
              ? 'Bearbeite Wünsche und Blockierungen für diesen Mitarbeiter.' 
              : 'Füge einen neuen Mitarbeiter mit seinen Wünschen und Blockierungen hinzu.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="pr-4">
            <WishesAndBlockedForm
              employee={employee}
              onSubmit={onSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

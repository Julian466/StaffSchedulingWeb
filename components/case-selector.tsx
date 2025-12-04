'use client';

import { useCase } from '@/components/case-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { useState } from 'react';
import { CaseInformationDialog } from './case-information-dialog';

export function CaseSelector() {
  const { currentCaseId, availableCases, caseInformation, switchCase, createNewCase, isLoading } = useCase();
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const handleCaseChange = async (value: string) => {
    await switchCase(parseInt(value));
  };

  const handleCreateCase = async () => {
    await createNewCase();
  };

  const getMonthName = (month: number) => {
    const names = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                   'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return names[month - 1];
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Case:</span>
        <Select
          value={currentCaseId.toString()}
          onValueChange={handleCaseChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Wähle Case" />
          </SelectTrigger>
          <SelectContent>
            {availableCases.map((caseId) => (
              <SelectItem key={caseId} value={caseId.toString()}>
                Case {caseId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCreateCase}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {caseInformation && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowInfoDialog(true)}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {getMonthName(caseInformation.month)} {caseInformation.year}
          </span>
        </Button>
      )}

      <CaseInformationDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
      />
    </div>
  );
}

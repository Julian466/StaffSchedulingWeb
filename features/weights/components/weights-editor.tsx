'use client';

import { useState, useEffect, useMemo } from 'react';
import { Weights, WEIGHT_METADATA } from '@/types/weights';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WeightsEditorProps {
  weights: Weights;
  onSave: (weights: Weights) => void;
  isSaving?: boolean;
}

/**
 * Component for editing solver weight configurations.
 * Provides sliders and numeric inputs for all weight values (0-100).
 */
export function WeightsEditor({ weights, onSave, isSaving }: WeightsEditorProps) {
  const [editedWeights, setEditedWeights] = useState<Weights>(weights);

  // Update local state when props change (deferred to avoid synchronous setState in effect)
  useEffect(() => {
    if (JSON.stringify(weights) !== JSON.stringify(editedWeights)) {
      Promise.resolve().then(() => setEditedWeights(weights));
    }
  }, [weights]);

  // Derived flag: are there unsaved changes?
  const hasChanges = useMemo(() => JSON.stringify(weights) !== JSON.stringify(editedWeights), [weights, editedWeights]);

  const handleWeightChange = (key: keyof Weights, value: number) => {
    // Ensure value is within bounds
    const clampedValue = Math.max(0, Math.min(100, value));
    setEditedWeights(prev => ({
      ...prev,
      [key]: clampedValue,
    }));
  };

  const handleSave = () => {
    onSave(editedWeights);
  };

  const handleReset = () => {
    setEditedWeights(weights);
  };

  return (
    <div className="space-y-3">
      {WEIGHT_METADATA.map((metadata) => {
        const value = editedWeights[metadata.key];
        
        return (
          <div key={metadata.key} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <Label className="font-medium text-sm">{metadata.label}</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">{metadata.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="w-16">
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => handleWeightChange(metadata.key, parseInt(e.target.value) || 0)}
                  min={metadata.min}
                  max={metadata.max}
                  className="text-center h-8 text-sm"
                />
              </div>
            </div>
            <Slider
              value={[value]}
              onValueChange={(values) => handleWeightChange(metadata.key, values[0])}
              min={metadata.min}
              max={metadata.max}
              step={1}
              className="w-full"
            />
          </div>
        );
      })}

      <div className="flex gap-2 justify-end pt-4 border-t sticky bottom-0 bg-background py-3">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          size="sm"
        >
          Zurücksetzen
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          size="sm"
        >
          {isSaving ? 'Speichern...' : 'Speichern'}
        </Button>
      </div>
    </div>
  );
}

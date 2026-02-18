'use client';

import { useState, useEffect, useMemo } from 'react';
import { Weights, WEIGHT_METADATA } from '@/types/weights';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Info, Download, Upload, Save } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SaveTemplateDialog } from '@/components/save-template-dialog';
import { ImportTemplateDialog } from '@/components/import-template-dialog';
import {
  useWeightTemplates,
  useCreateWeightTemplate,
  useWeightTemplate,
} from '@/features/weights/hooks/use-weight-templates';

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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const [importConfirmed, setImportConfirmed] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const { data: templates = [] } = useWeightTemplates();
  const { mutate: createTemplate, isPending: isCreating } = useCreateWeightTemplate();
  const { data: templateToImport } = useWeightTemplate(selectedTemplateId);

  // Update local state when props change (deferred to avoid synchronous setState in effect)
  useEffect(() => {
    if (JSON.stringify(weights) !== JSON.stringify(editedWeights)) {
      Promise.resolve().then(() => setEditedWeights(weights));
    }
  }, [weights]);

  // Perform import only after user confirmed
  useEffect(() => {
    if (templateToImport && importConfirmed) {
      // Defer state updates to avoid synchronous setState inside effect
      Promise.resolve().then(() => {
        setEditedWeights(templateToImport.content);
        setImportConfirmOpen(false);
        setImportConfirmed(false);
        setSelectedTemplateId(null);
        setImportDialogOpen(false);
      });
    }
  }, [templateToImport, importConfirmed]);
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

  const handleSaveAsTemplate = (description: string) => {
    createTemplate(
      { content: editedWeights, description },
      {
        onSuccess: () => {
          setSaveDialogOpen(false);
        },
      }
    );
  };

  const handleImportTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setImportDialogOpen(false);
    // Open confirmation dialog but do NOT perform import yet
    setImportConfirmOpen(true);
  };

  const confirmImport = () => {
    // User confirmed: set flag which triggers the actual import in useEffect
    setImportConfirmed(true);
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

      <div className="flex gap-2 justify-between pt-4 border-t sticky bottom-0 bg-background py-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            disabled={isSaving}
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Template laden
          </Button>
          <Button
            variant="outline"
            onClick={() => setSaveDialogOpen(true)}
            disabled={isSaving}
            size="sm"
          >
            <Save className="mr-2 h-4 w-4" />
            Als Template speichern
          </Button>
        </div>
        <div className="flex gap-2">
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

      <SaveTemplateDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveAsTemplate}
        isSaving={isCreating}
        title="Gewichtungen als Template speichern"
        descriptionPlaceholder="z.B. 'Standardkonfiguration für Nachtschichten' oder 'Optimiert für Wochenenden'"
      />

      <ImportTemplateDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        templates={templates}
        onImport={handleImportTemplate}
        title="Gewichtungs-Template laden"
      />

      <AlertDialog open={importConfirmOpen} onOpenChange={setImportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Template laden?</AlertDialogTitle>
            <AlertDialogDescription>
              Die aktuellen Gewichtungen werden durch das gewählte Template ersetzt.
              Nicht gespeicherte Änderungen gehen verloren. Möchten Sie fortfahren?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTemplateId(null)}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>
              Laden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

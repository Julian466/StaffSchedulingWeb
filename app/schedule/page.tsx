'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Maximize2, Upload, Trash2 } from 'lucide-react';
import { ScheduleTable } from '@/features/schedule/components/schedule-table';
import { StatsGrid } from '@/features/schedule/components/stats-grid';
import { ScheduleFileUpload } from '@/features/schedule/components/schedule-file-upload';
import { ScheduleLegend } from '@/features/schedule/components/schedule-legend';
import { ScheduleSelector } from '@/components/schedule-selector';
import { SeedInputDialog } from '@/components/seed-input-dialog';
import { 
  useSchedule, 
  useSaveSchedule, 
  useDeleteSchedule,
  useSchedulesMetadata,
  useSelectSchedule
} from '@/features/schedule/hooks/use-schedule';
import { ScheduleSolutionRaw } from '@/types/schedule';
import { toast } from 'sonner';

export default function SchedulePage() {
  const { data: schedule, isLoading, refetch: refetchSchedule } = useSchedule();
  const { data: schedulesMetadata, isLoading: isMetadataLoading, refetch: refetchMetadata } = useSchedulesMetadata();
  const saveSchedule = useSaveSchedule();
  const deleteSchedule = useDeleteSchedule();
  const selectSchedule = useSelectSchedule();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSeedDialog, setShowSeedDialog] = useState(false);
  const [pendingSolution, setPendingSolution] = useState<ScheduleSolutionRaw | null>(null);

  const handleFileLoaded = async (solutionData: ScheduleSolutionRaw) => {
    setPendingSolution(solutionData);
    setShowSeedDialog(true);
  };

  const handleSeedConfirm = async (seed: number) => {
    if (!pendingSolution) return;

    try {
      const scheduleId = Date.now().toString();
      
      await saveSchedule.mutateAsync({
        scheduleId,
        seed,
        solution: pendingSolution,
        autoSelect: true,
      });

      // Refetch metadata and the selected schedule because we added a new schedule
      await refetchMetadata();
      await refetchSchedule();
      setShowSeedDialog(false);
      setPendingSolution(null);
      toast.success('Dienstplan erfolgreich geladen');
    } catch (error) {
      toast.error('Fehler beim Speichern des Dienstplans');
      console.error(error);
    }
  };

  const handleScheduleSelect = async (scheduleId: string) => {
    await selectSchedule.mutateAsync(scheduleId);
    await refetchSchedule();
  };

  const handleScheduleDelete = async (scheduleId: string) => {
    await deleteSchedule.mutateAsync(scheduleId);
    refetchSchedule();
  };

  const handleRefresh = async () => {
    await refetchMetadata();
    await refetchSchedule();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dienstplan</h1>
            <p className="text-muted-foreground">Analysiere und visualisiere Mitarbeiter-Schichtpläne</p>
          </div>
          {schedule && (
            <Badge variant="outline" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              {schedule.days.length} Tage
            </Badge>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <ScheduleFileUpload 
            onFileLoaded={handleFileLoaded} 
            isLoading={saveSchedule.isPending}
          />
          
          {/* Schedule Selector */}
          {schedulesMetadata && !isMetadataLoading && (
            <ScheduleSelector
              schedulesMetadata={schedulesMetadata}
              onScheduleSelect={handleScheduleSelect}
              onScheduleDelete={handleScheduleDelete}
              onRefresh={handleRefresh}
            />
          )}

          <Button onClick={toggleFullscreen} variant="outline" className="gap-2">
            <Maximize2 className="h-4 w-4" />
            {isFullscreen ? 'Exit' : 'Enter'} Fullscreen
          </Button>
        </div>
      </header>

      {isLoading ? (
        <Card className="border-border/50 p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-lg text-muted-foreground">Lädt...</div>
          </div>
        </Card>
      ) : schedule ? (
        <>
          {/* Statistics Grid */}
          <StatsGrid stats={schedule.stats} />

          {/* Schedule Table */}
          <Card className="overflow-hidden border-border/50 shadow-lg">
            <ScheduleTable
              employees={schedule.employees}
              days={schedule.days}
              shifts={schedule.shifts}
              variables={schedule.variables}
              fulfilledDayOffCells={schedule.fulfilledDayOffCells}
              fulfilledShiftWishCells={schedule.fulfilledShiftWishCells}
              allDayOffWishCells={schedule.allDayOffWishCells}
              allShiftWishColors={schedule.allShiftWishColors}
            />
          </Card>

          {/* Legend */}
          <ScheduleLegend />
        </>
      ) : (
        <Card className="border-border/50 p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-muted p-6">
              <Upload className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Kein Dienstplan geladen</h3>
              <p className="text-muted-foreground max-w-md">
                Lade eine solution.json Datei hoch, um die Dienstplan-Analyse und Visualisierungen anzuzeigen.
              </p>
            </div>
            <Button onClick={() => document.getElementById('file-upload')?.click()} className="gap-2">
              <Upload className="h-4 w-4" />
              Solution-Datei hochladen
            </Button>
          </div>
        </Card>
      )}

      {/* Seed Input Dialog */}
      <SeedInputDialog
        open={showSeedDialog}
        onOpenChange={setShowSeedDialog}
        onConfirm={handleSeedConfirm}
        isLoading={saveSchedule.isPending}
      />
    </div>
  );
}

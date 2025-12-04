"use client";

import { useState } from "react";
import { ScheduleMetadata, SchedulesMetadata } from "@/types/schedule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, CheckCircle, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ScheduleSelectorProps {
  schedulesMetadata: SchedulesMetadata;
  onScheduleSelect: (scheduleId: string) => Promise<void>;
  onScheduleDelete: (scheduleId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function ScheduleSelector({
  schedulesMetadata,
  onScheduleSelect,
  onScheduleDelete,
  onRefresh,
}: ScheduleSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (scheduleId: string) => {
    try {
      setIsLoading(true);
      await onScheduleSelect(scheduleId);
      toast.success("Dienstplan ausgewählt");
      await onRefresh();
    } catch (error) {
      toast.error("Fehler beim Auswählen des Dienstplans");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("Möchten Sie diesen Dienstplan wirklich löschen?")) {
      return;
    }

    try {
      setIsLoading(true);
      await onScheduleDelete(scheduleId);
      toast.success("Dienstplan gelöscht");
      await onRefresh();
    } catch (error) {
      toast.error("Fehler beim Löschen des Dienstplans");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (schedulesMetadata.schedules.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Keine Dienstpläne verfügbar. Laden Sie einen Dienstplan hoch oder
            generieren Sie einen neuen.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort schedules by generation date (newest first)
  const sortedSchedules = [...schedulesMetadata.schedules].sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 ">
        <Select
          value={schedulesMetadata.selectedScheduleId || ""}
          onValueChange={handleSelect}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Dienstplan auswählen..." />
          </SelectTrigger>
            <SelectContent>
              {sortedSchedules.map((schedule) => {
                return (
                  <SelectItem key={schedule.scheduleId} value={schedule.scheduleId}>
                    <div className="flex items-center gap-2">
                      {schedule.isSelected && <CheckCircle className="h-4 w-4" />}
                      <span>
                        Seed: {schedule.seed} - {formatDate(schedule.generatedAt)}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {schedulesMetadata.selectedScheduleId && (
          <div className="text-sm text-muted-foreground">
            {(() => {
              const selected = schedulesMetadata.schedules.find(
                (s) => s.scheduleId === schedulesMetadata.selectedScheduleId
              );
              if (!selected) return null;
              return (
                <span>
                  Aktuell: Seed {selected.seed} - {formatDate(selected.generatedAt)}
                </span>
              );
            })()}
          </div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              Alle Dienstpläne ({schedulesMetadata.schedules.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Alle Dienstpläne</DialogTitle>
              <DialogDescription>
                Vergleichen Sie verschiedene generierte Dienstpläne.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {sortedSchedules.map((schedule, index) => {
                return (
                  <Card
                    key={schedule.scheduleId}
                    className={
                      schedule.isSelected ? "border-primary border-2" : ""
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              Dienstplan #{index + 1}
                            </CardTitle>
                            {schedule.isSelected && (
                              <Badge variant="default">Ausgewählt</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(schedule.generatedAt)}
                            </span>
                            <span>Seed: {schedule.seed}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={schedule.isSelected ? "outline" : "default"}
                            onClick={() => handleSelect(schedule.scheduleId)}
                            disabled={isLoading || schedule.isSelected}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : schedule.isSelected ? (
                              "Aktiv"
                            ) : (
                              "Auswählen"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(schedule.scheduleId)}
                            disabled={isLoading || schedule.isSelected}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {schedule.comment && (
                          <div className="text-sm text-muted-foreground italic">
                            {schedule.comment}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold">Verstöße:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>
                                Vorwärtsrotation: {schedule.stats.forward_rotation_violations}
                              </li>
                              <li>
                                {">"}5 Tage am Stück: {schedule.stats.consecutive_working_days_gt_5}
                              </li>
                              <li>Kein freies WE: {schedule.stats.no_free_weekend}</li>
                              <li>
                                {">"}3 Nachtschichten: {schedule.stats.consecutive_night_shifts_gt_3}
                              </li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold">Weitere Metriken:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>
                                Keine freien Tage um WE:{" "}
                                {schedule.stats.no_free_days_around_weekend}
                              </li>
                              <li>
                                Nicht frei nach Nachtschicht:{" "}
                                {schedule.stats.not_free_after_night_shift}
                              </li>
                              <li>
                                Verletzte Wünsche: {schedule.stats.violated_wish_total}
                              </li>
                              <li>
                                Überstunden: {schedule.stats.total_overtime_hours}h
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      
        
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/card';

/**
 * Displays a legend explaining the visual indicators used in the schedule table.
 */
export function ScheduleLegend() {
  return (
    <Card className="border-border/50 p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Legende</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded bg-amber-400/20 border border-amber-400/40" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Freiwunsch erfüllt</p>
            <p className="text-xs text-muted-foreground">Mitarbeiter hat gewünschten freien Tag bekommen</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded bg-emerald-400/20 border border-emerald-400/40" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Schichtwunsch erfüllt</p>
            <p className="text-xs text-muted-foreground">Mitarbeiter hat gewünschten Schichtwunsch bekommen</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded bg-muted" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Wochenende</p>
            <p className="text-xs text-muted-foreground">Samstag oder Sonntag</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded bg-destructive/20 border border-destructive/40" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Überstunden</p>
            <p className="text-xs text-muted-foreground">Sollarbeitszeit überschritten</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

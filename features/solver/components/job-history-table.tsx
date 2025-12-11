'use client';

import { useJobHistory } from '@/features/solver/hooks/use-jobs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SolverJob } from '@/types/solver';
import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

function JobRow({ job }: { job: SolverJob }) {
  const [expanded, setExpanded] = useState(false);

  const getCommandLabel = (type: string) => {
    const labels: Record<string, string> = {
      fetch: 'Daten abrufen',
      solve: 'Lösen',
      'solve-multiple': 'Mehrfach lösen',
      insert: 'Einfügen',
      delete: 'Löschen',
      'process-solution': 'Lösung verarbeiten',
    };
    return labels[type] || type;
  };

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpanded(!expanded)}>
        <TableCell className="font-medium">
          {getCommandLabel(job.type)}
        </TableCell>
        <TableCell>
          {job.status === 'completed' ? (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Erfolgreich
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Fehlgeschlagen
            </Badge>
          )}
        </TableCell>
        <TableCell>
          {format(new Date(job.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}
        </TableCell>
        <TableCell>{(job.duration / 1000).toFixed(1)}s</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/30">
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Parameter:</p>
                <pre className="text-xs bg-background p-2 rounded overflow-auto wrap-break-word whitespace-pre-wrap">
                  {JSON.stringify(job.params, null, 2)}
                </pre>
              </div>

              {job.result && job.result.stdout && (
                <div>
                  <p className="text-sm font-medium mb-1">Ausgabe:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-40 wrap-break-word whitespace-pre-wrap">
                    {job.result.stdout}
                  </pre>
                </div>
              )}
              
              {(job.error || (job.result && job.result.stderr)) && (
                <div>
                  <p className="text-sm font-medium mb-1 text-destructive">Fehler:</p>
                  <pre className="text-xs bg-destructive/10 p-2 rounded overflow-auto max-h-40 text-destructive wrap-break-word whitespace-pre-wrap">
                    {job.error || job.result?.stderr}
                  </pre>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function JobHistoryTable() {
  const { data, isLoading, isError } = useJobHistory();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job-Verlauf</CardTitle>
          <CardDescription>Wird geladen...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job-Verlauf</CardTitle>
          <CardDescription className="text-destructive">
            Fehler beim Laden des Job-Verlaufs
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const jobs = data?.jobs || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job-Verlauf</CardTitle>
        <CardDescription>
          Letzte {jobs.length} ausgeführte Befehle (max. 10)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Noch keine Jobs ausgeführt
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Befehl</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Zeitpunkt</TableHead>
                  <TableHead>Dauer</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

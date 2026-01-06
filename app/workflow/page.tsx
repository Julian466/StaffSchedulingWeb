'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  Download, 
  Play, 
  PlayCircle, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { useWorkflow } from '@/contexts/workflow-context';

type WorkflowStep = 'delete' | 'fetch' | 'solve' | 'multi-solve' | 'insert';

interface StepState {
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
}

export default function WorkflowPage() {
  const router = useRouter();
  const { workflowData, isLoading: workflowLoading } = useWorkflow();
  
  // Use workflow data from server environment
  const caseId = workflowData?.caseId;
  const startDate = workflowData?.startDate;
  const endDate = workflowData?.endDate;

  const [steps, setSteps] = useState<Record<WorkflowStep, StepState>>({
    delete: { status: 'pending' },
    fetch: { status: 'pending' },
    solve: { status: 'pending' },
    'multi-solve': { status: 'pending' },
    insert: { status: 'pending' }
  });

  // Redirect if no workflow data available
  useEffect(() => {
    if (!workflowLoading && (!caseId || !startDate || !endDate)) {
      toast.error('Diese Seite ist nur im Workflow-Modus verfügbar. Starten Sie die Anwendung über TimeOffice.');
      router.push('/');
    }
  }, [caseId, startDate, endDate, router, workflowLoading]);

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    // Convert DD.MM.YYYY to ISO format for display
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    }
    return dateStr;
  };

  const convertToISODate = (dateStr: string): string => {
    // Convert DD.MM.YYYY to YYYY-MM-DD
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const executeStep = async (step: WorkflowStep) => {
    setSteps(prev => ({ ...prev, [step]: { status: 'running' } }));

    try {
      const isoStart = convertToISODate(startDate!);
      const isoEnd = convertToISODate(endDate!);

      let endpoint = '';
      const body: {
        unit: number;
        start: string;
        end: string;
        timeout?: number;
      } = {
        unit: parseInt(caseId!),
        start: isoStart,
        end: isoEnd
      };

      switch (step) {
        case 'delete':
          endpoint = '/api/solver/delete';
          break;
        case 'fetch':
          endpoint = '/api/solver/fetch';
          break;
        case 'solve':
          endpoint = '/api/solver/solve';
          body.timeout = 30;
          break;
        case 'multi-solve':
          endpoint = '/api/solver/solve-multiple';
          body.timeout = 30;
          break;
        case 'insert':
          endpoint = '/api/solver/insert';
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-case-id': caseId!
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Fehler bei der Ausführung');
      }

      setSteps(prev => ({ 
        ...prev, 
        [step]: { 
          status: 'success', 
          message: result.message || 'Erfolgreich abgeschlossen' 
        } 
      }));

      toast.success(`${getStepLabel(step)} erfolgreich abgeschlossen`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setSteps(prev => ({ 
        ...prev, 
        [step]: { 
          status: 'error', 
          message: errorMessage 
        } 
      }));
      toast.error(`Fehler bei ${getStepLabel(step)}: ${errorMessage}`);
    }
  };

  const getStepLabel = (step: WorkflowStep): string => {
    const labels: Record<WorkflowStep, string> = {
      delete: 'Case löschen',
      fetch: 'Daten aus Datenbank holen',
      solve: 'Dienstplan berechnen',
      'multi-solve': 'Mehrere Lösungen berechnen',
      insert: 'In TimeOffice exportieren'
    };
    return labels[step];
  };

  const getStepIcon = (step: WorkflowStep) => {
    const state = steps[step];
    if (state.status === 'running') return <Loader2 className="h-5 w-5 animate-spin" />;
    if (state.status === 'success') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (state.status === 'error') return <AlertCircle className="h-5 w-5 text-red-600" />;
    
    const icons: Record<WorkflowStep, React.ReactElement> = {
      delete: <Trash2 className="h-5 w-5" />,
      fetch: <Download className="h-5 w-5" />,
      solve: <Play className="h-5 w-5" />,
      'multi-solve': <PlayCircle className="h-5 w-5" />,
      insert: <Upload className="h-5 w-5" />
    };
    return icons[step];
  };

  const getStepDescription = (step: WorkflowStep): string => {
    const descriptions: Record<WorkflowStep, string> = {
      delete: 'Löscht vorhandene Daten für den ausgewählten Zeitraum',
      fetch: 'Lädt aktuelle Mitarbeiter- und Wunschdaten aus der Datenbank',
      solve: 'Berechnet eine optimale Lösung für den Dienstplan',
      'multi-solve': 'Berechnet mehrere alternative Lösungen zur Auswahl',
      insert: 'Exportiert den finalen Dienstplan zurück nach TimeOffice'
    };
    return descriptions[step];
  };

  if (!caseId || !startDate || !endDate) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dienstplan-Workflow</h1>
        <p className="text-muted-foreground">
          Erstellen Sie Schritt für Schritt einen optimierten Dienstplan
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Planungseinheit & Zeitraum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Planungseinheit</p>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                Case {caseId}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Von</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(startDate)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bis</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(endDate)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {(['delete', 'fetch', 'solve', 'multi-solve', 'insert'] as WorkflowStep[]).map((step, index) => (
          <Card key={step} className={
            steps[step].status === 'success' ? 'border-green-200 bg-green-50/50' :
            steps[step].status === 'error' ? 'border-red-200 bg-red-50/50' :
            steps[step].status === 'running' ? 'border-blue-200 bg-blue-50/50' :
            ''
          }>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{getStepLabel(step)}</CardTitle>
                    <CardDescription>{getStepDescription(step)}</CardDescription>
                  </div>
                </div>
                {getStepIcon(step)}
              </div>
            </CardHeader>
            <CardContent>
              {steps[step].message && (
                <Alert className="mb-4" variant={steps[step].status === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{steps[step].message}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={() => executeStep(step)}
                disabled={steps[step].status === 'running'}
                variant={steps[step].status === 'success' ? 'outline' : 'default'}
                className="w-full"
              >
                {steps[step].status === 'running' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {steps[step].status === 'success' ? 'Erneut ausführen' : 'Ausführen'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />
    </div>
  );
}

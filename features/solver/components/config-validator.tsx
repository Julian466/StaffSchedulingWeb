'use client';

import { useValidateConfig } from '@/features/solver/hooks/use-solver';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function ConfigValidator() {
  const { data, isLoading, isError, refetch, isFetching } = useValidateConfig();

  if (isLoading) {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Konfiguration wird überprüft...</AlertTitle>
      </Alert>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Fehler</AlertTitle>
        <AlertDescription>
          Konfiguration konnte nicht überprüft werden
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  // Not enabled
  if (!data.isEnabled) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Solver nicht aktiviert</AlertTitle>
        <AlertDescription>
            <p>
          Der Python-Solver ist in der Konfiguration deaktiviert. Setzen Sie
          <code className="mx-1 px-1 py-0.5 bg-muted rounded text-sm">
              staffSchedulingProject.include
          </code>
          auf <code className="px-1 py-0.5 bg-muted rounded text-sm">true</code> in der{' '}
          <code className="px-1 py-0.5 bg-muted rounded text-sm">config.json</code>.</p>
        </AlertDescription>
      </Alert>
    );
  }

  // Enabled but invalid
  if (!data.isValid) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Ungültige Konfiguration</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {data.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Teste...
              </>
            ) : (
              'Erneut testen'
            )}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Valid but execution test failed
  if (data.executionTest && !data.executionTest.success) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Python-Ausführung fehlgeschlagen</AlertTitle>
        <AlertDescription>
          <p>{data.executionTest.message}</p>
          {data.executionTest.details && (
            <p className="text-sm text-muted-foreground mt-1">
              {data.executionTest.details}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Teste...
              </>
            ) : (
              'Erneut testen'
            )}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Everything is valid
  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-900">Konfiguration gültig</AlertTitle>
      <AlertDescription className="text-green-700">
        {data.executionTest?.details && (
          <p className="text-sm">{data.executionTest.details}</p>
        )}
        {data.warnings.length > 0 && (
          <ul className="list-disc list-inside space-y-1 mt-2 text-yellow-700">
            {data.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Teste...
            </>
          ) : (
            'Erneut testen'
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

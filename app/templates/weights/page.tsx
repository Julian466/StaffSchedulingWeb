'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { EditTemplateDescriptionDialog } from '@/components/edit-template-description-dialog';
import { ViewTemplateDialog } from '@/components/view-template-dialog';
import {
  useWeightTemplates,
  useUpdateWeightTemplate,
  useDeleteWeightTemplate,
  useWeightTemplate,
} from '@/features/weights/hooks/use-weight-templates';
import {
  FileText,
  Trash2,
  Edit,
  AlertCircle,
  Scale,
  Clock,
  Eye,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export default function WeightTemplatesPage() {
  const { data: templates = [], isLoading, error } = useWeightTemplates();
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateWeightTemplate();
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteWeightTemplate();

  const [editingTemplate, setEditingTemplate] = useState<{
    id: string;
    description: string;
  } | null>(null);

  const [viewingTemplateId, setViewingTemplateId] = useState<string | null>(null);

  const { data: viewingTemplate } = useWeightTemplate(viewingTemplateId);

  // Transform template shape for the preview dialog
  const viewingTemplateForPreview = viewingTemplate
    ? {
        description: viewingTemplate._metadata.description,
        content: viewingTemplate.content,
        last_modified: viewingTemplate._metadata.last_modified,
      }
    : null;

  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);

  const handleSaveDescription = (newDescription: string) => {
    if (editingTemplate) {
      updateTemplate(
        {
          templateId: editingTemplate.id,
          description: newDescription,
        },
        {
          onSuccess: () => {
            setEditingTemplate(null);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (deletingTemplateId) {
      deleteTemplate(deletingTemplateId, {
        onSuccess: () => {
          setDeletingTemplateId(null);
        },
      });
    }
  };

  if (error) {
    return (
      <div className="py-6 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler beim Laden</AlertTitle>
          <AlertDescription>
            Die Templates konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Gewichtungs-Templates</CardTitle>
                <CardDescription>
                  Verwalten Sie Ihre gespeicherten Gewichtungskonfigurationen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Gewichtungs-Templates</CardTitle>
                <CardDescription>
                  Verwalten Sie Ihre gespeicherten Gewichtungskonfigurationen
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">{templates.length} Templates</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Keine Templates vorhanden</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Speichern Sie Ihre erste Gewichtungskonfiguration als Template auf der
                Gewichtungs-Seite.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:bg-accent/5 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">{template.description}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Zuletzt geändert:{' '}
                            {formatDistanceToNow(new Date(template.last_modified), {
                              addSuffix: true,
                              locale: de,
                            })}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {template.id}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingTemplateId(template.id)}
                          disabled={isUpdating || isDeleting}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditingTemplate({
                              id: template.id,
                              description: template.description,
                            })
                          }
                          disabled={isUpdating || isDeleting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingTemplateId(template.id)}
                          disabled={isUpdating || isDeleting}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingTemplate && (
        <EditTemplateDescriptionDialog
          open={!!editingTemplate}
          onOpenChange={(open) => !open && setEditingTemplate(null)}
          currentDescription={editingTemplate?.description ?? ''}
          onSave={handleSaveDescription}
          isSaving={isUpdating}
        />
      )}

      <ViewTemplateDialog
        open={!!viewingTemplateId}
        onOpenChange={(open) => !open && setViewingTemplateId(null)}
        template={viewingTemplateForPreview}
      />

      <AlertDialog
        open={!!deletingTemplateId}
        onOpenChange={(open) => !open && setDeletingTemplateId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Template löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie dieses Template löschen möchten? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

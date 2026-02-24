'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Template,
  TemplateSummary,
  CreateTemplateRequest,
} from '@/types/template';
import {
  listTemplatesAction,
  getTemplateAction,
  createTemplateAction,
  updateTemplateAction,
  deleteTemplateAction,
} from '@/features/templates/templates.actions';

/**
 * Generic hook factory for template operations.
 * Creates typed hooks for any template type.
 */
export function createTemplateHooks<T>(templateType: string) {
  /**
   * Hook to fetch all templates for the current case.
   *
   * @param caseId - The case ID
   */
  function useTemplates(caseId: number) {
    return useQuery({
      queryKey: [templateType, 'templates', caseId],
      queryFn: async (): Promise<TemplateSummary[]> => {
        return listTemplatesAction(templateType, caseId);
      },
    });
  }

  /**
   * Hook to fetch a single template by ID.
   *
   * @param caseId - The case ID
   * @param templateId - The template ID or null
   */
  function useTemplate(caseId: number, templateId: string | null) {
    return useQuery({
      queryKey: [templateType, 'template', caseId, templateId],
      queryFn: async (): Promise<Template<T>> => {
        if (!templateId) throw new Error('No template ID provided');
        return getTemplateAction<T>(templateType, caseId, templateId);
      },
      enabled: !!templateId,
    });
  }

  /**
   * Hook to create a new template.
   *
   * @param caseId - The case ID
   */
  function useCreateTemplate(caseId: number) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (request: CreateTemplateRequest<T>) => {
        return createTemplateAction(templateType, caseId, request.content, request.description);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [templateType, 'templates', caseId],
        });
        toast.success('Template erfolgreich erstellt');
      },
      onError: () => {
        toast.error('Fehler beim Erstellen des Templates');
      },
    });
  }

  /**
   * Hook to update a template's content or metadata.
   *
   * @param caseId - The case ID
   */
  function useUpdateTemplate(caseId: number) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        templateId,
        content,
        description,
      }: {
        templateId: string;
        content?: T;
        description?: string;
      }) => {
        return updateTemplateAction(templateType, caseId, templateId, { content, description });
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [templateType, 'templates', caseId],
        });
        queryClient.invalidateQueries({
          queryKey: [templateType, 'template', caseId, variables.templateId],
        });
        toast.success('Template erfolgreich aktualisiert');
      },
      onError: () => {
        toast.error('Fehler beim Aktualisieren des Templates');
      },
    });
  }

  /**
   * Hook to delete a template.
   *
   * @param caseId - The case ID
   */
  function useDeleteTemplate(caseId: number) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (templateId: string) => {
        return deleteTemplateAction(templateType, caseId, templateId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [templateType, 'templates', caseId],
        });
        toast.success('Template erfolgreich gelöscht');
      },
      onError: () => {
        toast.error('Fehler beim Löschen des Templates');
      },
    });
  }

  return {
    useTemplates,
    useTemplate,
    useCreateTemplate,
    useUpdateTemplate,
    useDeleteTemplate,
  };
}

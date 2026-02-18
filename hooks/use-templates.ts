'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCase } from '@/components/case-provider';
import { toast } from 'sonner';
import {
  Template,
  TemplateSummary,
  CreateTemplateRequest,
  UpdateTemplateMetadataRequest,
} from '@/types/template';

/**
 * Generic hook factory for template operations.
 * Creates typed hooks for any template type.
 */
export function createTemplateHooks<T>(templateType: string) {
  const API_URL = `/api/templates/${templateType}`;

  /**
   * Hook to fetch all templates for the current case.
   */
  function useTemplates() {
    const { currentCase } = useCase();

    return useQuery({
      queryKey: [templateType, 'templates', currentCase?.caseId],
      queryFn: async (): Promise<TemplateSummary[]> => {
        if (!currentCase) throw new Error('No case selected');
        const res = await fetch(API_URL, {
          headers: {
            'x-case-id': currentCase.caseId.toString(),
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch ${templateType} templates`);
        return res.json();
      },
      enabled: !!currentCase,
    });
  }

  /**
   * Hook to fetch a single template by ID.
   */
  function useTemplate(templateId: string | null) {
    const { currentCase } = useCase();

    return useQuery({
      queryKey: [templateType, 'template', currentCase?.caseId, templateId],
      queryFn: async (): Promise<Template<T>> => {
        if (!currentCase) throw new Error('No case selected');
        if (!templateId) throw new Error('No template ID provided');
        const res = await fetch(`${API_URL}/${templateId}`, {
          headers: {
            'x-case-id': currentCase.caseId.toString(),
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch ${templateType} template`);
        return res.json();
      },
      enabled: !!currentCase && !!templateId,
    });
  }

  /**
   * Hook to create a new template.
   */
  function useCreateTemplate() {
    const { currentCase } = useCase();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (request: CreateTemplateRequest<T>) => {
        if (!currentCase) throw new Error('No case selected');
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-case-id': currentCase.caseId.toString(),
          },
          body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error(`Failed to create ${templateType} template`);
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [templateType, 'templates', currentCase?.caseId],
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
   */
  function useUpdateTemplate() {
    const { currentCase } = useCase();
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
        if (!currentCase) throw new Error('No case selected');
        const res = await fetch(`${API_URL}/${templateId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-case-id': currentCase.caseId.toString(),
          },
          body: JSON.stringify({ content, description }),
        });
        if (!res.ok) throw new Error(`Failed to update ${templateType} template`);
        return res.json();
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [templateType, 'templates', currentCase?.caseId],
        });
        queryClient.invalidateQueries({
          queryKey: [templateType, 'template', currentCase?.caseId, variables.templateId],
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
   */
  function useDeleteTemplate() {
    const { currentCase } = useCase();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (templateId: string) => {
        if (!currentCase) throw new Error('No case selected');
        const res = await fetch(`${API_URL}/${templateId}`, {
          method: 'DELETE',
          headers: {
            'x-case-id': currentCase.caseId.toString(),
          },
        });
        if (!res.ok) throw new Error(`Failed to delete ${templateType} template`);
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [templateType, 'templates', currentCase?.caseId],
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

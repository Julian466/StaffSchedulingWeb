'use client';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {GlobalWishesTemplateContent} from '@/src/entities/models/template.model';
import {createTemplateHooks} from '@/hooks/use-templates';
import {
    importGlobalWishesTemplateAction,
} from '../global-wishes-and-blocked.actions';

/**
 * Hooks for managing global wishes templates.
 * Provides CRUD operations for templates with employee matching support.
 */
export const {
    useTemplates: useGlobalWishesTemplates,
    useTemplate: useGlobalWishesTemplate,
    useCreateTemplate: useCreateGlobalWishesTemplate,
    useUpdateTemplate: useUpdateGlobalWishesTemplate,
    useDeleteTemplate: useDeleteGlobalWishesTemplate,
} = createTemplateHooks<GlobalWishesTemplateContent>('global-wishes');

/**
 * Hook to import a global wishes template.
 * Always performs a full reset: deletes all mw and gw, then creates gw from template
 * and generates fresh monthly entries.
 */
export function useImportGlobalWishesTemplate(caseId: number, monthYear: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (templateId: string) => {
            return importGlobalWishesTemplateAction(caseId, monthYear, templateId);
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['global-wishes-and-blocked', caseId, monthYear]});
            qc.invalidateQueries({queryKey: ['wishes-and-blocked', caseId, monthYear]});
        },
    });
}
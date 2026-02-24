'use client';

import { Weights } from '@/src/entities/models/weights.model';
import { createTemplateHooks } from '@/hooks/use-templates';

/**
 * Hooks for managing weight templates.
 */
export const {
  useTemplates: useWeightTemplates,
  useTemplate: useWeightTemplate,
  useCreateTemplate: useCreateWeightTemplate,
  useUpdateTemplate: useUpdateWeightTemplate,
  useDeleteTemplate: useDeleteWeightTemplate,
} = createTemplateHooks<Weights>('weights');

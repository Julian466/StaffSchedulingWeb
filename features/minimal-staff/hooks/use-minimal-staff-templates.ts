'use client';

import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { createTemplateHooks } from '@/hooks/use-templates';

/**
 * Hooks for managing minimal staff templates.
 */
export const {
  useTemplates: useMinimalStaffTemplates,
  useTemplate: useMinimalStaffTemplate,
  useCreateTemplate: useCreateMinimalStaffTemplate,
  useUpdateTemplate: useUpdateMinimalStaffTemplate,
  useDeleteTemplate: useDeleteMinimalStaffTemplate,
} = createTemplateHooks<MinimalStaffRequirements>('minimal-staff');

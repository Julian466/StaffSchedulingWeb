'use client';

import { MinimalStaffRequirements } from '@/types/minimal-staff';
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

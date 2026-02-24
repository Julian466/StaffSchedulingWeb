'use client';

import {GlobalWishesTemplateContent} from '@/src/entities/models/template.model';
import {createTemplateHooks} from '@/hooks/use-templates';

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

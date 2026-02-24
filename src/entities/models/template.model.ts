import {z} from 'zod';
import {WishesAndBlockedEmployeeSchema} from './wishes-and-blocked.model';

export const TemplateTypeSchema = z.enum(['weights', 'minimal-staff', 'global-wishes']);
export type TemplateType = z.infer<typeof TemplateTypeSchema>;

export const TemplateMetadataSchema = z.object({
    id: z.string(),
    description: z.string(),
    last_modified: z.string(),
});

export type TemplateMetadata = z.infer<typeof TemplateMetadataSchema>;

export const TemplateSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
    z.object({
        content: contentSchema,
        _metadata: TemplateMetadataSchema,
    });

export interface Template<T> {
    content: T;
    _metadata: TemplateMetadata;
}

export const TemplateSummarySchema = z.object({
    id: z.string(),
    description: z.string(),
    last_modified: z.string(),
    type: TemplateTypeSchema,
    fileName: z.string(),
});

export type TemplateSummary = z.infer<typeof TemplateSummarySchema>;

export const CreateTemplateRequestSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
    z.object({
        content: contentSchema,
        description: z.string(),
    });

export interface CreateTemplateRequest<T> {
    content: T;
    description: string;
}

export const UpdateTemplateMetadataRequestSchema = z.object({
    description: z.string(),
});

export type UpdateTemplateMetadataRequest = z.infer<typeof UpdateTemplateMetadataRequestSchema>;

export const GlobalWishesTemplateMetadataSchema = TemplateMetadataSchema.extend({
    employeeCount: z.number(),
    employeeIds: z.array(z.number()),
});

export type GlobalWishesTemplateMetadata = z.infer<typeof GlobalWishesTemplateMetadataSchema>;

export const GlobalWishesTemplateContentSchema = z.object({
    employees: z.array(WishesAndBlockedEmployeeSchema),
});

export type GlobalWishesTemplateContent = z.infer<typeof GlobalWishesTemplateContentSchema>;

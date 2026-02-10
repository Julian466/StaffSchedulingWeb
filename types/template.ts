/**
 * Generic type definitions for template management system.
 * Supports templates for weights, minimal-staff, and other future template types.
 */

/**
 * Available template types in the system.
 */
export type TemplateType = 'weights' | 'minimal-staff' | 'global-wishes';

/**
 * Metadata for a template.
 * Stored in the _metadata field of template JSON files.
 */
export interface TemplateMetadata {
  /** Unique identifier (timestamp-based) */
  id: string;
  /** User-provided description of the template */
  description: string;
  /** Last modification timestamp (ISO string) */
  last_modified: string;
}

/**
 * Complete template structure with content and metadata.
 * Generic type T represents the content structure (e.g., Weights).
 */
export interface Template<T> {
  /** The actual content/data of the template */
  content: T;
  /** Metadata about the template */
  _metadata: TemplateMetadata;
}

/**
 * Summary of a template (without full content).
 * Used for listing templates efficiently.
 */
export interface TemplateSummary {
  /** Unique identifier */
  id: string;
  /** Template description */
  description: string;
  /** Last modification timestamp */
  last_modified: string;
  /** Template type */
  type: TemplateType;
  /** File name */
  fileName: string;
}

/**
 * Request payload for creating a new template.
 */
export interface CreateTemplateRequest<T> {
  /** The content to save as a template */
  content: T;
  /** Description of the template */
  description: string;
}

/**
 * Request payload for updating template metadata.
 */
export interface UpdateTemplateMetadataRequest {
  /** New description for the template */
  description: string;
}

/**
 * Enhanced metadata for global wishes templates.
 * Includes employee count and IDs for quick preview.
 */
export interface GlobalWishesTemplateMetadata extends TemplateMetadata {
  /** Number of employees in the template */
  employeeCount: number;
  /** Array of employee IDs included in the template */
  employeeIds: number[];
}

/**
 * Content structure for global wishes templates.
 * Contains employees with their wishes and blocked data.
 */
export interface GlobalWishesTemplateContent {
  /** Array of employees with their wishes and blocked data */
  employees: Array<{
    key: number;
    firstname: string;
    name: string;
    wish_days: number[];
    wish_shifts: [number, string][];
    blocked_days: number[];
    blocked_shifts: [number, string][];
  }>;
}


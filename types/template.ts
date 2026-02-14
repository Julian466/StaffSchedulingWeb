/**
 * Generic type definitions for template management system.
 * Supports templates for weights, minimal-staff, and other future template types.
 */

/**
 * Available template types in the system.
 */
export type TemplateType = 'weights' | 'minimal-staff';

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

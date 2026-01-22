import path from 'path';
import fs from 'fs/promises';
import { Template, TemplateMetadata, TemplateSummary, TemplateType } from '@/types/template';
import { getCasesDirectory } from '@/lib/config/app-config';

/**
 * Generic repository for managing templates.
 * Handles file-based storage of templates in the case folder structure.
 */
export class TemplateRepository<T> {
  private templateType: TemplateType;

  constructor(templateType: TemplateType) {
    this.templateType = templateType;
  }

  /**
   * Gets the base directory path for templates of this type.
   */
  private getTemplateDir(caseId: number): string {
    const casesDir = getCasesDirectory();
    return path.join(
      casesDir,
      caseId.toString(),
      'templates',
      this.templateType
    );
  }

  /**
   * Gets the full file path for a specific template.
   */
  private getTemplatePath(caseId: number, templateId: string): string {
    const fileName = `${this.templateType}_${templateId}.json`;
    return path.join(this.getTemplateDir(caseId), fileName);
  }

  /**
   * Ensures the template directory exists.
   */
  private async ensureTemplateDir(caseId: number): Promise<void> {
    const dir = this.getTemplateDir(caseId);
    await fs.mkdir(dir, { recursive: true });
  }

  /**
   * Lists all templates of this type for a specific case.
   * Returns summaries without loading full content.
   */
  async list(caseId: number): Promise<TemplateSummary[]> {
    try {
      const dir = this.getTemplateDir(caseId);
      await this.ensureTemplateDir(caseId);
      
      const files = await fs.readdir(dir);
      const templateFiles = files.filter(
        (file) => file.startsWith(`${this.templateType}_`) && file.endsWith('.json')
      );

      const summaries: TemplateSummary[] = [];

      for (const fileName of templateFiles) {
        const filePath = path.join(dir, fileName);
        const content = await fs.readFile(filePath, 'utf-8');
        const template = JSON.parse(content) as Template<T>;

        summaries.push({
          id: template._metadata.id,
          description: template._metadata.description,
          last_modified: template._metadata.last_modified,
          type: this.templateType,
          fileName,
        });
      }

      // Sort by last_modified descending (newest first)
      return summaries.sort(
        (a, b) =>
          new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime()
      );
    } catch (error) {
      // If directory doesn't exist, return empty array
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Gets a specific template by ID.
   */
  async get(caseId: number, templateId: string): Promise<Template<T>> {
    const filePath = this.getTemplatePath(caseId, templateId);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Template<T>;
  }

  /**
   * Creates a new template.
   * Generates a unique ID based on timestamp.
   */
  async create(
    caseId: number,
    content: T,
    description: string
  ): Promise<Template<T>> {
    await this.ensureTemplateDir(caseId);

    const metadata: TemplateMetadata = {
      id: Date.now().toString(),
      description,
      last_modified: new Date().toISOString(),
    };

    const template: Template<T> = {
      content,
      _metadata: metadata,
    };

    const filePath = this.getTemplatePath(caseId, metadata.id);
    await fs.writeFile(filePath, JSON.stringify(template, null, 2), 'utf-8');

    return template;
  }

  /**
   * Updates an existing template's content and/or metadata.
   */
  async update(
    caseId: number,
    templateId: string,
    updates: { content?: T; description?: string }
  ): Promise<Template<T>> {
    const existing = await this.get(caseId, templateId);

    const updated: Template<T> = {
      content: updates.content ?? existing.content,
      _metadata: {
        ...existing._metadata,
        description: updates.description ?? existing._metadata.description,
        last_modified: new Date().toISOString(),
      },
    };

    const filePath = this.getTemplatePath(caseId, templateId);
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');

    return updated;
  }

  /**
   * Deletes a template.
   */
  async delete(caseId: number, templateId: string): Promise<void> {
    const filePath = this.getTemplatePath(caseId, templateId);
    await fs.unlink(filePath);
  }

  /**
   * Replaces an existing template with new content.
   * Preserves the template ID but updates content and metadata.
   */
  async replace(
    caseId: number,
    templateId: string,
    content: T,
    description?: string
  ): Promise<Template<T>> {
    const existing = await this.get(caseId, templateId);

    const updated: Template<T> = {
      content,
      _metadata: {
        ...existing._metadata,
        description: description ?? existing._metadata.description,
        last_modified: new Date().toISOString(),
      },
    };

    const filePath = this.getTemplatePath(caseId, templateId);
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');

    return updated;
  }
}

/**
 * Factory function to create a template repository for a specific type.
 */
export function createTemplateRepository<T>(
  templateType: TemplateType
): TemplateRepository<T> {
  return new TemplateRepository<T>(templateType);
}

import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import fs from 'fs/promises';
import {getCasesDirectory} from '@/lib/config/app-config';
import {Template, TemplateType} from '@/src/entities/models/template.model';

export interface TemplateDatabase {
    templates: Template<unknown>[];
}

export async function getTemplateDb(caseId: number, templateType: TemplateType) {
    const casesDir = getCasesDirectory();
    const dir = path.join(casesDir, caseId.toString(), 'templates');
    await fs.mkdir(dir, {recursive: true});
    const filePath = path.join(dir, `${templateType}.json`);
    return JSONFilePreset<TemplateDatabase>(filePath, { templates: [] }); // ← inline, nie mutierbar
}

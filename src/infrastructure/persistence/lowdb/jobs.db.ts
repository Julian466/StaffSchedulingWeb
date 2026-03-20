import path from 'path';
import {JSONFilePreset} from "lowdb/node";
import fs from 'fs/promises';
import {JobHistoryData} from "@/src/entities/models";
import {getCasePath} from "@/lib/config/app-config";

async function ensureWebDir(caseId: number, monthYear: string): Promise<string> {
    const webDir = path.join(getCasePath(caseId, monthYear), 'web');
    await fs.mkdir(webDir, {recursive: true});
    return webDir;
}

export async function getJobHistoryDb(caseId: number, monthYear: string) {
    const webDir = await ensureWebDir(caseId, monthYear);
    const filePath = path.join(webDir, 'jobs.json');
    return JSONFilePreset<JobHistoryData>(filePath, {jobs: []});
}

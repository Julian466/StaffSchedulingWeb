import path from 'path';
import {JSONFilePreset} from "lowdb/node";
import {JobHistoryData} from "@/src/entities/models";
import {getCasePath} from "@/lib/config/app-config";

const defaultData: JobHistoryData = {
    jobs: []
};

export async function getJobHistoryDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'web', 'jobs.json');
    return JSONFilePreset<JobHistoryData>(filePath, defaultData);
}

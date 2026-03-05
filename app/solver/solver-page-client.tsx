'use client';

import {useState} from 'react';
import {ConfigValidator} from '@/features/solver/components/config-validator';
import {SolverControlPanel} from '@/features/solver/components/solver-control-panel';
import {JobHistoryTable} from '@/features/solver/components/job-history-table';
import {getJobs} from '@/features/solver/solver.actions';
import type {SolverConfigResult} from '@/src/entities/models/solver.model';
import type {SolverJob} from '@/src/entities/models/solver.model';

interface SolverPageClientProps {
    caseId: number;
    monthYear: string;
    initialConfigValidation: SolverConfigResult | null;
    initialJobs: SolverJob[];
}

export function SolverPageClient({caseId, monthYear, initialConfigValidation, initialJobs}: SolverPageClientProps) {
    const [jobs, setJobs] = useState<SolverJob[]>(initialJobs);

    const refreshJobs = async () => {
        try {
            const data = await getJobs(caseId, monthYear);
            setJobs(data.jobs);
        } catch {
            // silently fail
        }
    };

    return (
        <div className="space-y-6 py-6">
            <div>
                <h1 className="text-3xl font-bold">Solver</h1>
                <p className="text-muted-foreground mt-2">
                    Steuern Sie den Python-Solver zur automatischen Dienstplanerstellung
                </p>
            </div>

            <ConfigValidator initialData={initialConfigValidation}/>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SolverControlPanel caseId={caseId} monthYear={monthYear} onAfterOperation={refreshJobs}/>
                <div className="space-y-6">
                    <JobHistoryTable jobs={jobs}/>
                </div>
            </div>
        </div>
    );
}

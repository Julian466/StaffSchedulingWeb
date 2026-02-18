'use client';

import {ConfigValidator} from '@/features/solver/components/config-validator';
import {SolverControlPanel} from '@/features/solver/components/solver-control-panel';
import {JobHistoryTable} from '@/features/solver/components/job-history-table';

export default function SolverPage() {
    return (
        <div className="space-y-6 py-6">
            <div>
                <h1 className="text-3xl font-bold">Solver</h1>
                <p className="text-muted-foreground mt-2">
                    Steuern Sie den Python-Solver zur automatischen Dienstplanerstellung
                </p>
            </div>

            <ConfigValidator/>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SolverControlPanel/>
                <div className="space-y-6">
                    <JobHistoryTable/>
                </div>
            </div>
        </div>
    );
}

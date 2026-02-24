'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {parseMonthYear} from '@/lib/utils/case-utils';
import {CaseUnit} from '@/src/entities/models/case.model';
import {listCasesAction} from '@/features/cases/cases.actions';


export function CaseSelector() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const caseIdStr = searchParams.get('caseId');
    const monthYear = searchParams.get('monthYear') ?? '';
    const caseId = caseIdStr ? parseInt(caseIdStr, 10) : null;

    const [availableCases, setAvailableCases] = useState<CaseUnit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        listCasesAction()
            .then((data) => setAvailableCases(data.units ?? []))
            .catch(() => setAvailableCases([]))
            .finally(() => setIsLoading(false));
    }, []);

    // Build a flat list of all case options for the selector
    const allCaseOptions = availableCases.flatMap(unit =>
        unit.months.map(monthYear => ({
            unitId: unit.unitId,
            monthYear,
            ...parseMonthYear(monthYear)
        }))
    );

    const getMonthName = (month: number) =>
        new Date(0, month - 1).toLocaleString('de-DE', {month: 'long'});

    const handleCaseChange = (value: string) => {
        const [unitIdStr, my] = value.split('|');
        const params = new URLSearchParams(searchParams.toString());
        params.set('caseId', unitIdStr);
        params.set('monthYear', my);
        router.push(`${pathname}?${params.toString()}`);
    };


    const currentValue = caseId && monthYear ? `${caseId}|${monthYear}` : '';

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Case:</span>
            <Select
                value={currentValue}
                onValueChange={handleCaseChange}
                disabled={isLoading}
            >
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Wähle Case"/>
                </SelectTrigger>
                <SelectContent>
                    {allCaseOptions.map((option) => (
                        <SelectItem
                            key={`${option.unitId}|${option.monthYear}`}
                            value={`${option.unitId}|${option.monthYear}`}
                        >
                            Case {option.unitId} - {getMonthName(option.month)} {option.year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

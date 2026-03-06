'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {parseMonthYear} from '@/lib/utils/case-utils';
import {CaseUnit} from '@/src/entities/models/case.model';
import {listCasesAction} from '@/features/cases/cases.actions';


interface CaseSelectorProps {
    disabled?: boolean;
    lockedCaseId?: number | null;
    lockedMonthYear?: string | null;
}

export function CaseSelector({disabled, lockedCaseId, lockedMonthYear}: CaseSelectorProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();


    const urlCaseIdStr = searchParams.get('caseId');
    const urlMonthYear = searchParams.get('monthYear');

    // 2. Entscheide: Wenn gelockt, nimm die lock-Werte, sonst URL
    const effectiveCaseId = disabled && lockedCaseId
        ? lockedCaseId
        : (urlCaseIdStr ? parseInt(urlCaseIdStr, 10) : null);

    const effectiveMonthYear = disabled && lockedMonthYear
        ? lockedMonthYear
        : (urlMonthYear ?? '');


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


    const currentValue = effectiveCaseId && effectiveMonthYear
        ? `${effectiveCaseId}|${effectiveMonthYear}`
        : '';

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Case:</span>
            <Select
                value={currentValue}
                onValueChange={handleCaseChange}
                disabled={disabled || isLoading}
            >
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder={
                        disabled && lockedCaseId && lockedMonthYear
                            ? `Case ${lockedCaseId} - ${lockedMonthYear.replace('_', ' ')}`
                            : "Wähle Case"
                    }/>
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

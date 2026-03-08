import {DomainError} from './base.errors';

export class SolveInfeasibleError extends DomainError {
    constructor(details?: string) {
        super(
            details
                ? `Keine zulässige Lösung gefunden (INFEASIBLE): ${details}`
                : 'Keine zulässige Lösung gefunden (INFEASIBLE)',
            422
        );
    }
}

export class SolveUnknownError extends DomainError {
    constructor(details?: string) {
        super(
            details
                ? `Solver-Ergebnis unbekannt (UNKNOWN): ${details}`
                : 'Solver-Ergebnis unbekannt (UNKNOWN)',
            422
        );
    }
}

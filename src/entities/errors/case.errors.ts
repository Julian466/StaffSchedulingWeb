import {DuplicateResourceError, ResourceNotFoundError} from './base.errors';

export class CaseNotFoundError extends ResourceNotFoundError {
    constructor(caseId: number, monthYear: string) {
        super(`Case ${caseId}/${monthYear} not found`);
    }
}

export class DuplicateCaseError extends DuplicateResourceError {
    constructor(caseId: number, monthYear: string) {
        super(`Case ${caseId}/${monthYear} already exists`);
    }
}

import type {IDeleteTemplateUseCase} from '@/src/application/use-cases/templates/delete-template.use-case';
import type {TemplateType} from '@/src/entities/models/template.model';
import {isDomainError} from '@/src/entities/errors/base.errors';

export interface IDeleteTemplateController {
    (input: { templateType: TemplateType; caseId: number; templateId: string }): Promise<
        { data: { success: boolean } } | { error: string }
    >;
}

export function makeDeleteTemplateController(
    deleteTemplateUseCase: IDeleteTemplateUseCase
): IDeleteTemplateController {
    return async ({templateType, caseId, templateId}) => {
        try {
            await deleteTemplateUseCase({templateType, caseId, templateId});
            return {data: {success: true}};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}

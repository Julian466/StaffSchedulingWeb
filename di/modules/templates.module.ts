import {createModule} from '@evyweb/ioctopus';
import {DI_SYMBOLS} from '@/di/types';
import {FileTemplateRepository} from '@/src/infrastructure/repositories/file-template.repository';
import {makeListTemplatesUseCase} from '@/src/application/use-cases/templates/list-templates.use-case';
import {makeGetTemplateUseCase} from '@/src/application/use-cases/templates/get-template.use-case';
import {makeCreateTemplateUseCase} from '@/src/application/use-cases/templates/create-template.use-case';
import {makeUpdateTemplateUseCase} from '@/src/application/use-cases/templates/update-template.use-case';
import {makeDeleteTemplateUseCase} from '@/src/application/use-cases/templates/delete-template.use-case';
import {makeListTemplatesController} from '@/src/controllers/templates/list-templates.controller';
import {makeGetTemplateController} from '@/src/controllers/templates/get-template.controller';
import {makeCreateTemplateController} from '@/src/controllers/templates/create-template.controller';
import {makeUpdateTemplateController} from '@/src/controllers/templates/update-template.controller';
import {makeDeleteTemplateController} from '@/src/controllers/templates/delete-template.controller';

export function createTemplatesModule() {
    const m = createModule();

    m.bind(DI_SYMBOLS.ITemplateRepository).toClass(FileTemplateRepository, [], 'singleton');

    m.bind(DI_SYMBOLS.IListTemplatesUseCase).toHigherOrderFunction(makeListTemplatesUseCase, [DI_SYMBOLS.ITemplateRepository]);
    m.bind(DI_SYMBOLS.IGetTemplateUseCase).toHigherOrderFunction(makeGetTemplateUseCase, [DI_SYMBOLS.ITemplateRepository]);
    m.bind(DI_SYMBOLS.ICreateTemplateUseCase).toHigherOrderFunction(makeCreateTemplateUseCase, [DI_SYMBOLS.ITemplateRepository]);
    m.bind(DI_SYMBOLS.IUpdateTemplateUseCase).toHigherOrderFunction(makeUpdateTemplateUseCase, [DI_SYMBOLS.ITemplateRepository]);
    m.bind(DI_SYMBOLS.IDeleteTemplateUseCase).toHigherOrderFunction(makeDeleteTemplateUseCase, [DI_SYMBOLS.ITemplateRepository]);

    m.bind(DI_SYMBOLS.IListTemplatesController).toHigherOrderFunction(makeListTemplatesController, [DI_SYMBOLS.IListTemplatesUseCase]);
    m.bind(DI_SYMBOLS.IGetTemplateController).toHigherOrderFunction(makeGetTemplateController, [DI_SYMBOLS.IGetTemplateUseCase]);
    m.bind(DI_SYMBOLS.ICreateTemplateController).toHigherOrderFunction(makeCreateTemplateController, [DI_SYMBOLS.ICreateTemplateUseCase]);
    m.bind(DI_SYMBOLS.IUpdateTemplateController).toHigherOrderFunction(makeUpdateTemplateController, [DI_SYMBOLS.IUpdateTemplateUseCase]);
    m.bind(DI_SYMBOLS.IDeleteTemplateController).toHigherOrderFunction(makeDeleteTemplateController, [DI_SYMBOLS.IDeleteTemplateUseCase]);

    return m;
}

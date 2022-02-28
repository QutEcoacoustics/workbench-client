import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Question } from "@models/Question";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateQuestion } from "@test/fakes/Question";
import { validateStandardApi } from "@test/helpers/api-common";
import { ShallowQuestionsService } from "./questions.service";

describe("ShallowQuestionsService", (): void => {
  const createModel = () => new Question(generateQuestion({ id: 5 }));
  const baseUrl = "/questions/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ShallowQuestionsService>;
  const createService = createServiceFactory({
    service: ShallowQuestionsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    spec,
    Question,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
